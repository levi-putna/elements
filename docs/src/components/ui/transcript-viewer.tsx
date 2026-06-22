"use client"

import { formatAudioTime, useAudioPlayerSeek, useAudioPlayerTime } from "@/components/ui/audio-player"
import { cn } from "@/lib/utils"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type HTMLAttributes,
  type ReactNode,
} from "react"

// ─────────────────────────────────────────────────────────────────────────────
// TranscriptViewer: word-by-word transcript display synced to AudioPlayerProvider.
// Compose inside AudioPlayerProvider alongside AudioPlayerBar.
//
//   <AudioPlayerProvider item={recording}>
//     <TranscriptViewerContainer words={wordTimings}>
//       <TranscriptViewerWords />
//     </TranscriptViewerContainer>
//     <AudioPlayerBar position="docked" label="AGM recording" />
//   </AudioPlayerProvider>
// ─────────────────────────────────────────────────────────────────────────────

export type TranscriptViewerVariant = "words" | "timeline"

/** Defines a segment boundary after a given word index (inclusive in the prior segment). */
export interface TranscriptTimelineBreakpoint {
  id: string
  /** Optional segment title shown in timeline mode. */
  label?: string
  /** Speaker name for the segment ending at this break. */
  speaker?: string
  /** Optional role or lot label (e.g. Chair, Strata manager, Lot 1). */
  role?: string
  /** Index of the last word in the segment; the break follows this word. */
  afterWordIndex: number
}

/** Optional metadata for the segment after the final break. */
export interface TranscriptFinalSegmentMeta {
  id?: string
  label?: string
  speaker?: string
  role?: string
}

/** A contiguous passage grouped by timeline breakpoints. */
export interface TranscriptSegment {
  id: string
  label?: string
  speaker?: string
  role?: string
  words: TranscriptWord[]
  start: number
  end: number
  startWordIndex: number
  endWordIndex: number
}

export type TranscriptSegmentStatus = "spoken" | "current" | "unspoken"

export type TranscriptWordStatus = "spoken" | "current" | "unspoken"

/** A single word with start/end timing from a transcription or forced-alignment service. */
export interface TranscriptWordTiming {
  word: string
  start: number
  end: number
}

export type TranscriptTimeUnit = "ms" | "s"

/** Normalised word entry used internally (times always in seconds). */
export interface TranscriptWord {
  word: string
  start: number
  end: number
  index: number
}

interface TranscriptViewerContextValue {
  words: TranscriptWord[]
  segments: TranscriptSegment[]
  variant: TranscriptViewerVariant
  currentTime: number
  currentWord: TranscriptWord | null
  currentWordIndex: number | null
  currentSegment: TranscriptSegment | null
  currentSegmentIndex: number | null
  getWordStatus: ({ word }: { word: TranscriptWord }) => TranscriptWordStatus
  getSegmentStatus: ({ segment }: { segment: TranscriptSegment }) => TranscriptSegmentStatus
  seekToWord: ({ word }: { word: TranscriptWord }) => void
  seekToSegment: ({ segment }: { segment: TranscriptSegment }) => void
}

const TranscriptViewerContext = createContext<TranscriptViewerContextValue | null>(null)

/**
 * Converts a raw timing value to seconds based on the declared unit.
 */
function toSeconds({ value, timeUnit }: { value: number; timeUnit: TranscriptTimeUnit }): number {
  return timeUnit === "ms" ? value / 1000 : value
}

/**
 * Normalises word timing input into seconds and attaches stable indices.
 */
export function normaliseTranscriptWords({
  words,
  timeUnit = "ms",
}: {
  words: TranscriptWordTiming[]
  timeUnit?: TranscriptTimeUnit
}): TranscriptWord[] {
  return words.map((entry, index) => ({
    word: entry.word,
    start: toSeconds({ value: entry.start, timeUnit }),
    end: toSeconds({ value: entry.end, timeUnit }),
    index,
  }))
}

