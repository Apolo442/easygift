import styles from "./styles.module.css";
import Link from "next/link";
// React
import React from "react";
import { useState } from "react";
import { useRouter } from "next/router";
// Firebase
import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "@/services/firebase";
import { doc, setDoc } from "firebase/firestore";
//

function SignUp() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //const [admin, setAdmin] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // Registro no Auth
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });
      // Registro no Firestore
      await setDoc(doc(db, "users", cred.user.uid), {
        name,
        email,
        isAdmin: false,
        createdAt: new Date(),
      });

      router.push("/login");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSignup} className={styles.form}>
        <h1 className={styles.title}>Criar Conta</h1>

        {error && <p className={styles.error}>{error}</p>}

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
        <input
          type="password"
          placeholder="Sua senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" disabled={loading} className={styles.button}>
          {loading ? "Criando..." : "Cadastrar"}
        </button>

        <Link className={styles.button} href="/login">
          Já tem uma conta? Faça login
        </Link>
      </form>
    </div>
  );
}

export default SignUp;
