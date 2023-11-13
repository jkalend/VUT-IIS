"use client";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

function ProtectedPage() {
  const router = useRouter();
  const { data: session } = useSession()
  return (
      <>
    <div className={"flex relative"}>
      Logged in {session ? "true":"false"}
    </div><br/>
      </>
  );
}

export default ProtectedPage;
