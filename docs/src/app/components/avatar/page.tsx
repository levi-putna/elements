import { CodeBlock } from "@/components/docs/code-block";
import { ComponentPreview } from "@/components/docs/component-preview";
import { DocsPage } from "@/components/docs/docs-page";
import { PropTable } from "@/components/docs/prop-table";
import {
  Avatar,
  AvatarGroup,
  AvatarGroupCount,
} from "@/components/ui/avatar";

const INSTALL = `npx shadcn add https://raw.githubusercontent.com/levi-putna/elements/main/registry/avatar/registry.json`;

const VARIANTS_CODE = `import { Avatar } from "@/components/ui/avatar"

{/* default — off-white background, forest text */}
<Avatar name="Levi Putna" />

{/* primary — forest background, white text */}
<Avatar name="Levi Putna" variant="primary" />

{/* with a photo — falls back to initials if it fails to load */}
<Avatar name="Ada Lovelace" src="/img/person/1.jpg" />`;

const GROUP_CODE = `import { AvatarGroup, Avatar, AvatarGroupCount } from "@/components/ui/avatar"

<AvatarGroup>
  <Avatar name="Ada Lovelace" src="/img/person/1.jpg" />
  <Avatar name="Grace Hopper" src="/img/person/2.jpg" />
  <Avatar name="Alan Turing" src="/img/person/3.jpg" />
  <AvatarGroupCount count={5} />
</AvatarGroup>`;

