import styles from "@/styles/Home.module.css";
import Header from "@/components/header";
import Welcome from "@/components/welcome/";
import SignUp from "@/components/signup/";
import { useEffect } from "react";
import { useRouter } from "next/router";
import { useState } from "react";

import { useAuth } from "@/hooks/AuthContext";

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push("/presentes");
    }
  }, [user, router]);
  const [step, setStep] = useState<"welcome" | "signup">("welcome");

  return (
    <>
      <div className={styles.main}>
        <Header />
        <div className={styles.container}>
          <div className={styles.stack}>
            {step === "welcome" && <Welcome />}
            {step === "signup" && <SignUp />}

            <button
              onClick={() =>
                setStep((prev) => (prev === "welcome" ? "signup" : "welcome"))
              }
              className={styles.button}
            >
              {step === "welcome" ? "Entrar" : "Voltar"}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
