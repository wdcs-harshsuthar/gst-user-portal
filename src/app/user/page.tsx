"use client";
import { useSearchParams, useRouter } from "next/navigation";
import UserApp from "../../components/UserApp";

export default function UserPage() {
  const params = useSearchParams();
  const router = useRouter();
  const formType = params.get("formType") as "IN-01" | "RF-01" | null;
  const userType = params.get("userType") as
    | "SP-01"
    | "RF-01"
    | "IN-01"
    | "RP-01"
    | null;
  
  // Derive initialRoute/form type from legacy userType param
  const derived: { initialRoute: 'sole-proprietorship' | 'partnership-corporation' | 'property-only' | null; formType: 'IN-01' | 'RF-01' | null } = (() => {
    if (userType === "SP-01") {
      return { initialRoute: "sole-proprietorship", formType: null };
    }
    if (userType === "RF-01") {
      return { initialRoute: "partnership-corporation", formType: null };
    }
    if (userType === "IN-01") {
      return { initialRoute: null, formType: "IN-01" };
    }
    if (userType === "RP-01") {
      return { initialRoute: "property-only", formType: null };
    }
    return { initialRoute: null, formType };
  })();
  return (
    <UserApp
      initialFormType={derived.formType}
      initialRoute={derived.initialRoute}
      questionnaireResult={undefined}
      onBackToSelector={() => router.push("/")}
      cleanMode={!!(derived.formType || derived.initialRoute)}
    />
  );
}



