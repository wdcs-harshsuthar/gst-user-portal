"use client";
import EmailVerification from "../../components/EmailVerification";
import { useRouter } from "next/navigation";

export default function EmailVerificationPage() {
  const router = useRouter();
  const email = "";
  return (
    <EmailVerification
      email={email}
      onVerified={() => router.push("/user?formType=IN-01")}
      onBack={() => router.push("/email-collection")}
      onResendEmail={() => {}}
      onBackToHome={() => router.push("/")}
    />
  );
}




