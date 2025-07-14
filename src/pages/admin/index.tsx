import { useAuth } from "@/hooks/AuthContext";
import styles from "./styles.module.css";
import { db } from "@/services/firebase";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import Adminbar from "@/components/admins/adminbar";

export default function AdminPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null); // null = carregando

  useEffect(() => {
    const checkAdmin = async () => {
      if (loading) return;

      if (!user) {
        router.push("/presentes");
        return;
      }

      const docRef = doc(db, "users", user.uid);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists() && docSnap.data().isAdmin === true) {
        setIsAdmin(true);
      } else {
        router.push("/presentes");
      }
    };

    checkAdmin();
  }, [user, loading, router]);

  if (isAdmin === null) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p className={styles.loadingText}>Carregando...</p>
      </div>
    );
  }

  return (
    <>
      <div className={styles.main}>
        <Navbar />
        <div className={styles.container}>
          <Adminbar />
        </div>
      </div>
    </>
  );
}
