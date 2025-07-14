import React from "react";
import styles from "./styles.module.css";
import { useState } from "react";
import Catalog from "@/components/admins/catalog";
import Event from "@/components/admins/evento";
import AdminManager from "@/components/admins/adminmanager";
import Gallery from "@/components/admins/gallery";
import Introducao from "@/components/admins/introducao";

function Adminbar() {
  const [step, setStep] = useState<
    "catalog" | "event" | "admins" | "gallery" | "intro"
  >("intro");

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Gerenciar plataforma</h1>
      <div className={styles.bar}>
        <button onClick={() => setStep("catalog")} className={styles.button}>
          Itens ao catálogo
        </button>
        <button onClick={() => setStep("event")} className={styles.button}>
          Informações do evento
        </button>
        <button onClick={() => setStep("admins")} className={styles.button}>
          Administradores da plataforma
        </button>
        <button onClick={() => setStep("gallery")} className={styles.button}>
          Galeria do evento
        </button>
      </div>
      <div className={styles.container}>
        <div className={styles.board}>
          {step === "intro" && <Introducao />}
          {step === "catalog" && <Catalog />}
          {step === "event" && <Event />}
          {step === "admins" && <AdminManager />}
          {step === "gallery" && <Gallery />}
        </div>
      </div>
    </div>
  );
}

export default Adminbar;
