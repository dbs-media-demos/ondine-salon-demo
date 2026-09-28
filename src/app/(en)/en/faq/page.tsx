import { FaqView, faqMetadata } from "@/views/SimpleViews";

export const metadata = faqMetadata("en");

export default function Page() {
  return <FaqView locale="en" />;
}
