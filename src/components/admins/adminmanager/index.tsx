import React, { use } from "react";
import styles from "./styles.module.css";
import { useState } from "react";

// Firebase
import { auth } from "@/services/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { db } from "@/services/firebase";
import { doc, setDoc, deleteDoc } from "firebase/firestore";
import { useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";

function AdminManager() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  //
  type User = {
    id: string;
    name: string;
    email: string;
    isAdmin: boolean;
    createdAt?: Date;
  };

  const [users, setUsers] = useState<User[]>([]);
  const [filter, setFilter] = useState<"all" | "admins" | "nonAdmins">("all");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  //

  const handleDelete = async (userId: string) => {
    const confirm = window.confirm("Deseja mesmo remover o usuário?");
    if (!confirm) return;

    try {
      await deleteDoc(doc(db, "users", userId));
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } catch (error) {
      console.error("Erro ao apagar usuário:", error);
    }
  };

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
        isAdmin: true,
        createdAt: new Date(),
      });
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchUsers = async () => {
      setLoadingUsers(true);
      let q;
      if (filter === "admins") {
        q = query(collection(db, "users"), where("isAdmin", "==", true));
      } else if (filter === "nonAdmins") {
        q = query(collection(db, "users"), where("isAdmin", "==", false));
      } else {
        q = collection(db, "users");
      }
      const snapshot = await getDocs(q);
      const userList = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.name ?? "",
          email: data.email ?? "",
          isAdmin: data.isAdmin ?? false,
          createdAt: data.createdAt
            ? data.createdAt instanceof Date
              ? data.createdAt
              : new Date(data.createdAt)
            : undefined,
        };
      });
      setUsers(userList);
      setLoadingUsers(false);
    };
    fetchUsers();
  }, [filter]);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Adicione ou Remova usuários</h1>
      <div className={styles.container}>
        <div className={styles.createBox}>
          <h1 className={styles.subtitle}>Criar usuário</h1>
          <form onSubmit={handleSignup} className={styles.form}>
            <h1 className={styles.title}>Criar Conta</h1>

            {error && <p className={styles.error}>{error}</p>}

            <input
              type="text"
              placeholder="Nome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={styles.input}
              required
            />

            <button type="submit" disabled={loading} className={styles.button}>
              {loading ? "Criando..." : "Cadastrar"}
            </button>
          </form>
        </div>
        <div className={styles.deleteBox}>
          <h1 className={styles.subtitle}>Apagar usuário</h1>

          <div className={styles.controls}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as typeof filter)}
              className={styles.select}
            >
              <option value="all">Todos</option>
              <option value="admins">Admins</option>
              <option value="nonAdmins">Não Admins</option>
            </select>

            <input
              type="text"
              placeholder="Buscar por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.search}
            />
          </div>

          {loadingUsers ? (
            <p>Carregando usuários...</p>
          ) : (
            <div className={styles.userListWrapper}>
              <ul className={styles.userList}>
                {users
                  .filter((user) => {
                    if (filter === "admins") return user.isAdmin;
                    if (filter === "nonAdmins") return !user.isAdmin;
                    return true;
                  })
                  .filter((user) =>
                    user.name.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((user) => (
                    <li key={user.id} className={styles.userItem}>
                      <span>{user.name}</span>
                      <span>({user.email})</span>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDelete(user.id)}
                      >
                        DEL
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminManager;