const AVATAR_PROPS = [
  { name: "src", type: "string", description: "Image source. Falls back to initials if absent or if it fails to load." },
  { name: "name", type: "string", description: "Person/entity name — used to derive initials and as the image alt text." },
  { name: "fallback", type: "ReactNode", description: "Explicit fallback content, overriding the derived initials." },
  { name: "variant", type: '"default" | "primary"', default: '"default"', description: "default = off-white background with forest text. primary = forest background with white text." },
  { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Avatar dimensions: sm 24px, md 32px, lg 40px, xl 48px." },
  { name: "shape", type: '"square" | "round"', default: '"square"', description: "square = system users (managers, staff). round = strata owners via OwnerAvatar." },
];

const GROUP_PROPS = [
  { name: "ring", type: '"background" | "secondary" | "forest"', default: '"background"', description: "Colour of the 2px ring drawn between overlapping avatars — set it to match the surface behind the group." },
  { name: "children", type: "ReactNode", description: "Avatar elements, optionally ending with an AvatarGroupCount." },
];

const COUNT_PROPS = [
  { name: "count", type: "number", description: "The overflow number, rendered as +N." },
  { name: "variant", type: '"default" | "primary"', default: '"default"', description: "Same variants as Avatar." },
  { name: "size", type: '"sm" | "md" | "lg" | "xl"', default: '"md"', description: "Match the sibling avatars' size." },
];

const PEOPLE = [
  "/elements/img/person/1.jpg",
  "/elements/img/person/2.jpg",
  "/elements/img/person/3.jpg",
  "/elements/img/person/1.jpg",
];

export default function AvatarPage() {
  return (
    <DocsPage width="wide">

      <div className="mb-10">
        <p className="text-[10px] font-semibold uppercase tracking-widest text-ink-muted mb-3">
          Components / Base
        </p>
        <h1 className="text-3xl font-bold tracking-tight text-foreground mb-3">Avatar</h1>
        <p className="text-base text-ink-muted leading-relaxed">
          An identity mark that shows a photo when available and falls back to initials
          derived from the name. Two brand variants and an overlapping group with an
          overflow count.
        </p>
      </div>

      {/* Installation */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-3">Installation</h2>
        <CodeBlock code={INSTALL} language="bash" />
      </section>

      {/* Variants */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Variants</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">default</code> uses an
          off-white background with forest text. <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">primary</code> uses
          a forest background with white text for higher emphasis.
        </p>
        <ComponentPreview label="default · primary">
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-center gap-2">
              <Avatar name="Levi Putna" size="lg" />
              <span className="text-[10px] font-mono text-ink-muted">default</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="Levi Putna" variant="primary" size="lg" />
              <span className="text-[10px] font-mono text-ink-muted">primary</span>
            </div>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={VARIANTS_CODE} language="tsx" />
        </div>
      </section>

      {/* Image + fallback */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Photo &amp; fallback</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          Pass <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">src</code> for a photo.
          If it is missing or fails to load, the avatar falls back to the initials in the chosen variant.
        </p>
        <ComponentPreview label="photo · broken src falls back to initials">
          <div className="flex items-center gap-4">
            <Avatar name="Ada Lovelace" src={PEOPLE[0]} size="lg" />
            <Avatar name="Grace Hopper" src={PEOPLE[1]} size="lg" />
            <Avatar name="Alan Turing" src="/does-not-exist.jpg" size="lg" />
            <Avatar name="Margaret Hamilton" src="/missing.jpg" variant="primary" size="lg" />
          </div>
        </ComponentPreview>
      </section>

      {/* Shape */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Shape</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-3xl">
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">square</code> (default)
          is for system users: managers, staff, and assignees in the app shell.{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">round</code> is for
          strata roll owners via{" "}
          <a href="/components/owner" className="text-forest underline underline-offset-2">
            OwnerAvatar
          </a>
          , so proprietors are visually distinct from internal team members in mixed lists.
        </p>
        <ComponentPreview label="square (system) · round (owner)">
          <div className="flex items-center gap-8">
            <div className="flex flex-col items-center gap-2">
              <Avatar name="Jane Smith" size="lg" shape="square" />
              <span className="text-[10px] font-mono text-ink-muted">square · manager</span>
            </div>
            <div className="flex flex-col items-center gap-2">
              <Avatar name="James &amp; Sarah Chen" size="lg" shape="round" />
              <span className="text-[10px] font-mono text-ink-muted">round · owner</span>
            </div>
          </div>
        </ComponentPreview>
      </section>

      {/* Initials */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Initials</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed max-w-3xl">
          Initials are derived from <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">name</code>.
          Joint proprietors use the first initial of each person and the shared surname.
          Ampersands and &quot;and&quot; are never included in the initials.
        </p>
        <ComponentPreview label="Joint and single owner names">
          <div className="flex flex-wrap items-center gap-4">
            {[
              { name: "James & Sarah Chen", initials: "JC" },
              { name: "Daniel & Kim Wu", initials: "DW" },
              { name: "Margaret O'Brien", initials: "MO" },
              { name: "North Shore Investments Pty Ltd", initials: "NS" },
            ].map(({ name, initials }) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <Avatar name={name} shape="round" size="lg" />
                <span className="text-[10px] font-mono text-ink-muted text-center max-w-[120px]">
                  {initials} · {name.split(" ").slice(0, 2).join(" ")}…
                </span>
              </div>
            ))}
          </div>
        </ComponentPreview>
        <p className="mt-3 text-xs text-ink-muted">
          Use <code className="font-mono text-xs">getAvatarInitials(&#123; name &#125;)</code> when you
          need the initials string without rendering an avatar. Preview expected:{" "}
          JC for James &amp; Sarah Chen.
        </p>
      </section>

      {/* Sizes */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-5">Sizes</h2>
        <ComponentPreview label="sm · md · lg · xl">
          <div className="flex items-end gap-4">
            {(["sm", "md", "lg", "xl"] as const).map((s) => (
              <div key={s} className="flex flex-col items-center gap-2">
                <Avatar name="Levi Putna" src={PEOPLE[2]} size={s} />
                <span className="text-[10px] font-mono text-ink-muted">{s}</span>
              </div>
            ))}
          </div>
        </ComponentPreview>
      </section>

      {/* Group + count */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-2">Avatar group &amp; count</h2>
        <p className="text-sm text-ink-muted mb-5 leading-relaxed">
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">AvatarGroup</code> overlaps its
          children and rings each one in the surface colour. End with an{" "}
          <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded-sm">AvatarGroupCount</code> for a +N
          overflow chip.
        </p>
        <ComponentPreview label="group with overflow count">
          <div className="flex flex-col items-center gap-6">
            <AvatarGroup>
              <Avatar name="Ada Lovelace" src={PEOPLE[0]} />
              <Avatar name="Grace Hopper" src={PEOPLE[1]} />
              <Avatar name="Alan Turing" src={PEOPLE[2]} />
              <Avatar name="Margaret Hamilton" src={PEOPLE[3]} />
              <AvatarGroupCount count={5} />
            </AvatarGroup>
            <AvatarGroup>
              <Avatar name="Ada Lovelace" variant="primary" />
              <Avatar name="Grace Hopper" variant="primary" />
              <Avatar name="Alan Turing" variant="primary" />
              <AvatarGroupCount count={12} variant="primary" />
            </AvatarGroup>
          </div>
        </ComponentPreview>
        <div className="mt-4">
          <CodeBlock code={GROUP_CODE} language="tsx" />
        </div>
      </section>

      {/* Props */}
      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">Avatar Props</h2>
        <PropTable props={AVATAR_PROPS} />
      </section>

      <section className="mb-10 pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">AvatarGroup Props</h2>
        <PropTable props={GROUP_PROPS} />
      </section>

      <section className="pt-10 border-t border-border">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-ink-muted mb-4">AvatarGroupCount Props</h2>
        <PropTable props={COUNT_PROPS} />
      </section>

    </DocsPage>
  );
}
