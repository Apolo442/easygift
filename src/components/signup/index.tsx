import styles from "./styles.module.css";
import Link from "next/link";
import React, { useState } from "react";
// import { useRouter } from "next/router";
import { sendSignInLinkToEmail } from "firebase/auth";
import { auth } from "@/services/firebase";

function SignUp() {
  // const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const actionCodeSettings = {
      url: `${window.location.origin}/login`,
      handleCodeInApp: true,
    };

    try {
      await sendSignInLinkToEmail(auth, email, actionCodeSettings);

      localStorage.setItem("emailForSignIn", email);
      localStorage.setItem("nameForSignUp", name);

      setSuccess(true);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro ao enviar o link.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignUp} className={styles.form}>
        <h1 className={styles.title}>Criar Conta</h1>

        {error && <p className={styles.error}>{error}</p>}
        {success ? (
          <p className={styles.success}>
            Link de acesso enviado para <strong>{email}</strong>. Verifique seu
            e-mail!
          </p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Seu nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Seu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Enviando..." : "Cadastrar"}
            </button>
            <h1 className={styles.title}>Já tenho uma conta</h1>
            <Link className={styles.button} href="/login">
              Já tem uma conta? Faça login
            </Link>
          </>
        )}
      </form>
    </div>
  );
}

export default SignUp;
