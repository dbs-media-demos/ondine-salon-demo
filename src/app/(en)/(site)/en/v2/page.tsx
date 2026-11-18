import type { Metadata } from "next";
import { HomeView, homeMetadata } from "@/views/HomeView";

// The homepage without 3D: the same page with a 2D hero. Canonical stays the homepage.
export const metadata: Metadata = { ...homeMetadata("en"), robots: { index: false, follow: true } };

export default function Page() {
  return <HomeView locale="en" hero="2d" />;
}
