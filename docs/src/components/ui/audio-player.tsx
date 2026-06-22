"use client"

import { cn } from "@/lib/utils"
import { Download, Loader2, Pause, Play } from "lucide-react"
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type HTMLAttributes,
  type PointerEvent,
  type ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────────────────────────
// AudioPlayer: composable playback kit for recordings, transcripts, and voice
// notes. Wrap content in AudioPlayerProvider, then compose sub-components or
// use the pre-built AudioPlayerBar for the forest-green recording strip.
//
// Two placement modes on AudioPlayerBar:
//   inline — sits in page flow (detail panels, document previews)
//   docked — fixed to the viewport bottom (meeting transcript review)
// ─────────────────────────────────────────────────────────────────────────────

export interface AudioPlayerItem<TData = unknown> {
  id: string | number
  src: string
  data?: TData
}

/** Jump point metadata for transcript sync (seek via `useAudioPlayerSeek`, not rendered on the bar). */
export interface AudioPlayerMarker {
  id: string
  /** Position in seconds from the start of the track. */
  time: number
  /** Optional label for tooltips and screen readers. */
  label?: string
}

export type AudioPlayerPosition = "inline" | "docked"

interface AudioPlayerContextValue<TData = unknown> {
  ref: React.RefObject<HTMLAudioElement | null>
  activeItem: AudioPlayerItem<TData> | null
  duration: number | null
  error: MediaError | null
  isPlaying: boolean
  isBuffering: boolean
  playbackRate: number
  peaks: number[]
  peaksLoading: boolean
  isItemActive: (id: string | number) => boolean
  setActiveItem: (item: AudioPlayerItem<TData> | null) => void
  play: (item?: AudioPlayerItem<TData>) => void
  pause: () => void
  seek: (time: number) => void
  setPlaybackRate: (rate: number) => void
  setPeaks: (peaks: number[]) => void
}

const AudioPlayerContext = createContext<AudioPlayerContextValue | null>(null)

const DEFAULT_PEAK_COUNT = 120
const WAVEFORM_BAR_WIDTH = 3
const WAVEFORM_BAR_GAP = 1

/** In-memory cache so the same recording is not decoded twice. */
const peaksCache = new Map<string, number[]>()

/**
 * Decodes an audio file and extracts normalised peak amplitudes (0–1) for each
 * bar in the waveform. Uses the Web Audio API; requires a fetchable same-origin
 * or CORS-enabled URL.
 */
export async function extractAudioPeaksFromSrc({
  src,
  barCount = DEFAULT_PEAK_COUNT,
}: {
  src: string
  barCount?: number
}): Promise<number[]> {
  const cacheKey = `${src}:${barCount}`
  const cached = peaksCache.get(cacheKey)

  if (cached) {
    return cached
  }

  const response = await fetch(src)

  if (!response.ok) {
    throw new Error(`Failed to fetch audio (${response.status})`)
  }

  const arrayBuffer = await response.arrayBuffer()
  const audioContext = new AudioContext()

  try {
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer.slice(0))
    const channelData = audioBuffer.getChannelData(0)
    const samplesPerBar = Math.max(1, Math.floor(channelData.length / barCount))
    const peaks: number[] = []

    for (let index = 0; index < barCount; index += 1) {
      const start = index * samplesPerBar
      const end = index === barCount - 1 ? channelData.length : start + samplesPerBar
      let peak = 0

      for (let sample = start; sample < end; sample += 1) {
        peak = Math.max(peak, Math.abs(channelData[sample] ?? 0))
      }

      peaks.push(peak)
    }

    const maxPeak = Math.max(...peaks, 0.001)
    const normalised = peaks.map((peak) => peak / maxPeak)
    peaksCache.set(cacheKey, normalised)
    return normalised
  } finally {
    await audioContext.close()
  }
}

/**
 * Draws the waveform bars and playhead onto a canvas. Played bars and the
 * playhead share the same `progress * width` position so scrubbing stays aligned.
 */
