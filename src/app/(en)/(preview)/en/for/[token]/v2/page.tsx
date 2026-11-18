import type { Metadata } from "next";
import { PreviewHome, previewHomeMetadata } from "@/views/PreviewHome";

// The same personalised preview without the 3D hero (for a slow laptop, or a lead who'd rather not)
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return previewHomeMetadata("en", (await params).token);
}

export default async function PreviewPageV2({ params }: Props) {
  return <PreviewHome locale="en" token={(await params).token} hero="2d" />;
}
