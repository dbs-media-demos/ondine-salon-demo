import { FaqView, faqMetadata } from "@/views/SimpleViews";

export const metadata = faqMetadata("sr");

export default function Page() {
  return <FaqView locale="sr" />;
}
