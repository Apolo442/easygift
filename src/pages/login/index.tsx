import React, { useEffect } from "react";
import styles from "./styles.module.css";
import Header from "@/components/header";
import Login from "@/components/login";
import { useRouter } from "next/router";
import { useAuth } from "@/hooks/AuthContext";

function LoginPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/presentes");
    }
  }, [user, router]);

  if (user) return null;

  return (
    <div className={styles.main}>
      <Header />
      <Login />
    </div>
  );
}

export default LoginPage;
