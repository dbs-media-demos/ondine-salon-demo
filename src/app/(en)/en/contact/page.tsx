import { ContactView, contactMetadata } from "@/views/SimpleViews";

export const metadata = contactMetadata("en");

export default function Page() {
  return <ContactView locale="en" />;
}
