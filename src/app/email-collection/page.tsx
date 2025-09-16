"use client";
import EmailCollection from "../../components/EmailCollection";
import { useRouter, useSearchParams } from "next/navigation";

export default function EmailCollectionPage() {
  const router = useRouter();
  const params = useSearchParams();
  const next = params.toString();
  return (
    <EmailCollection
      onSubmit={() => router.push(`/email-verification${next ? `?${next}` : ''}`)}
      onBack={() => router.push("/questionnaire")}
      onBackToHome={() => router.push("/")}
    />
  );
}