/**
 * Resolves the spoken/current/unspoken state for a word at the given playback time.
 */
export function getTranscriptWordStatus({
  word,
  currentTime,
}: {
  word: TranscriptWord
  currentTime: number
}): TranscriptWordStatus {
  if (currentTime >= word.end) {
    return "spoken"
  }

  if (currentTime >= word.start) {
    return "current"
  }

  return "unspoken"
}

/**
 * Finds the word active at the current playback position.
 */
export function findCurrentTranscriptWord({
  words,
  currentTime,
}: {
  words: TranscriptWord[]
  currentTime: number
}): TranscriptWord | null {
  return (
    words.find((word) => currentTime >= word.start && currentTime < word.end) ??
    null
  )
}

/**
 * Groups normalised words into timeline segments using ordered breakpoints.
 */
export function buildTranscriptSegments({
  words,
  breaks = [],
  finalSegment,
}: {
  words: TranscriptWord[]
  breaks?: TranscriptTimelineBreakpoint[]
  finalSegment?: TranscriptFinalSegmentMeta
}): TranscriptSegment[] {
  if (words.length === 0) {
    return []
  }

  const sortedBreaks = [...breaks].sort((a, b) => a.afterWordIndex - b.afterWordIndex)
  const segments: TranscriptSegment[] = []

  let startIndex = 0

  sortedBreaks.forEach((breakpoint) => {
    const endIndex = breakpoint.afterWordIndex

    if (endIndex < startIndex || endIndex >= words.length) {
      return
    }

    const segmentWords = words.slice(startIndex, endIndex + 1)

    segments.push({
      id: breakpoint.id,
      label: breakpoint.label,
      speaker: breakpoint.speaker,
      role: breakpoint.role,
      words: segmentWords,
      start: segmentWords[0].start,
      end: segmentWords[segmentWords.length - 1].end,
      startWordIndex: startIndex,
      endWordIndex: endIndex,
    })

    startIndex = endIndex + 1
  })

  if (startIndex < words.length) {
    const segmentWords = words.slice(startIndex)

    segments.push({
      id: finalSegment?.id ?? `segment-${startIndex}`,
      label: finalSegment?.label,
      speaker: finalSegment?.speaker,
      role: finalSegment?.role,
      words: segmentWords,
      start: segmentWords[0].start,
      end: segmentWords[segmentWords.length - 1].end,
      startWordIndex: startIndex,
      endWordIndex: words.length - 1,
    })
  }

  if (segments.length === 0) {
    segments.push({
      id: "segment-0",
      label: undefined,
      words,
      start: words[0].start,
      end: words[words.length - 1].end,
      startWordIndex: 0,
      endWordIndex: words.length - 1,
    })
  }

  return segments
}

/**
 * Resolves segment playback state at the current time.
 */
export function getTranscriptSegmentStatus({
  segment,
  currentTime,
}: {
  segment: TranscriptSegment
  currentTime: number
}): TranscriptSegmentStatus {
  if (currentTime >= segment.end) {
    return "spoken"
  }

  if (currentTime >= segment.start) {
    return "current"
  }

  return "unspoken"
}

/**
 * Finds the segment active at the current playback position.
 */
export function findCurrentTranscriptSegment({
  segments,
  currentTime,
}: {
  segments: TranscriptSegment[]
  currentTime: number
}): TranscriptSegment | null {
  return (
    segments.find(
      (segment) => currentTime >= segment.start && currentTime <= segment.end
    ) ?? null
  )
}

/**
 * Joins segment words into readable passage text.
 */
export function formatTranscriptSegmentText({ words }: { words: TranscriptWord[] }): string {
  return words.map((word) => word.word).join(" ")
}

