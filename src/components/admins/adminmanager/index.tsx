import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

// Firebase
import { db } from "@/services/firebase";
import {
  doc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  updateDoc,
} from "firebase/firestore";

type User = {
  id: string;
  name: string;
  email: string;
  isAdmin: boolean;
  createdAt?: Date;
};

function AdminManager() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<"all" | "admins" | "nonAdmins">("all");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const handleEditClick = (user: User) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setIsAdmin(user.isAdmin);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser) return;

    try {
      const userRef = doc(db, "users", selectedUser.id);
      await updateDoc(userRef, { name, isAdmin });

      setUsers((prev) =>
        prev.map((item) =>
          item.id === selectedUser.id ? { ...item, name, isAdmin } : item
        )
      );
      resetForm();
    } catch (error) {
      console.log("Erro ao atualizar o item", error);
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setIsAdmin(false);
    setSelectedUser(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Adicione ou Remova usuários</h1>
      <div className={styles.container}>
        <div className={styles.createBox}>
          <h1 className={styles.subtitle}>Editar usuário</h1>

          {!selectedUser ? (
            <p className={styles.subtitle}>Selecione um usuário para editar</p>
          ) : (
            <form onSubmit={handleSaveEdit} className={styles.form}>
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
                className={styles.input}
                disabled
              />
              <select
                value={isAdmin ? "true" : "false"}
                onChange={(e) => setIsAdmin(e.target.value === "true")}
                className={styles.input}
                required
              >
                <option value="false">Usuário comum</option>
                <option value="true">Administrador</option>
              </select>

              <button
                type="submit"
                disabled={loading}
                className={styles.button}
              >
                {loading ? "Salvando..." : "Salvar edição"}
              </button>
            </form>
          )}
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
                      <div onClick={() => handleEditClick(user)}>
                        <span>{user.name}</span>
                        <span>({user.email})</span>
                      </div>
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
