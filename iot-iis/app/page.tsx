"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ProtectedPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState (false);

  return (
      <>
    <div className={"flex relative"}>
      Logged in {loggedIn ? "true":"false"}
    </div><br/>
      </>
  );
}

export default ProtectedPage;
