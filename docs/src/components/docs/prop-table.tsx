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
    <div className="rounded-lg border border-border overflow-hidden">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/50">
            <th className="text-left px-4 py-3 font-medium text-muted-foreground w-32">Prop</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground w-40">Type</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground w-24">Default</th>
            <th className="text-left px-4 py-3 font-medium text-muted-foreground">Description</th>
          </tr>
        </thead>
        <tbody>
          {props.map((prop, i) => (
            <tr key={prop.name} className={i < props.length - 1 ? "border-b border-border" : ""}>
              <td className="px-4 py-3 font-mono text-xs">{prop.name}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{prop.type}</td>
              <td className="px-4 py-3 font-mono text-xs text-muted-foreground">
                {prop.default ?? "—"}
              </td>
              <td className="px-4 py-3 text-muted-foreground">{prop.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
