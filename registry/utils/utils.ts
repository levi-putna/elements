import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Prefix a public asset path when the app is served under a Next.js basePath.
 * Set NEXT_PUBLIC_BASE_PATH (e.g. "/elements") in apps that use one.
 */
export function assetPath(path: string): string {
  const base = process.env.NEXT_PUBLIC_BASE_PATH ?? ""
  if (path.startsWith("http") || (base && path.startsWith(base))) {
    return path
  }
  const normalized = path.startsWith("/") ? path : `/${path}`
  return `${base}${normalized}`
}
