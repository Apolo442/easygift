import React from "react";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

import Link from "next/link";
import { useRouter } from "next/router";

import { signOut } from "firebase/auth";
import { useAuth } from "@/hooks/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "@/services/firebase";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Erro ao fazer logout", error);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  useEffect(() => {
    if (!user || loading) return;

    const fetchUserData = async () => {
      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        console.log("isAdmin?", data.isAdmin);
        setIsAdmin(data.isAdmin === true);
      } else {
        console.log("docSnap.exists() == False");
      }
    };

    fetchUserData();
  }, [user, loading]);

  return (
    <header
      className={`${styles.header} ${showNavbar ? styles.show : styles.hide}`}
    >
      <div className={styles.navContent}>
        <h1 className={styles.logo}>Easy Gift</h1>
        <nav className={styles.nav}>
          <Link className={styles.button} href="/presentes">
            Presentes
          </Link>
          <Link className={styles.button} href="/evento">
            Evento
          </Link>
          <Link className={styles.button} href="/confirmar">
            Confirmar Presença
          </Link>
          <Link className={styles.button} href="/galeria">
            Galeria
          </Link>
          {isAdmin === true && (
            <Link className={styles.button} href="/admin">
              Admin
            </Link>
          )}
          <button className={styles.button} onClick={handleLogout}>
            Sair
          </button>
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
