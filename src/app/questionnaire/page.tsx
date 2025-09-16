"use client";
import RegistrationQuestionnaire from "../../components/RegistrationQuestionnaire";
import { useRouter } from "next/navigation";

export default function QuestionnairePage() {
  const router = useRouter();
  return (
    <RegistrationQuestionnaire
      onBack={() => router.push("/instructions")}
      onComplete={(result) => {
        // Persist intended route so we can resume after verification
        const params = new URLSearchParams();
        if (result.route === 'sole-proprietorship') params.set('userType', 'SP-01');
        else if (result.route === 'partnership-corporation') params.set('userType', 'RF-01');
        else if (result.route === 'property-only') params.set('userType', 'RP-01');
        const next = params.toString();
        router.push(`/email-collection${next ? `?${next}` : ''}`);
      }}
    />
  );
}