function drawAudioWaveform({
  context,
  width,
  height,
  peaks,
  progress,
}: {
  context: CanvasRenderingContext2D
  width: number
  height: number
  peaks: number[]
  progress: number
}) {
  context.clearRect(0, 0, width, height)

  if (peaks.length === 0 || width <= 0 || height <= 0) {
    return
  }

  const barCount = peaks.length
  const nominalWidth = barCount * WAVEFORM_BAR_WIDTH + (barCount - 1) * WAVEFORM_BAR_GAP
  const scale = width / nominalWidth
  const barWidth = WAVEFORM_BAR_WIDTH * scale
  const barGap = WAVEFORM_BAR_GAP * scale
  const progressX = Math.max(0, Math.min(width, progress * width))

  for (let index = 0; index < barCount; index += 1) {
    const x = index * (barWidth + barGap)
    const barHeight = Math.max(4, peaks[index] * height * 0.88)
    const y = (height - barHeight) / 2
    const barEnd = x + barWidth
    context.fillStyle = barEnd <= progressX ? "#C8F169" : "rgba(255, 255, 255, 0.2)"
    context.beginPath()
    context.roundRect(x, y, barWidth, barHeight, barWidth / 2)
    context.fill()
  }

  context.fillStyle = "#FFFFFF"
  context.fillRect(Math.max(0, progressX - 0.5), 0, 1, height)
}

/**
 * Returns true when the audio element is already pointing at the given src.
 */
function audioSourcesMatch({
  audio,
  src,
}: {
  audio: HTMLAudioElement
  src: string
}): boolean {
  if (!src) {
    return !audio.src
  }

  try {
    const resolved =
      src.startsWith("http://") ||
      src.startsWith("https://") ||
      src.startsWith("blob:")
        ? src
        : new URL(src, window.location.origin).href

    return audio.src === resolved
  } catch {
    return false
  }
}

/**
 * Formats seconds as M:SS or H:MM:SS for display in the player chrome.
 */
