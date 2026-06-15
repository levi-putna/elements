interface Prop {
  name: string;
  type: string;
  default?: string;
  description: string;
}

interface PropTableProps {
  props: Prop[];
}

export function PropTable({ props }: PropTableProps) {
  return (
    <div className="rounded-sm border border-border overflow-hidden text-sm">
      <table className="w-full">
        <thead>
          <tr className="bg-off-white border-b border-border">
            <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted w-32">Prop</th>
            <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted w-44">Type</th>
            <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted w-20">Default</th>
            <th className="text-left px-4 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-ink-muted">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, i) => (
            <tr
              key={prop.name}
              className={i < props.length - 1 ? "border-b border-border" : ""}
            >
              <td className="px-4 py-3 font-mono text-xs text-foreground">{prop.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-ink-muted">{prop.default ?? "—"}</td>
              <td className="px-4 py-3 text-xs text-ink-muted leading-relaxed">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
