import { Container, type ContainerWidth } from "@/components/ui/section"
import { cn } from "@/lib/utils"
import type { HTMLAttributes } from "react"

interface DocsPageProps extends HTMLAttributes<HTMLDivElement> {
  /** Container width — default matches standard marketing pages (1200px). */
  width?: ContainerWidth
}

/**
 * Constrains documentation content to the site grid used on marketing pages.
 */
export function DocsPage({
  children,
  className,
  width = "default",
  ...props
}: DocsPageProps) {
  return (
    <Container width={width} className={cn("py-14", className)} {...props}>
      {children}
    </Container>
  )
}
