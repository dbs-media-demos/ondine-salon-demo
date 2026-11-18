import type { Metadata } from "next";
import { PreviewHome, previewHomeMetadata } from "@/views/PreviewHome";

// Always the CRM's current data: an edit there shows on the next reload
export const dynamic = "force-dynamic";

type Props = { params: Promise<{ token: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return previewHomeMetadata("sr", (await params).token);
}

export default async function PreviewPage({ params }: Props) {
  return <PreviewHome locale="sr" token={(await params).token} />;
}
