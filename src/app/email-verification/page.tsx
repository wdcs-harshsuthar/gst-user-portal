"use client";
import EmailVerification from "../../components/EmailVerification";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = "";
  const next = params.toString();
  return (
    <EmailVerification
      email={email}
      onVerified={() => router.push(`/user${next ? `?${next}` : ''}`)}
      onBack={() => router.push(`/email-collection${next ? `?${next}` : ''}`)}
      onResendEmail={() => {}}
      onBackToHome={() => router.push("/")}
    />
  );
}