export interface TranscriptViewerContainerProps extends HTMLAttributes<HTMLDivElement> {
  /** Word-level timing from transcription or forced alignment. */
  words: TranscriptWordTiming[]
  /** Timeline segment breakpoints. Required when `variant="timeline"`. */
  breaks?: TranscriptTimelineBreakpoint[]
  /** Metadata for the segment after the final break, when words remain. */
  finalSegment?: TranscriptFinalSegmentMeta
  /** Inline word highlighting or grouped timeline segments. */
  variant?: TranscriptViewerVariant
  /** Unit for `start` and `end` on each word. Defaults to milliseconds. */
  timeUnit?: TranscriptTimeUnit
  children?: ReactNode
}

/**
 * Container that provides transcript word state synced to the parent
 * AudioPlayerProvider. Must be rendered inside AudioPlayerProvider.
 */
export function TranscriptViewerContainer({
  words,
  breaks = [],
  finalSegment,
  variant = "words",
  timeUnit = "ms",
  className,
  children,
  ...props
}: TranscriptViewerContainerProps) {
  const currentTime = useAudioPlayerTime()
  const { seekToTime } = useAudioPlayerSeek()

  const normalisedWords = useMemo(
    () => normaliseTranscriptWords({ words, timeUnit }),
    [words, timeUnit]
  )

  const segments = useMemo(
    () => buildTranscriptSegments({ words: normalisedWords, breaks, finalSegment }),
    [normalisedWords, breaks, finalSegment]
  )

  const currentWord = useMemo(
    () => findCurrentTranscriptWord({ words: normalisedWords, currentTime }),
    [normalisedWords, currentTime]
  )

  const currentSegment = useMemo(
    () => findCurrentTranscriptSegment({ segments, currentTime }),
    [segments, currentTime]
  )

  const currentWordIndex = currentWord?.index ?? null
  const currentSegmentIndex =
    currentSegment === null
      ? null
      : segments.findIndex((segment) => segment.id === currentSegment.id)

  const getWordStatus = useCallback(
    ({ word }: { word: TranscriptWord }) =>
      getTranscriptWordStatus({ word, currentTime }),
    [currentTime]
  )

  const getSegmentStatus = useCallback(
    ({ segment }: { segment: TranscriptSegment }) =>
      getTranscriptSegmentStatus({ segment, currentTime }),
    [currentTime]
  )

  const seekToWord = useCallback(
    ({ word }: { word: TranscriptWord }) => {
      seekToTime({ time: word.start, autoPlay: true })
    },
    [seekToTime]
  )

  const seekToSegment = useCallback(
    ({ segment }: { segment: TranscriptSegment }) => {
      seekToTime({ time: segment.start, autoPlay: true })
    },
    [seekToTime]
  )

  const value = useMemo<TranscriptViewerContextValue>(
    () => ({
      words: normalisedWords,
      segments,
      variant,
      currentTime,
      currentWord,
      currentWordIndex,
      currentSegment,
      currentSegmentIndex,
      getWordStatus,
      getSegmentStatus,
      seekToWord,
      seekToSegment,
    }),
    [
      normalisedWords,
      segments,
      variant,
      currentTime,
      currentWord,
      currentWordIndex,
      currentSegment,
      currentSegmentIndex,
      getWordStatus,
      getSegmentStatus,
      seekToWord,
      seekToSegment,
    ]
  )

  return (
    <TranscriptViewerContext.Provider value={value}>
      <div
        data-slot="transcript-viewer-container"
        data-variant={variant}
        className={cn("min-w-0", className)}
        {...props}
      >
        {children}
      </div>
    </TranscriptViewerContext.Provider>
  )
}

/**
 * Access transcript viewer state. Must be used inside TranscriptViewerContainer.
 */
export function useTranscriptViewer() {
  const context = useContext(TranscriptViewerContext)

  if (!context) {
    throw new Error("useTranscriptViewer must be used within TranscriptViewerContainer")
  }

  return context
}

