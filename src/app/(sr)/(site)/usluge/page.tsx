import { ServicesView, servicesMetadata } from "@/views/ServicesView";

export const metadata = servicesMetadata("sr");

export default function Page() {
  return <ServicesView locale="sr" />;
}
