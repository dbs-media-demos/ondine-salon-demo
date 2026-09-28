import { GiftCardsView, giftCardsMetadata } from "@/views/SimpleViews";

export const metadata = giftCardsMetadata("en");

export default function Page() {
  return <GiftCardsView locale="en" />;
}
