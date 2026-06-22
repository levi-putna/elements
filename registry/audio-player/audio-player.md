---
name: audio-player
category: data-display
status: stable
extends: null
dependencies: [lucide-react]
registryDependencies: [utils]
install: npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/audio-player/registry.json
import: import { AudioPlayerProvider, AudioPlayerBar, useAudioPlayer, useAudioPlayerSeek } from "@/components/ui/audio-player"
keywords: [audio, recording, playback, waveform, transcript, meeting, agm, minutes, player, seek, timeline]
related: [document, widget, tabs]
use_when: Play a strata meeting or voice recording with scrubbing, skip controls, and jump-to-timestamp sync
---

# AudioPlayer

> A composable audio recording player with a real amplitude waveform, 15-second skip controls, canvas scrubbing aligned to playback, and inline or bottom-docked placement for meeting transcript review.

## When to use

- A meeting transcript or verbatim minutes page where managers listen to the AGM recording while reading speaker-labelled text.
- A document or task detail view that includes a voice note or uploaded `.mp3`/`.m4a` attachment.
- Any workflow step that pairs scrollable content with a persistent recording bar (`position="docked"`).
- A review screen where transcript timestamps should jump the playhead.

## When NOT to use

- Live microphone capture or dictation — use browser speech APIs or a dedicated recording input, not this player.
- Background ambient music or a multi-track playlist — this element is optimised for a single strata recording, not a media library.
- A simple file download link with no playback — use a plain link or [`button`](../button/button.md).
- Displaying transcript text alone — pair this player with document or prose content; it does not render transcript rows.

## Anatomy & look

**Provider shell**
- Hidden HTML5 `<audio>` element managed by `AudioPlayerProvider`.
- Shared state: active track, duration, play/pause, buffering, playback rate, and waveform peaks.
- When `peaks` are omitted, the provider decodes the audio file with the Web Audio API and caches amplitudes per URL.

**Recording bar** (`AudioPlayerBar`)
- Forest background (`#022A1E`) with white/lime chrome, matching dark-section palette rules.
- Left cluster: `«15` skip back, lime circular play/pause, `15»` skip forward.
- Centre: canvas waveform scrubber. Played bars in `--color-lime`; unplayed bars in muted white/20. White vertical playhead at `currentTime / duration`.
- Right cluster: total duration, optional recording label with red dot (e.g. "AGM recording"), download icon button.
- `position="inline"`: `rounded-sm` bar in normal document flow.
- `position="docked"`: `fixed` to viewport bottom, full width, no bottom border; content above needs bottom padding so rows are not obscured.

**Composable primitives**
- `AudioPlayerButton`, `AudioPlayerSkip`, `AudioPlayerTime`, `AudioPlayerDuration`, `AudioPlayerWaveform`, `AudioPlayerLabel`, `AudioPlayerDownload` for custom layouts.

**States**
- Buffering: play button shows a spinner.
- Peaks loading: waveform shows a low-amplitude placeholder until decode completes.
- No duration yet: duration reads `--:--` until metadata loads.
- Disabled track: pass `disabled` to `AudioPlayerButton`.

## API

### AudioPlayerProvider

| Prop | Type | Default | Description |
|---|---|---|---|
| `item` | `AudioPlayerItem` | — | Initial track (`id`, `src`, optional `data`). |
| `peaks` | `number[]` | decoded | Waveform bar heights (0–1). Decoded from `item.src` when omitted. |
| `onSeek` | `({ time }) => void` | — | Fired when the user seeks via waveform or skip. |
| `children` | `ReactNode` | — | Player UI. |

### AudioPlayerBar

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `"inline" \| "docked"` | `"inline"` | Document flow or fixed bottom bar. |
| `label` | `string` | — | Recording name shown on the right. |
| `showRecordingDot` | `boolean` | `true` | Red dot before the label. |
| `skipSeconds` | `number` | `15` | Skip back/forward interval. |
| `downloadHref` | `string` | — | URL for the download action. |
| `downloadFilename` | `string` | — | Suggested download filename. |

### AudioPlayerWaveform

| Prop | Type | Default | Description |
|---|---|---|---|
| `onSeek` | `({ time }) => void` | — | Local seek callback (in addition to provider `onSeek`). |

### AudioPlayerButton

| Prop | Type | Default | Description |
|---|---|---|---|
| `item` | `AudioPlayerItem` | — | Track to load when pressed. Controls current track when omitted. |
| `disabled` | `boolean` | `false` | Disables the button. |

### AudioPlayerSkip

| Prop | Type | Default | Description |
|---|---|---|---|
| `seconds` | `number` | `15` | Skip interval. |
| `direction` | `"back" \| "forward"` | `"back"` | Skip direction. |

