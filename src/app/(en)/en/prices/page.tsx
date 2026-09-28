import { PricesView, pricesMetadata } from "@/views/PricesView";

export const metadata = pricesMetadata("en");

export default function Page() {
  return <PricesView locale="en" />;
}