export function formatAudioTime({ seconds }: { seconds: number }): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00"
  }

  const total = Math.floor(seconds)
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const secs = total % 60
  const paddedSecs = secs.toString().padStart(2, "0")

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, "0")}:${paddedSecs}`
  }

  return `${minutes}:${paddedSecs}`
}

/**
 * Generates deterministic pseudo waveform peaks from a seed string when real
 * amplitude data is unavailable.
 */
export function generateAudioPeaks({
  seed,
  count = DEFAULT_PEAK_COUNT,
}: {
  seed: string
  count?: number
}): number[] {
  let hash = 0

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash << 5) - hash + seed.charCodeAt(index)
    hash |= 0
  }

  const peaks: number[] = []

  for (let index = 0; index < count; index += 1) {
    hash = (hash * 1103515245 + 12345 + index) | 0
    const normalised = (Math.abs(hash) % 1000) / 1000
    peaks.push(0.12 + normalised * 0.88)
  }

  return peaks
}

export interface AudioPlayerProviderProps<TData = unknown> {
  children: ReactNode
  /** Initial track loaded into the hidden audio element. */
  item?: AudioPlayerItem<TData>
  /** Waveform bar heights (0–1). Decoded from the audio file when omitted. */
  peaks?: number[]
  /** Called when playback position changes via user interaction. */
  onSeek?: ({ time }: { time: number }) => void
}

/**
 * Provides shared audio state to all AudioPlayer sub-components. Must wrap any
 * player UI and renders a hidden HTML5 audio element.
 */
export function AudioPlayerProvider<TData = unknown>({
  children,
  item,
  peaks: initialPeaks,
  onSeek,
}: AudioPlayerProviderProps<TData>) {
  const ref = useRef<HTMLAudioElement>(null)
  const [activeItem, setActiveItem] = useState<AudioPlayerItem<TData> | null>(
    item ?? null
  )
  const [duration, setDuration] = useState<number | null>(null)
  const [error, setError] = useState<MediaError | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isBuffering, setIsBuffering] = useState(false)
  const [playbackRate, setPlaybackRateState] = useState(1)
  const [peaks, setPeaks] = useState<number[]>(initialPeaks ?? [])
  const [peaksLoading, setPeaksLoading] = useState(false)

  useEffect(() => {
    if (item) {
      setActiveItem(item)
    }
  }, [item])

  useEffect(() => {
    if (initialPeaks) {
      setPeaks(initialPeaks)
      setPeaksLoading(false)
    }
  }, [initialPeaks])

  useEffect(() => {
    if (initialPeaks || !activeItem?.src) {
      return
    }

    let cancelled = false
    const { src } = activeItem

    setPeaksLoading(true)

    extractAudioPeaksFromSrc({ src, barCount: DEFAULT_PEAK_COUNT })
      .then((decodedPeaks) => {
        if (!cancelled) {
          setPeaks(decodedPeaks)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPeaks(generateAudioPeaks({ seed: src, count: DEFAULT_PEAK_COUNT }))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setPeaksLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [activeItem?.src, initialPeaks])

  useEffect(() => {
    const audio = ref.current
    if (!audio || !activeItem) {
      return
    }

    if (audio && activeItem && !audioSourcesMatch({ audio, src: activeItem.src })) {
      audio.src = activeItem.src
      audio.load()
    }
  }, [activeItem])

  useEffect(() => {
    const audio = ref.current
    if (!audio) {
      return
    }

    const handleLoadedMetadata = () => {
      setDuration(Number.isFinite(audio.duration) ? audio.duration : null)
      setError(null)
    }

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleWaiting = () => setIsBuffering(true)
    const handlePlaying = () => setIsBuffering(false)
    const handleError = () => setError(audio.error)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("play", handlePlay)
    audio.addEventListener("pause", handlePause)
    audio.addEventListener("waiting", handleWaiting)
    audio.addEventListener("playing", handlePlaying)
    audio.addEventListener("error", handleError)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("play", handlePlay)
      audio.removeEventListener("pause", handlePause)
      audio.removeEventListener("waiting", handleWaiting)
      audio.removeEventListener("playing", handlePlaying)
      audio.removeEventListener("error", handleError)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [])

  const isItemActive = useCallback(
    (id: string | number) => activeItem?.id === id,
    [activeItem]
  )

  const play = useCallback(
    (nextItem?: AudioPlayerItem<TData>) => {
      const audio = ref.current
      if (!audio) {
        return
      }

      if (nextItem) {
        setActiveItem(nextItem)
        if (!audioSourcesMatch({ audio, src: nextItem.src })) {
          audio.src = nextItem.src
          audio.load()
        }
      }

      void audio.play().catch(() => {
        // Ignore play interruption when the source is still loading or the user paused quickly.
      })
    },
    []
  )

  const pause = useCallback(() => {
    ref.current?.pause()
  }, [])

  const seek = useCallback(
    (time: number) => {
      const audio = ref.current
      if (!audio || !Number.isFinite(time)) {
        return
      }

      const clamped = duration ? Math.max(0, Math.min(time, duration)) : Math.max(0, time)
      audio.currentTime = clamped
      onSeek?.({ time: clamped })
    },
    [duration, onSeek]
  )

  const setPlaybackRate = useCallback((rate: number) => {
    const audio = ref.current
    if (!audio) {
      return
    }

    audio.playbackRate = rate
    setPlaybackRateState(rate)
  }, [])

  const value = useMemo<AudioPlayerContextValue<TData>>(
    () => ({
      ref,
      activeItem,
      duration,
      error,
      isPlaying,
      isBuffering,
      playbackRate,
      peaks,
      peaksLoading,
      isItemActive,
      setActiveItem,
      play,
      pause,
      seek,
      setPlaybackRate,
      setPeaks,
    }),
    [
      activeItem,
      duration,
      error,
      isPlaying,
      isBuffering,
      playbackRate,
      peaks,
      peaksLoading,
      isItemActive,
      play,
      pause,
      seek,
      setPlaybackRate,
    ]
  )

  return (
    <AudioPlayerContext.Provider value={value as AudioPlayerContextValue}>
      <audio ref={ref} preload="metadata" className="sr-only" />
      {children}
    </AudioPlayerContext.Provider>
  )
}

/**
 * Access the shared audio player context. Must be used inside AudioPlayerProvider.
 */
export function useAudioPlayer<TData = unknown>() {
  const context = useContext(AudioPlayerContext)

  if (!context) {
    throw new Error("useAudioPlayer must be used within AudioPlayerProvider")
  }

  return context as AudioPlayerContextValue<TData>
}

/**
 * Returns the current playback time in seconds, updated every animation frame.
 */
export function useAudioPlayerTime() {
  const { ref } = useAudioPlayer()
  const [time, setTime] = useState(0)

  useEffect(() => {
    let frame = 0
    const audio = ref.current

    const tick = () => {
      if (audio) {
        setTime(audio.currentTime)
      }
      frame = requestAnimationFrame(tick)
    }

    frame = requestAnimationFrame(tick)

    return () => cancelAnimationFrame(frame)
  }, [ref])

  return time
}

// ─────────────────────────────────────────────────────────────────────────────
// Atomic controls
// ─────────────────────────────────────────────────────────────────────────────

export interface AudioPlayerButtonProps extends HTMLAttributes<HTMLButtonElement> {
  item?: AudioPlayerItem
  disabled?: boolean
}

/**
 * Circular play/pause control. Pass `item` to load and play a specific track.
 */
export function AudioPlayerButton({
  item,
  disabled,
  className,
  ...props
}: AudioPlayerButtonProps) {
  const { play, pause, isPlaying, isBuffering, isItemActive } = useAudioPlayer()
  const active = item ? isItemActive(item.id) : true
  const playing = active && isPlaying

  return (
    <button
      type="button"
      data-slot="audio-player-button"
      disabled={disabled || isBuffering}
      aria-label={playing ? "Pause" : "Play"}
      onClick={() => {
        if (playing) {
          pause()
          return
        }

        play(item)
      }}
      className={cn(
        "inline-flex size-10 shrink-0 items-center justify-center rounded-full bg-lime text-forest transition-colors duration-150",
        "hover:bg-[#B5E050] disabled:pointer-events-none disabled:opacity-50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/50",
        className
      )}
      {...props}
    >
      {isBuffering && active ? (
        <Loader2 className="size-4 animate-spin" aria-hidden />
      ) : playing ? (
        <Pause className="size-4 fill-current" aria-hidden />
      ) : (
        <Play className="size-4 fill-current" aria-hidden />
      )}
    </button>
  )
}

export interface AudioPlayerSkipProps extends HTMLAttributes<HTMLButtonElement> {
  /** Seconds to skip forward or backward. */
  seconds?: number
  direction?: "back" | "forward"
}

/**
 * Skip control showing «15 / 15» style labels for transcript scrubbing.
 */
export function AudioPlayerSkip({
  seconds = 15,
  direction = "back",
  className,
  ...props
}: AudioPlayerSkipProps) {
  const { seek } = useAudioPlayer()
  const time = useAudioPlayerTime()

  return (
    <button
      type="button"
      data-slot="audio-player-skip"
      data-direction={direction}
      aria-label={direction === "back" ? `Skip back ${seconds} seconds` : `Skip forward ${seconds} seconds`}
      onClick={() => {
        const delta = direction === "back" ? -seconds : seconds
        seek(time + delta)
      }}
      className={cn(
        "inline-flex h-8 min-w-8 shrink-0 items-center justify-center rounded-xs px-1.5 text-xs font-semibold tabular-nums text-white/70 transition-colors duration-150",
        "hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40",
        className
      )}
      {...props}
    >
      {direction === "back" ? `«${seconds}` : `${seconds}»`}
    </button>
  )
}

export interface AudioPlayerTimeProps extends HTMLAttributes<HTMLSpanElement> {
  /** Highlight the current time in lime (dark player chrome). */
  accent?: boolean
}

/** Displays the current playback position. */
export function AudioPlayerTime({ accent = false, className, ...props }: AudioPlayerTimeProps) {
  const time = useAudioPlayerTime()

  return (
    <span
      data-slot="audio-player-time"
      className={cn(
        "shrink-0 text-xs tabular-nums",
        accent ? "font-medium text-lime" : "text-ink-muted",
        className
      )}
      {...props}
    >
      {formatAudioTime({ seconds: time })}
    </span>
  )
}

/** Displays total track duration or a placeholder when unknown. */
export function AudioPlayerDuration({ className, ...props }: HTMLAttributes<HTMLSpanElement>) {
  const { duration } = useAudioPlayer()

  return (
    <span
      data-slot="audio-player-duration"
      className={cn("shrink-0 text-xs tabular-nums text-white/45", className)}
      {...props}
    >
      {duration ? formatAudioTime({ seconds: duration }) : "--:--"}
    </span>
  )
}

export interface AudioPlayerWaveformProps extends HTMLAttributes<HTMLDivElement> {
  /** Called when the user seeks by clicking or dragging the waveform. */
  onSeek?: ({ time }: { time: number }) => void
}

/**
 * Canvas waveform scrubber. Peaks are decoded from the audio file by the
 * provider; played/unplayed bars and the playhead share one progress ratio
 * so the highlight stays aligned with playback.
 */
export function AudioPlayerWaveform({
  className,
  onSeek,
  ...props
}: AudioPlayerWaveformProps) {
  const { duration, peaks, peaksLoading, seek } = useAudioPlayer()
  const time = useAudioPlayerTime()
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isScrubbing, setIsScrubbing] = useState(false)

  const progress = duration && duration > 0 ? time / duration : 0

  const seekFromClientX = useCallback(
    (clientX: number) => {
      const track = containerRef.current
      if (!track || !duration) {
        return
      }

      const rect = track.getBoundingClientRect()
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      const nextTime = ratio * duration
      seek(nextTime)
      onSeek?.({ time: nextTime })
    },
    [duration, onSeek, seek]
  )

  const handlePointerDown = (event: PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId)
    setIsScrubbing(true)
    seekFromClientX(event.clientX)
  }

  const handlePointerMove = (event: PointerEvent<HTMLDivElement>) => {
    if (!isScrubbing) {
      return
    }

    seekFromClientX(event.clientX)
  }

  const handlePointerUp = (event: PointerEvent<HTMLDivElement>) => {
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    setIsScrubbing(false)
  }

  useEffect(() => {
    const container = containerRef.current
    const canvas = canvasRef.current

    if (!container || !canvas) {
      return
    }

    const render = () => {
      const rect = container.getBoundingClientRect()
      const width = Math.max(1, Math.floor(rect.width))
      const height = Math.max(1, Math.floor(rect.height))
      const dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      const context = canvas.getContext("2d")

      if (!context) {
        return
      }

      context.setTransform(dpr, 0, 0, dpr, 0, 0)

      const displayPeaks =
        peaks.length > 0
          ? peaks
          : peaksLoading
            ? generateAudioPeaks({ seed: "loading", count: DEFAULT_PEAK_COUNT }).map(
                (peak) => peak * 0.35
              )
            : []

      drawAudioWaveform({
        context,
        width,
        height,
        peaks: displayPeaks,
        progress,
      })
    }

    render()

    const observer = new ResizeObserver(render)
    observer.observe(container)

    return () => observer.disconnect()
  }, [peaks, peaksLoading, progress, time])

  return (
    <div
      ref={containerRef}
      data-slot="audio-player-waveform"
      role="slider"
      aria-valuemin={0}
      aria-valuemax={duration ?? 0}
      aria-valuenow={time}
      aria-label="Seek audio"
      aria-busy={peaksLoading}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      className={cn("relative min-w-0 flex-1 cursor-pointer", className)}
      {...props}
    >
      <canvas ref={canvasRef} className="block h-10 w-full" />
    </div>
  )
}

export interface AudioPlayerLabelProps extends HTMLAttributes<HTMLDivElement> {
  label: string
  showRecordingDot?: boolean
}

/** Recording title with optional live/recording indicator dot. */
export function AudioPlayerLabel({
  label,
  showRecordingDot = true,
  className,
  ...props
}: AudioPlayerLabelProps) {
  return (
    <div
      data-slot="audio-player-label"
      className={cn("flex min-w-0 items-center gap-2 text-xs text-white/85", className)}
      {...props}
    >
      {showRecordingDot ? (
        <span className="size-1.5 shrink-0 rounded-full bg-danger" aria-hidden />
      ) : null}
      <span className="truncate">{label}</span>
    </div>
  )
}

export interface AudioPlayerDownloadProps extends HTMLAttributes<HTMLAnchorElement> {
  href: string
  filename?: string
}

/** Download action for the active recording file. */
export function AudioPlayerDownload({
  href,
  filename,
  className,
  ...props
}: AudioPlayerDownloadProps) {
  return (
    <a
      data-slot="audio-player-download"
      href={href}
      download={filename}
      aria-label="Download recording"
      className={cn(
        "inline-flex size-8 shrink-0 items-center justify-center rounded-xs border border-white/15 text-white/70 transition-colors duration-150",
        "hover:border-white/30 hover:bg-white/10 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime/40",
        className
      )}
      {...props}
    >
      <Download className="size-3.5" aria-hidden />
    </a>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// Pre-composed recording bar
// ─────────────────────────────────────────────────────────────────────────────

export interface AudioPlayerBarProps extends HTMLAttributes<HTMLDivElement> {
  /** inline = in document flow; docked = fixed to viewport bottom. */
  position?: AudioPlayerPosition
  /** Recording label shown on the right (e.g. "AGM recording"). */
  label?: string
  showRecordingDot?: boolean
  skipSeconds?: number
  downloadHref?: string
  downloadFilename?: string
}

/**
 * Pre-composed forest-green recording strip matching the meeting transcript
 * player. Compose inside AudioPlayerProvider with an `item` prop set.
 */
export function AudioPlayerBar({
  position = "inline",
  label,
  showRecordingDot = true,
  skipSeconds = 15,
  downloadHref,
  downloadFilename,
  className,
  ...props
}: AudioPlayerBarProps) {
  return (
    <div
      data-slot="audio-player-bar"
      data-position={position}
      className={cn(
        "flex items-center gap-3 border border-forest/80 bg-[#022A1E] px-4 py-2.5 text-white shadow-[0_-4px_24px_rgba(0,0,0,0.18)]",
        position === "inline" && "rounded-sm",
        position === "docked" &&
          "fixed inset-x-0 bottom-0 z-50 rounded-none border-x-0 border-b-0",
        className
      )}
      {...props}
    >
      {/* Playback controls */}
      <div className="flex shrink-0 items-center gap-1.5">
        <AudioPlayerSkip seconds={skipSeconds} direction="back" />
        <AudioPlayerButton />
        <AudioPlayerSkip seconds={skipSeconds} direction="forward" />
      </div>

      {/* Current time */}
      <AudioPlayerTime accent className="hidden sm:inline" />

      {/* Waveform */}
      <AudioPlayerWaveform className="mx-1" />

      {/* Duration */}
      <AudioPlayerDuration className="hidden md:inline" />

      {/* Label + download */}
      {(label || downloadHref) && (
        <div className="hidden shrink-0 items-center gap-3 border-l border-white/10 pl-3 lg:flex">
          {label ? (
            <AudioPlayerLabel label={label} showRecordingDot={showRecordingDot} />
          ) : null}
          {downloadHref ? (
            <AudioPlayerDownload href={downloadHref} filename={downloadFilename} />
          ) : null}
        </div>
      )}
    </div>
  )
}

/**
 * Hook for transcript rows and external controls to jump the shared player to a
 * timestamp. Returns `seekToTime` bound to the provider context.
 */
export function useAudioPlayerSeek() {
  const { seek, play, activeItem } = useAudioPlayer()

  const seekToTime = useCallback(
    ({ time, autoPlay = true }: { time: number; autoPlay?: boolean }) => {
      seek(time)
      if (autoPlay && activeItem) {
        play()
      }
    },
    [activeItem, play, seek]
  )

  return { seekToTime }
}
