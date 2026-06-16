import type { Metadata } from "next";
import { AppPreview } from "@/components/preview/app-preview";

export const metadata: Metadata = {
  title: "App preview",
  description: "Full-screen preview of the Instant Strata application shell.",
};

export default function AppPreviewPage() {
  return <AppPreview />;
}
