import { ReviewsView, reviewsMetadata } from "@/views/SimpleViews";

export const metadata = reviewsMetadata("en");

export default function Page() {
  return <ReviewsView locale="en" />;
}
