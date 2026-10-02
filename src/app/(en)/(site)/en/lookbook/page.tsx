import { LookbookView, lookbookMetadata } from "@/views/LookbookView";

export const metadata = lookbookMetadata("en");

export default function Page() {
  return <LookbookView locale="en" />;
}
