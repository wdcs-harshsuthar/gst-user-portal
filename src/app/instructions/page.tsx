"use client";
import PortalInstructions from "../../components/PortalInstructions";
import { useRouter } from "next/navigation";

export default function InstructionsPage() {
  const router = useRouter();
  return (
    <PortalInstructions
      onConfirm={() => router.push("/email-collection")}
      onBack={() => router.push("/")}
      onStartQuestionnaire={() => router.push("/questionnaire")}
    />
  );
}




