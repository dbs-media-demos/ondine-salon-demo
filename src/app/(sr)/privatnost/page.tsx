import { PrivacyView, privacyMetadata } from "@/views/SimpleViews";

export const metadata = privacyMetadata("sr");

export default function Page() {
  return <PrivacyView locale="sr" />;
}
