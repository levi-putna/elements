"use client"

import { useMemo } from "react"

import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { DocsPage } from "@/components/docs/docs-page"
import { PropTable } from "@/components/docs/prop-table"
import {
  AudioPlayerBar,
  AudioPlayerProvider,
  formatAudioTime,
  useAudioPlayerSeek,
  useAudioPlayerTime,
} from "@/components/ui/audio-player"
import { cn, assetPath } from "@/lib/utils"

const DEMO_SRC = assetPath("/audio/audio_test.mp3")

const INSTALL_CODE = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/audio-player/registry.json`

const USAGE_CODE = `import {
  AudioPlayerBar,
  AudioPlayerProvider,
} from "@/components/ui/audio-player"

const recording = {
  id: "agm-2026",
  src: "/recordings/harbour-view-agm-2026.mp3",
}

<AudioPlayerProvider item={recording}>
  <AudioPlayerBar
    label="AGM recording"
    downloadHref={recording.src}
    downloadFilename="harbour-view-agm-2026.mp3"
  />
</AudioPlayerProvider>`

const DOCKED_CODE = `<AudioPlayerProvider item={recording}>
  <main className="pb-24">{transcriptContent}</main>
  <AudioPlayerBar
    position="docked"
    label="AGM recording"
    downloadHref={recording.src}
  />
</AudioPlayerProvider>`

const SEEK_CODE = `import { formatAudioTime, useAudioPlayerSeek } from "@/components/ui/audio-player"

