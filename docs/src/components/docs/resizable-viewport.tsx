"use client";

import * as React from "react";
import type { GroupImperativeHandle } from "react-resizable-panels";
import { GripVertical } from "lucide-react";

import { ViewportIframe } from "@/components/docs/viewport-iframe";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { cn } from "@/lib/utils";

const VIEWPORT_PRESETS = [
  { label: "Mobile", width: 375 },
  { label: "Large phone", width: 640 },
  { label: "Tablet", width: 768 },
  { label: "Desktop", width: 1024 },
  { label: "Wide", width: 1280 },
] as const;

/**
 * Maps a pixel width to the active Tailwind breakpoint token.
 */
function getBreakpointToken({ width }: { width: number }) {
  if (width >= 1280) {
    return "xl";
  }
  if (width >= 1024) {
    return "lg";
  }
  if (width >= 768) {
    return "md";
  }
  if (width >= 640) {
    return "sm";
  }
  return "default";
}

export interface ResizableViewportProps {
  children: React.ReactNode;
  /** Label shown in the toolbar. */
  label?: string;
  /** Helper copy below the viewport. */
  caption?: string;
  /** Viewport canvas height in pixels. */
  height?: number;
  /** Initial viewport panel size as a percentage of the group width. */
  defaultSize?: number;
  /**
   * When true (default), content renders in an iframe so Tailwind breakpoints
   * follow the panel width. When false, content renders inline (layout only).
   */
  iframe?: boolean;
  className?: string;
}

/**
 * Drag-to-resize viewport for testing components at different widths.
 *
 * Uses an iframe by default so CSS media queries behave like a real browser
 * viewport. JavaScript hooks that read `window.innerWidth` (for example
   * `useIsMobile`) still follow the outer browser window.
 */
export function ResizableViewport({
  children,
  label,
  caption,
  height = 440,
  defaultSize = 52,
  iframe = true,
  className,
}: ResizableViewportProps) {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const groupRef = React.useRef<GroupImperativeHandle>(null);
  const viewportPanelRef = React.useRef<HTMLDivElement>(null);
  const [viewportWidth, setViewportWidth] = React.useState<number | null>(null);
  const [activePreset, setActivePreset] = React.useState<number | null>(375);

  const breakpoint = viewportWidth != null ? getBreakpointToken({ width: viewportWidth }) : null;

  /** Measure the viewport panel width from the panel element. */
  const measureViewport = React.useCallback(() => {
    const node = viewportPanelRef.current;
    if (!node) {
      return;
    }
    setViewportWidth(Math.round(node.getBoundingClientRect().width));
  }, []);

  /** Apply a preset width by resizing the viewport panel percentage. */
  const applyPreset = React.useCallback(
    ({ widthPx }: { widthPx: number }) => {
      const container = containerRef.current;
      const group = groupRef.current;
      if (!container || !group) {
        return;
      }

      const totalWidth = container.getBoundingClientRect().width;
      if (totalWidth <= 0) {
        return;
      }

      const viewportPercent = Math.min(92, Math.max(22, (widthPx / totalWidth) * 100));
      group.setLayout({
        viewport: viewportPercent,
        spacer: 100 - viewportPercent,
      });
      setActivePreset(widthPx);
    },
    []
  );

  React.useEffect(() => {
    const node = viewportPanelRef.current;
    if (!node) {
      return;
    }

    const observer = new ResizeObserver(() => {
      measureViewport();
    });
    observer.observe(node);
    measureViewport();

    return () => {
      observer.disconnect();
    };
  }, [measureViewport]);

  React.useEffect(() => {
    applyPreset({ widthPx: 375 });
  }, [applyPreset]);

  const handleIframeWidthChange = React.useCallback(
    ({ width }: { width: number }) => {
      setViewportWidth(width);
      setActivePreset(null);
    },
    []
  );

  return (
    <div
      className={cn("overflow-hidden rounded-sm border border-border", className)}
      ref={containerRef}
    >
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-border bg-secondary px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {label ? (
            <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-1">
              {label}
            </p>
          ) : null}
          <p className="font-sans text-xs text-ink-muted">
            Drag the handle to resize. Breakpoints follow the viewport panel width
            {iframe ? " inside the iframe" : ""}.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {VIEWPORT_PRESETS.map((preset) => (
            <button
              key={preset.width}
              type="button"
              onClick={() => applyPreset({ widthPx: preset.width })}
              className={cn(
                "rounded-sm border px-2 py-1 font-mono text-[11px] transition-colors duration-150",
                activePreset === preset.width
                  ? "border-forest bg-forest text-white"
                  : "border-border bg-background text-ink-muted hover:border-ink-muted/40 hover:text-foreground"
              )}
            >
              {preset.width}
            </button>
          ))}
        </div>
      </div>

      {/* Resizable viewport + spacer */}
      <ResizablePanelGroup
        orientation="horizontal"
        className="bg-off-white/40"
        style={{ height }}
        groupRef={groupRef}
        onLayoutChanged={() => {
          measureViewport();
          setActivePreset(null);
        }}
      >
        <ResizablePanel
          id="viewport"
          defaultSize={`${defaultSize}%`}
          minSize="22%"
          className="min-w-0"
        >
          <div ref={viewportPanelRef} className="flex h-full min-w-0 flex-col">
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2">
              <div className="flex items-center gap-1.5" aria-hidden="true">
                <span className="size-2 rounded-full bg-danger/80" />
                <span className="size-2 rounded-full bg-warning/80" />
                <span className="size-2 rounded-full bg-lime/80" />
              </div>
              <div className="min-w-0 flex-1 rounded-sm bg-background px-2 py-1 font-mono text-[10px] text-ink-muted truncate">
                preview.local
                {viewportWidth != null ? ` · ${viewportWidth}px` : ""}
                {breakpoint ? ` · ${breakpoint}` : ""}
              </div>
            </div>

            {/* Canvas */}
            <div className="min-h-0 flex-1 overflow-hidden bg-background">
              {iframe ? (
                <ViewportIframe
                  title={label ?? "Resizable component viewport"}
                  onWidthChange={handleIframeWidthChange}
                >
                  <div className="p-3">{children}</div>
                </ViewportIframe>
              ) : (
                <div className="h-full overflow-auto p-3">{children}</div>
              )}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel id="spacer" defaultSize={`${100 - defaultSize}%`} minSize="8%">
          <div className="flex h-full flex-col items-center justify-center gap-3 px-4 text-center">
            <GripVertical
              className="size-5 text-ink-muted/50"
              strokeWidth={1.5}
              aria-hidden
            />
            <div className="space-y-1">
              <p className="font-sans text-xs font-semibold text-foreground">
                Drag to resize viewport
              </p>
              <p className="font-sans text-[11px] text-ink-muted leading-relaxed max-w-[12rem]">
                {iframe
                  ? "Iframe isolates CSS breakpoints from your browser window."
                  : "Inline mode shows layout width only. CSS breakpoints still use the browser window."}
              </p>
              {viewportWidth != null ? (
                <p className="font-mono text-[11px] text-lime pt-1">
                  {viewportWidth}px · {breakpoint}
                </p>
              ) : null}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>

      {caption ? (
        <div className="border-t border-border bg-secondary px-4 py-3">
          <p className="font-sans text-xs text-ink-muted leading-relaxed">{caption}</p>
        </div>
      ) : null}
    </div>
  );
}
