"use client";
import RegistrationQuestionnaire from "../../components/RegistrationQuestionnaire";
import { useRouter } from "next/navigation";

export default function QuestionnairePage() {
  const router = useRouter();
  return (
    <RegistrationQuestionnaire
      onBack={() => router.push("/instructions")}
      onComplete={() => router.push("/email-collection")}
    />
  );
}




