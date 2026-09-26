import { Suspense } from "react";

import { PaymentSuccessPage } from "@/src/features/recruiter-billing";

export default function Page() {
  return (
    <Suspense>
      <PaymentSuccessPage />
    </Suspense>
  );
}
