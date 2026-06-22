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

const INSTALL_CODE = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/transcript-viewer/registry.json`

const USAGE_CODE = `import { AudioPlayerBar, AudioPlayerProvider } from "@/components/ui/audio-player"
import {
  TranscriptViewerContainer,
  TranscriptViewerWords,
} from "@/components/ui/transcript-viewer"

const recording = { id: "welcome", src: "/audio/welcome.mp3" }

const wordTimings = [
  { word: "Welcome", start: 0, end: 347 },
  { word: "to", start: 347, end: 440 },
  // ...
]

<AudioPlayerProvider item={recording}>
  <TranscriptViewerContainer words={wordTimings}>
    <TranscriptViewerWords />
  </TranscriptViewerContainer>
  <AudioPlayerBar position="docked" label="Welcome recording" />
</AudioPlayerProvider>`

const TIMELINE_CODE = `import {
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
  <TranscriptViewerContainer words={wordTimings} breaks={breaks} variant="timeline">
    <TranscriptViewerTimeline />
  </TranscriptViewerContainer>
  <AudioPlayerBar position="docked" label="Welcome recording" />
</AudioPlayerProvider>`

const CONTAINER_PROPS = [
  {
    name: "words",
    type: "TranscriptWordTiming[]",
    description: "Word text with start and end timings from transcription or forced alignment.",
  },
  {
    name: "breaks",
    type: "TranscriptTimelineBreakpoint[]",
    default: "[]",
    description: "Timeline segment boundaries. Each break ends a segment after the given word index. Optional speaker and role metadata display above the passage text.",
  },
  {
    name: "finalSegment",
    type: "TranscriptFinalSegmentMeta",
    description: "Optional label, speaker, and role for the trailing segment after the last break.",
  },
  {
    name: "variant",
    type: '"words" | "timeline"',
    default: '"words"',
    description: "Inline word highlighting or grouped timeline segments.",
  },
  {
    name: "timeUnit",
    type: '"ms" | "s"',
    default: '"ms"',
    description: "Unit for each word start and end value.",
  },
]

const WORDS_PROPS = [
  {
    name: "renderWord",
    type: "({ word, status }) => ReactNode",
    description: "Optional custom renderer per word.",
  },
]

const TIMELINE_PROPS = [
  {
    name: "renderSegment",
    type: "({ segment, status }) => ReactNode",
    description: "Optional custom renderer per timeline segment.",
  },
]

/**
 * Word-by-word transcript demo with the shared audio player bar.
 */
function WordByWordDemo({ words }: { words: TranscriptWordTiming[] }) {
  const recording = useMemo(
    () => ({
      id: "audio-test-demo",
      src: DEMO_SRC,
    }),
    []
  )

  return (
    <AudioPlayerProvider item={recording}>
      <div className="relative overflow-hidden rounded-sm border border-border bg-white">
        {/* Transcript header */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Word-by-word transcript
          </p>
          <p className="text-xs text-ink-muted">
            Click a word to seek · current word highlighted in lime
          </p>
        </div>

        {/* Transcript body */}
        <div className="max-h-48 overflow-y-auto px-4 py-4 pb-20">
          <TranscriptViewerContainer words={words}>
            <TranscriptViewerWords />
          </TranscriptViewerContainer>
        </div>

        {/* Docked player */}
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
 * Timeline transcript demo with segment breakpoints.
 */
function TimelineDemo({
  words,
  breaks,
}: {
  words: TranscriptWordTiming[]
  breaks: TranscriptTimelineBreakpoint[]
}) {
  const recording = useMemo(
    () => ({
      id: "timeline-demo",
      src: DEMO_SRC,
    }),
    []
  )

  return (
    <AudioPlayerProvider item={recording}>
      <div className="relative overflow-hidden rounded-sm border border-border bg-white">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border px-4 py-3">
          <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            Timeline transcript
          </p>
          <p className="text-xs text-ink-muted">
            Click a segment to jump · active segment highlighted
          </p>
        </div>

        <div className="max-h-56 overflow-y-auto px-4 py-4 pb-20">
          <TranscriptViewerContainer
            words={words}
            breaks={breaks}
            variant="timeline"
          >
            <TranscriptViewerTimeline />
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
 * Transcript viewer element documentation page.
 */
export default function TranscriptViewerPage() {
  const [words, setWords] = useState<TranscriptWordTiming[]>([])
  const [breaks, setBreaks] = useState<TranscriptTimelineBreakpoint[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(DEMO_WORDS_SRC)
      .then((response) => response.json())
      .then((data: {
        words: TranscriptWordTiming[]
        breaks?: TranscriptTimelineBreakpoint[]
      }) => {
        setWords(data.words)
        setBreaks(data.breaks ?? [])
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <DocsPage width="wide">
      {/* Page header */}
      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Audio
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">
          Transcript Viewer
        </h1>
        <p className="text-base text-ink-muted leading-relaxed max-w-3xl">
          Word-by-word transcript display synced to{" "}
          <a href={docPath("/components/audio-player")} className="text-forest underline underline-offset-2">
            Audio Player
          </a>
          . Pass word timings from your transcription pipeline; the current word highlights in
          lime as playback progresses. Click any word to seek the shared player.
        </p>
      </div>

      {/* Demo */}
      <section className="mb-10">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Word-by-word playback
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Timings are loaded from{" "}
          <code className="font-mono text-xs text-ink">audio_test.words.json</code> alongside the
          sample MP3. Compose{" "}
          <code className="font-mono text-xs text-ink">TranscriptViewerContainer</code> inside the
          same <code className="font-mono text-xs text-ink">AudioPlayerProvider</code> as{" "}
          <code className="font-mono text-xs text-ink">AudioPlayerBar</code>.
        </p>

        <ComponentPreview label="Transcript viewer with docked player">
          <div className="w-full max-w-2xl">
            {loading ? (
              <div className="rounded-sm border border-border bg-white px-4 py-8 text-sm text-ink-muted">
                Loading word timings...
              </div>
            ) : (
              <WordByWordDemo words={words} />
            )}
          </div>
        </ComponentPreview>
      </section>

      {/* Timeline */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Timeline mode
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Set <code className="font-mono text-xs text-ink">variant=&quot;timeline&quot;</code> and
          pass <code className="font-mono text-xs text-ink">breaks</code> to group words into
          jumpable segments. Each break ends a segment after the given word index; optional{" "}
          <code className="font-mono text-xs text-ink">label</code>,{" "}
          <code className="font-mono text-xs text-ink">speaker</code>, and{" "}
          <code className="font-mono text-xs text-ink">role</code> metadata title each row in the
          list. Click a segment to jump; the active segment highlights as playback progresses.
        </p>

        <ComponentPreview label="Timeline segments with docked player">
          <div className="w-full max-w-2xl">
            {loading ? (
              <div className="rounded-sm border border-border bg-white px-4 py-8 text-sm text-ink-muted">
                Loading word timings...
              </div>
            ) : (
              <TimelineDemo words={words} breaks={breaks} />
            )}
          </div>
        </ComponentPreview>

        <div className="mt-6">
          <CodeBlock code={TIMELINE_CODE} language="tsx" />
        </div>
      </section>

      {/* Data format */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Word timing format
        </h2>
        <p className="text-sm text-ink-muted mb-6 max-w-3xl">
          Each word needs a start and end time. By default timings are in milliseconds; pass{" "}
          <code className="font-mono text-xs text-ink">timeUnit=&quot;s&quot;</code> if your ASR
          returns seconds.
        </p>

        <CodeBlock
          code={`{
  "words": [
    { "word": "Welcome", "start": 0, "end": 347 },
    { "word": "to", "start": 347, "end": 440 },
    { "word": "here.", "start": 2032, "end": 2560 }
  ],
  "breaks": [
    {
      "id": "opening",
      "label": "Call to order",
      "speaker": "David Okonkwo",
      "role": "Chair",
      "afterWordIndex": 7
    },
    {
      "id": "overview",
      "label": "Platform overview",
      "speaker": "Sarah Mitchell",
      "role": "Strata manager",
      "afterWordIndex": 28
    }
  ]
}`}
          language="json"
        />
      </section>

      {/* Install */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Installation
        </h2>
        <p className="text-sm text-ink-muted mb-4 max-w-3xl">
          Requires <code className="font-mono text-xs text-ink">audio-player</code> to be installed
          first.
        </p>
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

        <h3 className="text-sm font-semibold text-ink mb-3">TranscriptViewerContainer</h3>
        <div className="mb-8">
          <PropTable props={CONTAINER_PROPS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">TranscriptViewerWords</h3>
        <div className="mb-8">
          <PropTable props={WORDS_PROPS} />
        </div>

        <h3 className="text-sm font-semibold text-ink mb-3">TranscriptViewerTimeline</h3>
        <PropTable props={TIMELINE_PROPS} />
      </section>
    </DocsPage>
  )
}
