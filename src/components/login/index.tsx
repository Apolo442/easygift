import styles from "./styles.module.css";
import Link from "next/link";
// React
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
// Firebase
import { auth } from "@/services/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
//

function SignUp() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //const [admin, setAdmin] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Faz login com Firebase
      await signInWithEmailAndPassword(auth, email, password);

      router.push("/presentes");
    } catch (err) {
      if (err instanceof Error) {
        setError("Email ou Senha inválidos.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleLogin} className={styles.form}>
        <h1 className={styles.title}>Criar Conta</h1>

        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Seu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Entrando..." : "Entrar"}
        </button>

        <Link className={styles.button} href="/">
          Não tem uma conta? Crie uma!
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
