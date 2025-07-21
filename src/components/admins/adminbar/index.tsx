import React from "react";
import styles from "./styles.module.css";
import { useState } from "react";
import Catalog from "@/components/admins/catalog";
import AdminManager from "@/components/admins/adminmanager";
import Introducao from "@/components/admins/intro";

function Adminbar() {
  const [step, setStep] = useState<"catalog" | "admins" | "intro">("intro");

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Gerenciar plataforma</h1>
      <div className={styles.bar}>
        <button onClick={() => setStep("catalog")} className={styles.button}>
          Itens do catálogo
        </button>

        <button onClick={() => setStep("admins")} className={styles.button}>
          Administradores da plataforma
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.board}>
          {step === "intro" && <Introducao />}
          {step === "catalog" && <Catalog />}

          {step === "admins" && <AdminManager />}
        </div>
      </div>
    </div>
  );
}

export default Adminbar;
