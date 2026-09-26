import { PaymentDetailPage } from "@/src/features/recruiter-billing/components/payment-detail-page";

export default async function Page({
  params,
}: {
  params: Promise<{ paymentId: string }>;
}) {
  const { paymentId } = await params;

  return <PaymentDetailPage paymentId={paymentId} />;
}
