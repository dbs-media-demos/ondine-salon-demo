import { GiftCardsView, giftCardsMetadata } from "@/views/SimpleViews";

export const metadata = giftCardsMetadata("sr");

export default function Page() {
  return <GiftCardsView locale="sr" />;
}