export interface TranscriptViewerWordsProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional custom renderer per word. */
  renderWord?: (props: {
    word: TranscriptWord
    status: TranscriptWordStatus
  }) => ReactNode
}

/**
 * Renders the transcript as inline, clickable words. Highlights the current
 * word in lime and fades spoken words. Clicking a word seeks the shared player.
 */
export function TranscriptViewerWords({
  className,
  renderWord,
  ...props
}: TranscriptViewerWordsProps) {
  const { words, getWordStatus, seekToWord } = useTranscriptViewer()

  return (
    <div
      data-slot="transcript-viewer-words"
      className={cn(
        "text-sm leading-relaxed text-foreground",
        className
      )}
      {...props}
    >
      {words.map((word) => {
        const status = getWordStatus({ word })
        const isCurrent = status === "current"

        if (renderWord) {
          return (
            <span key={word.index} className="inline">
              {renderWord({ word, status })}
            </span>
          )
        }

        return (
          <button
            key={word.index}
            type="button"
            onClick={() => seekToWord({ word })}
            className={cn(
              "mr-1 inline rounded-xs px-0.5 transition-colors duration-100",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30",
              status === "spoken" && "text-ink-muted",
              status === "current" && "bg-lime-soft font-medium text-forest",
              status === "unspoken" && "text-foreground hover:bg-off-white"
            )}
          >
            {word.word}
          </button>
        )
      })}
    </div>
  )
}

export interface TranscriptViewerTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Optional custom renderer per timeline segment. */
  renderSegment?: (props: {
    segment: TranscriptSegment
    status: TranscriptSegmentStatus
  }) => ReactNode
}

/**
 * Timeline layout: grouped passage segments with timestamps and jump-to-seek.
 * Pair with `breaks` on TranscriptViewerContainer.
 */
export function TranscriptViewerTimeline({
  className,
  renderSegment,
  ...props
}: TranscriptViewerTimelineProps) {
  const {
    segments,
    getSegmentStatus,
    seekToSegment,
  } = useTranscriptViewer()

  return (
    <div
      data-slot="transcript-viewer-timeline"
      className={cn("flex flex-col divide-y divide-border", className)}
      {...props}
    >
      {segments.map((segment) => {
        const status = getSegmentStatus({ segment })
        const isCurrent = status === "current"

        if (renderSegment) {
          return (
            <div key={segment.id}>{renderSegment({ segment, status })}</div>
          )
        }

        return (
          <button
            key={segment.id}
            type="button"
            onClick={() => seekToSegment({ segment })}
            className={cn(
              "flex w-full gap-3 py-3 text-left transition-colors duration-150",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30",
              isCurrent ? "bg-lime-soft/50" : "hover:bg-off-white",
              status === "spoken" && !isCurrent && "opacity-75"
            )}
          >
            {/* Timestamp */}
            <span
              className={cn(
                "w-10 shrink-0 pt-0.5 text-xs tabular-nums",
                isCurrent ? "font-medium text-forest" : "text-ink-muted"
              )}
            >
              {formatAudioTime({ seconds: segment.start })}
            </span>

            {/* Speaker + passage */}
            <span className="min-w-0 flex-1">
              {segment.label ? (
                <span className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
                  {segment.label}
                </span>
              ) : null}
              {segment.speaker ? (
                <span
                  className={cn(
                    "mb-1 block text-sm font-semibold",
                    isCurrent ? "text-forest" : "text-foreground"
                  )}
                >
                  {segment.speaker}
                  {segment.role ? (
                    <span className="font-normal text-ink-muted"> · {segment.role}</span>
                  ) : null}
                </span>
              ) : null}
              <span
                className={cn(
                  "block text-sm leading-relaxed",
                  isCurrent ? "text-forest" : "text-foreground"
                )}
              >
                {formatTranscriptSegmentText({ words: segment.words })}
              </span>
            </span>
          </button>
        )
      })}
    </div>
  )
}