function TranscriptTimestamp({ time, children }: { time: number; children: React.ReactNode }) {
  const { seekToTime } = useAudioPlayerSeek()

  return (
    <button type="button" onClick={() => seekToTime({ time })} className="text-left">
      <span className="tabular-nums text-ink-muted">
        {formatAudioTime({ seconds: time })}
      </span>
      {children}
    </button>
  )
}`

const TRANSCRIPT_ROWS = [
  {
    time: 8,
    speaker: "David Okonkwo",
    role: "Chair",
    text: "Good evening everyone. I call this Annual General Meeting of Harbour View Towers to order.",
  },
  {
    time: 95,
    speaker: "Sarah Mitchell",
    role: "Strata manager",
    text: "We have a quorum of twenty-four of forty-two lots represented, either in person or by proxy.",
  },
  {
    time: 210,
    speaker: "David Okonkwo",
    role: "Chair",
    text: "Motion one: that the owners corporation renew building insurance with NRMA for $84,200, a four point five percent increase on last year.",
  },
  {
    time: 318,
    speaker: "James Okonkwo",
    role: "Lot 1",
    text: "Can the manager confirm whether the premium includes flood cover for the basement car park?",
  },
]

const PROVIDER_PROPS = [
  {
    name: "item",
    type: "AudioPlayerItem",
    description: "Initial track with id, src, and optional data payload.",
  },
  {
    name: "peaks",
    type: "number[]",
    description:
      "Optional pre-computed waveform bar heights (0–1). Decoded from the audio file via Web Audio when omitted.",
  },
  {
    name: "onSeek",
    type: "({ time: number }) => void",
    description: "Called when the user seeks via waveform or skip controls.",
  },
]

const BAR_PROPS = [
  {
    name: "position",
    type: '"inline" | "docked"',
    default: '"inline"',
    description: "Inline in page flow, or fixed to the viewport bottom for transcript review.",
  },
  {
    name: "label",
    type: "string",
    description: 'Recording name shown on the right (e.g. "AGM recording").',
  },
  {
    name: "showRecordingDot",
    type: "boolean",
    default: "true",
    description: "Red indicator dot before the label.",
  },
  {
    name: "skipSeconds",
    type: "number",
    default: "15",
    description: "Seconds to skip backward or forward.",
  },
  {
    name: "downloadHref",
    type: "string",
    description: "URL for the download action.",
  },
  {
    name: "downloadFilename",
    type: "string",
    description: "Suggested filename for the download attribute.",
  },
]

/**
 * Renders a clickable transcript timestamp wired to the shared audio player.
 */
function TranscriptTimestamp({
  time,
  children,
}: {
  time: number
  children: React.ReactNode
}) {
  const { seekToTime } = useAudioPlayerSeek()
  const activeTime = useAudioPlayerTime()
  const isNearActive = Math.abs(activeTime - time) < 2

  return (
    <button
      type="button"
      onClick={() => seekToTime({ time })}
      className={cn(
        "group flex w-full gap-4 rounded-xs px-2 py-3 text-left transition-colors duration-150",
        "hover:bg-off-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-forest/30",
        isNearActive && "bg-lime-soft/60"
      )}
    >
      <span
        className={cn(
          "w-12 shrink-0 pt-0.5 text-xs tabular-nums",
          isNearActive ? "font-semibold text-forest" : "text-ink-muted group-hover:text-forest"
        )}
      >
        {formatAudioTime({ seconds: time })}
      </span>
      <span className="min-w-0 flex-1 text-sm leading-relaxed text-foreground">{children}</span>
    </button>
  )
}

/**
 * Inline recording bar demo wrapped in its own provider.
 */
function InlinePlayerDemo() {
  const recording = useMemo(
    () => ({
      id: "inline-demo",
      src: DEMO_SRC,
    }),
    []
  )

  return (
    <AudioPlayerProvider item={recording}>
      <AudioPlayerBar
        position="inline"
        label="Sample recording"
        downloadHref={recording.src}
        downloadFilename="audio_test.mp3"
      />
    </AudioPlayerProvider>
  )
}

/**
 * Transcript review layout with a docked player and jump-to-timestamp rows.
 */
function TranscriptReviewDemo() {
  const recording = useMemo(
    () => ({
      id: "agm-2026-demo",
      src: DEMO_SRC,
      data: { scheme: "Harbour View Towers" },
    }),
    []
  )

  return (
    <AudioPlayerProvider item={recording}>
      <div className="relative overflow-hidden rounded-sm border border-border bg-white">
        {/* Transcript header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Verbatim transcript
          </p>
          <p className="text-xs text-ink-muted">
            Tap a timestamp to play from that moment
          </p>
        </div>

        {/* Transcript body — padded for docked bar */}
        <div className="max-h-72 overflow-y-auto pb-20">
          {TRANSCRIPT_ROWS.map((row) => (
            <div key={row.time} className="border-b border-border/60 last:border-b-0">
              <TranscriptTimestamp time={row.time}>
                <span className="font-semibold">{row.speaker}</span>
                <span className="text-ink-muted"> · {row.role}</span>
                <span className="mt-1 block font-normal text-foreground">{row.text}</span>
              </TranscriptTimestamp>
            </div>
          ))}
        </div>

        {/* Docked player (contained in preview frame) */}
        <div className="relative h-14">
          <AudioPlayerBar
            position="docked"
            label="AGM recording"
            downloadHref={recording.src}
            downloadFilename="audio_test.mp3"
            className="absolute inset-x-0 bottom-0"
          />
        </div>
      </div>
    </AudioPlayerProvider>
  )
}

/**
 * Audio player element documentation page.
 */
export default function AudioPlayerPage() {
  return (
    <DocsPage width="wide">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Audio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Audio Player
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          A composable recording player for AGM audio, committee meetings, and voice notes.
          The pre-built bar matches the forest-green transcript strip: skip controls, lime
          play button, a real amplitude waveform decoded from the recording, duration,
          recording label, and download. Use{" "}
          <code className="font-mono text-xs text-ink">position=&quot;inline&quot;</code> in
          detail panels or{" "}
          <code className="font-mono text-xs text-ink">position=&quot;docked&quot;</code> fixed
          to the viewport bottom during transcript review.
        </p>
      </div>

      {/* Inline bar */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Inline bar
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Sits in normal document flow inside a detail panel, document preview, or task view.
          Rounded corners and a subtle shadow separate it from surrounding content.
        </p>

        <ComponentPreview label="Document attachment preview">
          <div className="w-full max-w-3xl">
            <InlinePlayerDemo />
          </div>
        </ComponentPreview>
      </section>

      {/* Docked transcript */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Docked bar with transcript sync
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Fixed to the bottom while managers read a verbatim transcript. The waveform is
          decoded from the audio file and the lime playhead tracks playback via{" "}
          <code className="font-mono text-xs text-ink">requestAnimationFrame</code>.
          Transcript timestamps call{" "}
          <code className="font-mono text-xs text-ink">useAudioPlayerSeek()</code> to jump
          the playhead. Pad scrollable content with{" "}
          <code className="font-mono text-xs text-ink">pb-20</code> or more so the last rows
          are not hidden behind the bar.
        </p>

        <ComponentPreview label="Meeting transcript review">
          <div className="w-full max-w-2xl">
            <TranscriptReviewDemo />
          </div>
        </ComponentPreview>

        <div className="mt-6 space-y-6">
          <CodeBlock code={DOCKED_CODE} language="tsx" />
          <CodeBlock code={SEEK_CODE} language="tsx" />
        </div>
      </section>

      {/* Waveform */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Real waveform
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          When <code className="font-mono text-xs text-ink">peaks</code> are not supplied,{" "}
          <code className="font-mono text-xs text-ink">AudioPlayerProvider</code> fetches and
          decodes the audio file with the Web Audio API, then renders amplitudes on a canvas
          scrubber. Played bars turn lime and the white playhead shares the same{" "}
          <code className="font-mono text-xs text-ink">currentTime / duration</code> ratio so
          the highlight stays aligned during playback and scrubbing.
        </p>

        <CodeBlock
          code={`import { extractAudioPeaksFromSrc } from "@/components/ui/audio-player"

// Optional: pre-compute peaks server-side or at upload time
const peaks = await extractAudioPeaksFromSrc({ src: recording.src })

<AudioPlayerProvider item={recording} peaks={peaks}>
  <AudioPlayerBar label="AGM recording" />
</AudioPlayerProvider>`}
          language="tsx"
        />
      </section>

      {/* Install */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <CodeBlock code={INSTALL_CODE} language="bash" />
      </section>

      {/* Usage */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Usage
        </h2>
        <CodeBlock code={USAGE_CODE} language="tsx" />
      </section>

      {/* Reference */}
      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-6">
          Reference
        </h2>

        <h3 className="text-sm font-semibold text-ink mb-3">AudioPlayerProvider</h3>
        <div className="mb-8">
          <PropTable props={PROVIDER_PROPS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">AudioPlayerBar</h3>
        <PropTable props={BAR_PROPS} />
      </section>
    </DocsPage>
  )
}
