"use client";
import EmailCollection from "../../components/EmailCollection";
import { useRouter } from "next/navigation";

export default function EmailCollectionPage() {
  const router = useRouter();
  return (
    <EmailCollection
      onSubmit={() => router.push("/email-verification")}
      onBack={() => router.push("/questionnaire")}
      onBackToHome={() => router.push("/")}
    />
  );
}




