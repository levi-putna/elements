"use client"

import { useEffect, useMemo, useState } from "react"

import { CodeBlock } from "@/components/docs/code-block"
import { ComponentPreview } from "@/components/docs/component-preview"
import { DocsPage } from "@/components/docs/docs-page"
import { PropTable } from "@/components/docs/prop-table"
import {
  AudioPlayerBar,
  AudioPlayerProvider,
} from "@/components/ui/audio-player"
import {
  TranscriptViewerContainer,
  TranscriptViewerTimeline,
  TranscriptViewerWords,
  type TranscriptTimelineBreakpoint,
  type TranscriptWordTiming,
} from "@/components/ui/transcript-viewer"
import { assetPath, docPath } from "@/lib/utils"

const DEMO_SRC = assetPath("/audio/audio_test.mp3")
const DEMO_WORDS_SRC = assetPath("/audio/audio_test.words.json")

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

const DOCKED_CODE = `import { AudioPlayerBar, AudioPlayerProvider } from "@/components/ui/audio-player"
import {
  TranscriptViewerContainer,
  TranscriptViewerTimeline,
} from "@/components/ui/transcript-viewer"

const breaks = [
  {
    id: "opening",
    label: "Call to order",
    speaker: "David Okonkwo",
    role: "Chair",
    afterWordIndex: 7,
  },
]

<AudioPlayerProvider item={recording}>
  <main className="pb-24">
    <TranscriptViewerContainer words={wordTimings} breaks={breaks} variant="timeline">
      <TranscriptViewerTimeline />
    </TranscriptViewerContainer>
  </main>
  <AudioPlayerBar position="docked" label="AGM recording" downloadHref={recording.src} />
</AudioPlayerProvider>`

const TIMELINE_SEEK_CODE = `// Each break can include speaker, role, and label metadata
{
  "breaks": [
    {
      "id": "opening",
      "label": "Call to order",
      "speaker": "David Okonkwo",
      "role": "Chair",
      "afterWordIndex": 7
    }
  ]
}`

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
 * Meeting transcript review with timeline segments and speaker metadata.
 */
function TranscriptReviewDemo({
  words,
  breaks,
}: {
  words: TranscriptWordTiming[]
  breaks: TranscriptTimelineBreakpoint[]
}) {
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
            Click a segment to jump · speaker and role from break metadata
          </p>
        </div>

        {/* Timeline transcript */}
        <div className="max-h-72 overflow-y-auto px-4 py-4 pb-20">
          <TranscriptViewerContainer
            words={words}
            breaks={breaks}
            variant="timeline"
          >
            <TranscriptViewerTimeline />
          </TranscriptViewerContainer>
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
 * Word-by-word transcript paired with the docked audio bar.
 */
function WordByWordTranscriptDemo({ words }: { words: TranscriptWordTiming[] }) {
  const recording = useMemo(
    () => ({
      id: "word-sync-demo",
      src: DEMO_SRC,
    }),
    []
  )

  return (
    <AudioPlayerProvider item={recording}>
      <div className="relative overflow-hidden rounded-sm border border-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Word-by-word transcript
          </p>
          <p className="text-xs text-ink-muted">
            Powered by{" "}
            <a href={docPath("/components/transcript-viewer")} className="text-forest underline underline-offset-2">
              Transcript Viewer
            </a>
          </p>
        </div>

        {/* Word-by-word transcript */}
        <div className="max-h-48 overflow-y-auto px-4 py-4 pb-20">
          <TranscriptViewerContainer words={words}>
            <TranscriptViewerWords />
          </TranscriptViewerContainer>
        </div>

        <div className="relative h-14">
          <AudioPlayerBar
            position="docked"
            label="Sample recording"
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
  const [wordTimings, setWordTimings] = useState<TranscriptWordTiming[]>([])
  const [transcriptBreaks, setTranscriptBreaks] = useState<TranscriptTimelineBreakpoint[]>([])
  const [wordsLoading, setWordsLoading] = useState(true)

  useEffect(() => {
    fetch(DEMO_WORDS_SRC)
      .then((response) => response.json())
      .then((data: {
        words: TranscriptWordTiming[]
        breaks?: TranscriptTimelineBreakpoint[]
      }) => {
        setWordTimings(data.words)
        setTranscriptBreaks(data.breaks ?? [])
      })
      .finally(() => setWordsLoading(false))
  }, [])

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
          Fixed to the bottom while managers read a verbatim transcript. Use{" "}
          <a href={docPath("/components/transcript-viewer")} className="text-forest underline underline-offset-2">
            Transcript Viewer
          </a>{" "}
          in timeline mode with <code className="font-mono text-xs text-ink">breaks</code> that
          include speaker, role, and section labels. Click a segment to jump; the active
          segment highlights as playback progresses.
        </p>

        <ComponentPreview label="Meeting transcript review">
          <div className="w-full max-w-2xl">
            {wordsLoading ? (
              <div className="rounded-sm border border-border bg-white px-4 py-8 text-sm text-ink-muted">
                Loading transcript...
              </div>
            ) : (
              <TranscriptReviewDemo words={wordTimings} breaks={transcriptBreaks} />
            )}
          </div>
        </ComponentPreview>

        <div className="mt-6 space-y-6">
          <CodeBlock code={DOCKED_CODE} language="tsx" />
          <CodeBlock code={TIMELINE_SEEK_CODE} language="json" />
        </div>
      </section>

      {/* Word-by-word transcript */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          With Transcript Viewer
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Pair the docked bar with{" "}
          <a href={docPath("/components/transcript-viewer")} className="text-forest underline underline-offset-2">
            Transcript Viewer
          </a>{" "}
          when you have word-level timings from transcription. The current word highlights in
          lime as the recording plays; click any word to seek.
        </p>

        <ComponentPreview label="Word-by-word sync">
          <div className="w-full max-w-2xl">
            {wordsLoading ? (
              <div className="rounded-sm border border-border bg-white px-4 py-8 text-sm text-ink-muted">
                Loading word timings...
              </div>
            ) : (
              <WordByWordTranscriptDemo words={wordTimings} />
            )}
          </div>
        </ComponentPreview>
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
