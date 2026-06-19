"use client";

import * as React from "react";
import { createPortal } from "react-dom";

import { cn } from "@/lib/utils";

interface ViewportIframeProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  /** Called when the iframe element width changes. */
  onWidthChange?: ({ width }: { width: number }) => void;
}

/**
 * Copies parent document styles into an iframe so Tailwind utilities render correctly.
 * Creates fresh nodes instead of cloning so script tags or React metadata never leak in.
 */
function syncIframeStyles({ doc }: { doc: Document }) {
  if (doc.head.querySelector("[data-viewport-sync]")) {
    return;
  }

  document.querySelectorAll('link[rel="stylesheet"]').forEach((node) => {
    if (!(node instanceof HTMLLinkElement) || !node.href) {
      return;
    }

    try {
      const url = new URL(node.href, document.baseURI);
      if (url.origin !== window.location.origin) {
        return;
      }
    } catch {
      return;
    }

    const link = doc.createElement("link");
    link.rel = "stylesheet";
    link.href = node.href;
    link.setAttribute("data-viewport-sync", "true");
    doc.head.appendChild(link);
  });

  document.querySelectorAll("style").forEach((node) => {
    if (!(node instanceof HTMLStyleElement)) {
      return;
    }

    const style = doc.createElement("style");
    style.textContent = node.textContent;
    style.setAttribute("data-viewport-sync", "true");
    doc.head.appendChild(style);
  });

  doc.documentElement.className = document.documentElement.className;
  doc.documentElement.style.colorScheme =
    document.documentElement.style.colorScheme ||
    (document.documentElement.classList.contains("dark") ? "dark" : "light");

  doc.body.className = cn(document.body.className, "m-0 overflow-x-hidden bg-background");
  doc.body.style.margin = "0";
}

/**
 * Renders children inside an isolated iframe document.
 *
 * Media queries inside the iframe follow the iframe width, not the browser window,
 * which is what a real device viewport needs for responsive testing.
 */
export function ViewportIframe({
  children,
  className,
  title = "Component viewport preview",
  onWidthChange,
}: ViewportIframeProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null);
  const [mountNode, setMountNode] = React.useState<HTMLElement | null>(null);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) {
      return;
    }

    /** Initialise iframe document and mount target. */
    function init() {
      const doc = iframe?.contentDocument;
      if (!doc) {
        return;
      }

      syncIframeStyles({ doc });
      setMountNode(doc.body);
    }

    iframe.addEventListener("load", init);
    init();

    return () => {
      iframe.removeEventListener("load", init);
    };
  }, []);

  React.useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe || !onWidthChange) {
      return;
    }

    const observer = new ResizeObserver((entries) => {
      const width = entries[0]?.contentRect.width;
      if (width != null) {
        onWidthChange({ width: Math.round(width) });
      }
    });

    observer.observe(iframe);

    return () => {
      observer.disconnect();
    };
  }, [onWidthChange, mountNode]);

  return (
    <>
      <iframe
        ref={iframeRef}
        title={title}
        src="about:blank"
        className={cn("block h-full w-full border-0 bg-background", className)}
      />
      {mountNode ? createPortal(children, mountNode) : null}
    </>
  );
}
