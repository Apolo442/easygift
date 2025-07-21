import styles from "./styles.module.css";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { auth, db } from "@/services/firebase";
//import { useAuth } from "@/hooks/AuthContext";
import {
  sendSignInLinkToEmail,
  isSignInWithEmailLink,
  signInWithEmailLink,
} from "firebase/auth";
import {
  collection,
  doc,
  getDoc,
  setDoc,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const actionCodeSettings = {
  url: "http://localhost:3000/login",
  handleCodeInApp: true,
};

function LoginWithEmailLink() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  //const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    const completeSignIn = async () => {
      if (
        typeof window !== "undefined" &&
        isSignInWithEmailLink(auth, window.location.href)
      ) {
        let storedEmail = window.localStorage.getItem("emailForSignIn");
        if (!storedEmail) {
          storedEmail = window.prompt("Confirme seu e-mail:");
        }
        if (!storedEmail) return;

        setIsLoading(true);
        try {
          const result = await signInWithEmailLink(
            auth,
            storedEmail,
            window.location.href
          );
          const user = result.user;

          const docRef = doc(db, "users", user.uid);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            const storedName =
              window.localStorage.getItem("nameForSignUp") || "";
            await setDoc(docRef, {
              email: user.email,
              name: storedName,
              isAdmin: false,
              createdAt: new Date(),
            });
            window.localStorage.removeItem("nameForSignUp");
          }

          window.localStorage.removeItem("emailForSignIn");
          router.push("/presentes");
        } catch (err: unknown) {
          if (err instanceof Error) {
            setError(err.message);
          } else {
            setError("Erro desconhecido ao fazer login.");
          }
        } finally {
          setIsLoading(false);
        }
      }
    };

    completeSignIn();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setIsLoading(true);

    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const snapshot = await getDocs(q);

      if (snapshot.empty) {
        setError("Este e-mail não está cadastrado.");
        setIsLoading(false);
        return;
      }

      await sendSignInLinkToEmail(auth, email, actionCodeSettings);
      window.localStorage.setItem("emailForSignIn", email);
      setMessage("Link enviado! Verifique o seu e-mail.");
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Erro desconhecido ao tentar realizar login.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit} className={styles.form}>
        <h1 className={styles.title}>Login com Link Mágico</h1>

        {message && <p className={styles.success}>{message}</p>}
        {error && <p className={styles.error}>{error}</p>}

        <input
          type="email"
          placeholder="Seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={styles.input}
          required
        />

        <button type="submit" className={styles.button} disabled={isLoading}>
          {isLoading ? "Enviando..." : "Enviar link mágico"}
        </button>
        <Link className={styles.button} href="/">
          Voltar
        </Link>
      </form>
    </div>
  );
}

export default LoginWithEmailLink;
