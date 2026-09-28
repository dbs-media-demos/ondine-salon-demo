import { PricesView, pricesMetadata } from "@/views/PricesView";

export const metadata = pricesMetadata("sr");

export default function Page() {
  return <PricesView locale="sr" />;
}
