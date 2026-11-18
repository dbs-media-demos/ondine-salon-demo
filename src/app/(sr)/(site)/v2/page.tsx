import type { Metadata } from "next";
import { HomeView, homeMetadata } from "@/views/HomeView";

// The homepage without 3D: the same page with a 2D hero. Canonical stays the homepage.
export const metadata: Metadata = { ...homeMetadata("sr"), robots: { index: false, follow: true } };

export default function Page() {
  return <HomeView locale="sr" hero="2d" />;
}
