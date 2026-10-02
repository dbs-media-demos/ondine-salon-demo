import { BookingView, bookingMetadata } from "@/views/SimpleViews";

export const metadata = bookingMetadata("en");

export default function Page() {
  return <BookingView locale="en" />;
}
