import { cn } from "@/lib/utils";
import { Monitor, Smartphone } from "lucide-react";
import type { ReactNode } from "react";

interface ViewportFrameProps {
  /** Frame title, e.g. Mobile or Desktop. */
  title: string;
  /** Width label shown in the frame header. */
  widthLabel: string;
  /** Max width of the content area in pixels. */
  maxWidth: number;
  /** Lucide icon for the frame header. */
  icon: typeof Smartphone;
  children: ReactNode;
}

/**
 * Renders a labelled viewport frame for responsive documentation previews.
 */
function ViewportFrame({
  title,
  widthLabel,
  maxWidth,
  icon: Icon,
  children,
}: ViewportFrameProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col rounded-sm border border-border bg-secondary/40 overflow-hidden">
      {/* Frame header */}
      <div className="flex items-center gap-2 border-b border-border bg-secondary px-3 py-2">
        <Icon className="size-3.5 text-ink-muted shrink-0" strokeWidth={1.5} aria-hidden />
        <span className="font-sans text-xs font-semibold text-foreground">{title}</span>
        <span className="ml-auto font-mono text-[10px] text-ink-muted">{widthLabel}</span>
      </div>

      {/* Content canvas */}
      <div className="flex justify-center bg-off-white/50 p-3 sm:p-4">
        <div
          className="w-full overflow-hidden rounded-sm border border-border bg-background shadow-[0_1px_3px_rgba(0,0,0,0.06)]"
          style={{ maxWidth }}
        >
          {children}
        </div>
      </div>
    </div>
  );
}

export interface ViewportCompareProps {
  /** Optional label above the comparison block. */
  label?: string;
  /** Caption below the frames. */
  caption?: string;
  /** Mobile viewport content. */
  mobile: ReactNode;
  /** Desktop viewport content. */
  desktop: ReactNode;
  /** Mobile frame max width in pixels. */
  mobileWidth?: number;
  /** Desktop frame max width in pixels. */
  desktopWidth?: number;
  className?: string;
}

/**
 * Side-by-side mobile and desktop preview frames for foundation documentation.
 */
export function ViewportCompare({
  label,
  caption,
  mobile,
  desktop,
  mobileWidth = 375,
  desktopWidth = 960,
  className,
}: ViewportCompareProps) {
  return (
    <div className={cn("rounded-sm border border-border overflow-hidden", className)}>
      {label ? (
        <div className="px-4 py-2 border-b border-border bg-secondary">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            {label}
          </span>
        </div>
      ) : null}

      <div className="flex flex-col gap-4 bg-background p-4 lg:flex-row lg:items-start">
        <ViewportFrame
          title="Mobile"
          widthLabel={`${mobileWidth}px`}
          maxWidth={mobileWidth}
          icon={Smartphone}
        >
          {mobile}
        </ViewportFrame>

        <ViewportFrame
          title="Desktop"
          widthLabel={`${desktopWidth}px`}
          maxWidth={desktopWidth}
          icon={Monitor}
        >
          {desktop}
        </ViewportFrame>
      </div>

      {caption ? (
        <div className="border-t border-border bg-secondary px-4 py-3">
          <p className="font-sans text-xs text-ink-muted leading-relaxed">{caption}</p>
        </div>
      ) : null}
    </div>
  );
}
