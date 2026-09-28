import { BookingView, bookingMetadata } from "@/views/SimpleViews";

export const metadata = bookingMetadata("sr");

export default function Page() {
  return <BookingView locale="sr" />;
}
