"use client";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

function ProtectedPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState (false);
  useEffect(() => {
    const token = Cookies.get("token");

    if (!token) {
      // router.replace("/"); // If no token is found, redirect to login page
      // return;
    }

    // Validate the token by making an API call
    const validateToken = async () => {
      try {
        const res = await fetch("/api/profile/validateToken", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Token validation failed");
        setLoggedIn (true);
      } catch (error) {
        console.error(error);
        //router.replace("/profile/login"); // Redirect to login if token validation fails
      }
    };

    validateToken();
  }, [router]);

  return (
      <>
    <div className={"flex relative"}>
      Logged in {loggedIn ? "true":"false"}
    </div><br/>
      </>
  );
}

export default ProtectedPage;
