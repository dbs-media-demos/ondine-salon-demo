import { LookbookView, lookbookMetadata } from "@/views/LookbookView";

export const metadata = lookbookMetadata("sr");

export default function Page() {
  return <LookbookView locale="sr" />;
}
