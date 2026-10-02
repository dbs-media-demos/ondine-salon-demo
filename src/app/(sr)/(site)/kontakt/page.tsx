import { ContactView, contactMetadata } from "@/views/SimpleViews";

export const metadata = contactMetadata("sr");

export default function Page() {
  return <ContactView locale="sr" />;
}
