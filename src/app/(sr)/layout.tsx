import "../globals.css";
import { RootDocument } from "@/components/layout/RootDocument";
import { rootMetadata, rootViewport } from "@/lib/layout-meta";

export const metadata = rootMetadata("sr");
export const viewport = rootViewport;

export default function Layout({ children }: { children: React.ReactNode }) {
  return <RootDocument locale="sr">{children}</RootDocument>;
}
