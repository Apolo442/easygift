import React from "react";
import styles from "./styles.module.css";
import { useEffect, useState } from "react";

import Link from "next/link";

import { useAuth } from "@/hooks/AuthContext";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/services/firebase";

function Navbar() {
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user } = useAuth();

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
    const checkAdmin = async () => {
      if (user) {
        const ref = doc(db, "users", user.uid);
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setIsAdmin(snap.data().admin === true);
        }
      }
    };

    checkAdmin();
  }, [user]);

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
          {isAdmin && (
            <Link className={styles.button} href="/admin">
              Admin
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar;