### AudioPlayerTime

| Prop | Type | Default | Description |
|---|---|---|---|
| `accent` | `boolean` | `false` | Renders current time in lime (for dark bar). |

### AudioPlayerLabel

| Prop | Type | Default | Description |
|---|---|---|---|
| `label` | `string` | — | Recording title text. |
| `showRecordingDot` | `boolean` | `true` | Shows red indicator dot. |

### AudioPlayerDownload

| Prop | Type | Default | Description |
|---|---|---|---|
| `href` | `string` | — | File URL. |
| `filename` | `string` | — | Download attribute value. |

### useAudioPlayer()

Returns `{ ref, activeItem, duration, error, isPlaying, isBuffering, playbackRate, peaks, peaksLoading, isItemActive, setActiveItem, play, pause, seek, setPlaybackRate, setPeaks }`.

### useAudioPlayerTime()

Returns current playback time in seconds (requestAnimationFrame updates).

### useAudioPlayerSeek()

Returns `{ seekToTime({ time, autoPlay? }) }` for transcript timestamp clicks.

### Utilities

| Export | Description |
|---|---|
| `formatAudioTime({ seconds })` | Formats seconds as `M:SS` or `H:MM:SS`. |
| `extractAudioPeaksFromSrc({ src, barCount? })` | Decodes an audio URL and returns normalised peak amplitudes. |
| `generateAudioPeaks({ seed, count? })` | Deterministic fallback peaks when decode fails. |

Exports: `AudioPlayerProvider`, `AudioPlayerBar`, `AudioPlayerButton`, `AudioPlayerSkip`, `AudioPlayerTime`, `AudioPlayerDuration`, `AudioPlayerWaveform`, `AudioPlayerLabel`, `AudioPlayerDownload`, `useAudioPlayer`, `useAudioPlayerTime`, `useAudioPlayerSeek`, `formatAudioTime`, `extractAudioPeaksFromSrc`, `generateAudioPeaks`, and types `AudioPlayerItem`, `AudioPlayerMarker`, `AudioPlayerPosition`, plus all `*Props` interfaces.

## Usage

```tsx
import {
  AudioPlayerBar,
  AudioPlayerProvider,
} from "@/components/ui/audio-player"

const recording = {
  id: "agm-2026",
  src: "/recordings/harbour-view-agm-2026.mp3",
  data: { scheme: "Harbour View Towers" },
}

<AudioPlayerProvider item={recording}>
  <AudioPlayerBar
    label="AGM recording"
    downloadHref={recording.src}
    downloadFilename="harbour-view-agm-2026.mp3"
  />
</AudioPlayerProvider>
```

## Variants & states

```tsx
// docked: meeting transcript review — pad page content above the bar
<AudioPlayerProvider item={recording}>
  <main className="pb-24">{transcriptContent}</main>
  <AudioPlayerBar position="docked" label="AGM recording" downloadHref={recording.src} />
</AudioPlayerProvider>
```

```tsx
// inline: detail panel or document preview
<AudioPlayerProvider item={recording}>
  <AudioPlayerBar position="inline" label="Committee meeting" />
</AudioPlayerProvider>
```

```tsx
// transcript sync: jump from timestamp links
function TranscriptRow({ time, children }: { time: number; children: React.ReactNode }) {
  const { seekToTime } = useAudioPlayerSeek()

  return (
    <button type="button" onClick={() => seekToTime({ time })} className="text-left">
      <span className="tabular-nums text-ink-muted">{formatAudioTime({ seconds: time })}</span>
      {children}
    </button>
  )
}
```

```tsx
// custom layout: compose primitives instead of AudioPlayerBar
<AudioPlayerProvider item={recording}>
  <div className="flex items-center gap-3 rounded-sm bg-[#022A1E] px-4 py-2">
    <AudioPlayerButton />
    <AudioPlayerTime accent />
    <AudioPlayerWaveform className="flex-1" />
    <AudioPlayerDuration />
  </div>
</AudioPlayerProvider>
```

## Do / Don't

- Use `position="docked"` on transcript review pages and add bottom padding (`pb-20` or more) to scrollable content so the last rows stay visible.
- Wire transcript timestamp buttons through `useAudioPlayerSeek()` so play and seek stay in sync.
- Provide pre-computed `peaks` from your transcription pipeline when decoding client-side is too slow; otherwise let the provider decode automatically.
- Ensure recording URLs are same-origin or CORS-enabled so the Web Audio API can fetch them.
- Do not use white text on lime; the play button uses lime fill with forest icon/text.
- Do not stack multiple docked players on one page; one recording bar per view.
- Do not use this element for live streaming; it expects a seekable file URL.
