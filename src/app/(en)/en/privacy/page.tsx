import { PrivacyView, privacyMetadata } from "@/views/SimpleViews";

export const metadata = privacyMetadata("en");

export default function Page() {
  return <PrivacyView locale="en" />;
}
