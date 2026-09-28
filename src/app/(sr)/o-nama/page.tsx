import { AboutView, aboutMetadata } from "@/views/AboutView";

export const metadata = aboutMetadata("sr");

export default function Page() {
  return <AboutView locale="sr" />;
}
