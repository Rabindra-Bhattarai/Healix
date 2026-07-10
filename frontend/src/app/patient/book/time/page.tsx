import { Suspense } from "react";
import BookingTimeView from "@/app/patient/book/time/_components/BookingTimeView";

export default function BookingTimePage() {
  return (
    <Suspense fallback={null}>
      <BookingTimeView />
    </Suspense>
  );
}
