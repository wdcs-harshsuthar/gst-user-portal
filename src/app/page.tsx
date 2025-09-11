"use client";
import { useRouter } from "next/navigation";
import LRAWebsiteClone from "../components/LRAWebsiteClone";

export default function Home() {
  const router = useRouter();

  return (
    <LRAWebsiteClone
      onGetStarted={() => router.push("/instructions")}
      onDirectRegistration={(formType) => router.push(`/user?formType=${formType}`)}
    />
  );
}
