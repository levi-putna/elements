interface ComponentPreviewProps {
  children: React.ReactNode;
  label?: string;
}

export function ComponentPreview({ children, label }: ComponentPreviewProps) {
  return (
    <div className="rounded-sm border border-border overflow-hidden">
      {label && (
        <div className="px-4 py-2 border-b border-border bg-off-white">
          <span className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted">
            {label}
          </span>
        </div>
      )}
      <div className="bg-white flex items-center justify-center p-12 min-h-40">
        {children}
      </div>
    </div>
  );
}
