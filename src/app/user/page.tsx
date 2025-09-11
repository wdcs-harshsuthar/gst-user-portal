"use client";
import { useSearchParams, useRouter } from "next/navigation";
import UserApp from "../../UserApp";

export default function UserPage() {
  const params = useSearchParams();
  const router = useRouter();
  const formType = params.get("formType") as "IN-01" | "RF-01" | null;
  return (
    <UserApp 
      initialFormType={formType} 
      onBackToSelector={() => router.push("/")} 
      cleanMode={!!formType}
    />
  );
}



