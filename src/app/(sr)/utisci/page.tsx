import { ReviewsView, reviewsMetadata } from "@/views/SimpleViews";

export const metadata = reviewsMetadata("sr");

export default function Page() {
  return <ReviewsView locale="sr" />;
}
