---
name: transcript-viewer
category: data-display
status: stable
extends: null
dependencies: []
registryDependencies: [utils, audio-player]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/transcript-viewer/registry.json
import: import { TranscriptViewerContainer, TranscriptViewerWords } from "@/components/ui/transcript-viewer"
keywords: [transcript, words, alignment, playback, karaoke, meeting, agm, minutes, captions, subtitles]
related: [audio-player, document, widget]
use_when: Show word-by-word transcript text synced to AudioPlayerProvider playback
---

# TranscriptViewer

> Word-by-word or timeline transcript display synced to AudioPlayerProvider playback, with click-to-seek and optional segment breakpoints.

## When to use

- A meeting or voice-note review screen where managers read along as the recording plays, with the current word highlighted.
- Pairing dense verbatim text with the docked `AudioPlayerBar` during AGM transcript review.
- Any recording that already has word-level timing from transcription or forced alignment.

## When NOT to use

- Paragraph-level transcript without word timings — use manual seek rows or another layout instead.
- Live captions during recording — this element is for pre-transcribed, pre-aligned content only.
- Standalone audio with no transcript — use [`audio-player`](../audio-player/audio-player.md) alone.

## Anatomy & look

**Container** (`TranscriptViewerContainer`)
- Must be rendered inside `AudioPlayerProvider`.
- Accepts `words` with `start`/`end` timings (milliseconds by default).
- Provides context for word status and seek helpers.

**Words** (`TranscriptViewerWords`, `variant="words"`)
- Inline flow of clickable word buttons.
- **Spoken:** `text-ink-muted`.
- **Current:** `bg-lime-soft font-medium text-forest`.
- **Unspoken:** default foreground, subtle hover.

**Timeline** (`TranscriptViewerTimeline`, `variant="timeline"`)
- Vertical list of passage segments defined by `breaks`.
- Each row: timestamp, optional label, optional speaker and role, full segment text.
- **Current segment:** lime-soft background, forest text.
- Click a row to seek to the segment start.

## API

### TranscriptViewerContainer

| Prop | Type | Default | Description |
|---|---|---|---|
| `words` | `TranscriptWordTiming[]` | — | Word text with `start` and `end` timings. |
| `breaks` | `TranscriptTimelineBreakpoint[]` | `[]` | Segment boundaries for timeline mode. |
| `finalSegment` | `TranscriptFinalSegmentMeta` | — | Optional label, speaker, and role for the trailing segment after the last break. |
| `variant` | `"words" \| "timeline"` | `"words"` | Inline words or grouped timeline segments. |
| `timeUnit` | `"ms" \| "s"` | `"ms"` | Unit for each word's `start` and `end`. |
| `children` | `ReactNode` | — | `TranscriptViewerWords` or `TranscriptViewerTimeline`. |

### TranscriptTimelineBreakpoint

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Stable segment identifier. |
| `label` | `string` | Optional segment title in timeline mode. |
| `speaker` | `string` | Optional speaker name shown above the segment text. |
| `role` | `string` | Optional role or lot label (e.g. Chair, Strata manager, Lot 1). |
| `afterWordIndex` | `number` | Last word index in the segment; break follows this word. |

### TranscriptFinalSegmentMeta

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Optional identifier for the trailing segment. |
| `label` | `string` | Optional segment title. |
| `speaker` | `string` | Optional speaker name. |
| `role` | `string` | Optional role or lot label. |

### TranscriptViewerTimeline

| Prop | Type | Default | Description |
|---|---|---|---|
| `renderSegment` | `({ segment, status }) => ReactNode` | — | Custom renderer per segment. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Passed to the timeline wrapper. |

### TranscriptViewerWords

| Prop | Type | Default | Description |
|---|---|---|---|
| `renderWord` | `({ word, status }) => ReactNode` | — | Custom renderer per word. |
| `...props` | `HTMLAttributes<HTMLDivElement>` | — | Passed to the words wrapper. |

### TranscriptWordTiming

| Field | Type | Description |
|---|---|---|
| `word` | `string` | The word text (include punctuation). |
| `start` | `number` | Start time in `timeUnit`. |
| `end` | `number` | End time in `timeUnit`. |

### useTranscriptViewer()

Returns `{ words, currentTime, currentWord, currentWordIndex, getWordStatus, seekToWord }`.

### Utilities

| Export | Description |
|---|---|
| `normaliseTranscriptWords({ words, timeUnit? })` | Converts timings to seconds with indices. |
| `getTranscriptWordStatus({ word, currentTime })` | Returns `spoken`, `current`, or `unspoken`. |
| `findCurrentTranscriptWord({ words, currentTime })` | Finds the active word at a playback time. |

Exports: `TranscriptViewerContainer`, `TranscriptViewerWords`, `TranscriptViewerTimeline`, `useTranscriptViewer`, `normaliseTranscriptWords`, `getTranscriptWordStatus`, `findCurrentTranscriptWord`, and types `TranscriptWordTiming`, `TranscriptWord`, `TranscriptWordStatus`, `TranscriptTimeUnit`, `TranscriptTimelineBreakpoint`, `TranscriptFinalSegmentMeta`, `TranscriptSegment`, plus `TranscriptViewerContainerProps`, `TranscriptViewerWordsProps`.

## Usage

```tsx
import { AudioPlayerBar, AudioPlayerProvider } from "@/components/ui/audio-player"
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
</AudioPlayerProvider>
```

## Variants & states

```tsx
// seconds: when your ASR returns timings in seconds instead of milliseconds
<TranscriptViewerContainer words={wordTimings} timeUnit="s">
  <TranscriptViewerWords />
</TranscriptViewerContainer>
```

```tsx
// timeline: grouped segments with breakpoints and speaker metadata
const breaks = [
  {
    id: "opening",
    label: "Call to order",
    speaker: "David Okonkwo",
    role: "Chair",
    afterWordIndex: 7,
  },
  {
    id: "overview",
    label: "Platform overview",
    speaker: "Sarah Mitchell",
    role: "Strata manager",
    afterWordIndex: 28,
  },
]

<AudioPlayerProvider item={recording}>
  <TranscriptViewerContainer words={wordTimings} breaks={breaks} variant="timeline">
    <TranscriptViewerTimeline />
  </TranscriptViewerContainer>
  <AudioPlayerBar position="docked" label="AGM recording" />
</AudioPlayerProvider>
```

```tsx
// custom word rendering
<TranscriptViewerWords
  renderWord={({ word, status }) => (
    <span className={status === "current" ? "font-bold text-forest" : ""}>
      {word.word}{" "}
    </span>
  )}
/>
```

## Do / Don't

- Store word timings alongside the recording URL when transcription completes; fetch both at review time.
- Keep `TranscriptViewerContainer` inside the same `AudioPlayerProvider` as the bar so playback stays in sync.
- Pass timings in milliseconds unless your pipeline uses seconds (`timeUnit="s"`).
- Define `breaks` at natural passage boundaries for timeline mode; use word mode for karaoke-style follow-along.
- Do not expect word highlighting from an MP3 alone; you need a separate timing payload from transcription or forced alignment.
- Do not nest multiple transcript viewers on one player unless they show different passages.
