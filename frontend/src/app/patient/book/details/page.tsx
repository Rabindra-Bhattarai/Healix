import { Suspense } from "react";
import BookingDetailsView from "@/app/patient/book/details/_components/BookingDetailsView";

export default function BookingDetailsPage() {
  return (
    <Suspense fallback={null}>
      <BookingDetailsView />
    </Suspense>
  );
}
