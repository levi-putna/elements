interface ComponentPreviewProps {
  children: React.ReactNode;
}

export function ComponentPreview({ children }: ComponentPreviewProps) {
  return (
    <div className="rounded-lg border border-border bg-background flex items-center justify-center p-12 min-h-40">
      {children}
    </div>
  );
}
