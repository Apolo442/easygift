import React, { useEffect, useState } from "react";
import styles from "./styles.module.css";

import { db } from "@/services/firebase";
import {
  doc,
  setDoc,
  deleteDoc,
  updateDoc,
  collection,
  getDocs,
} from "firebase/firestore";

type Gift = {
  id: string;
  title: string;
  desc?: string;
  category?: string;
  quantity?: number;
  createdAt?: Date;
};

const categorias = [
  { label: "Cozinha", value: "cozinha" },
  { label: "Eletrodomésticos", value: "eletrodomesticos" },
  { label: "Banheiro", value: "banheiro" },
  { label: "Quarto", value: "quarto" },
  { label: "Sala", value: "sala" },
  { label: "Lavanderia", value: "lavanderia" },
  { label: "Organização", value: "organizacao" },
  { label: "Decoração", value: "decoracao" },
  { label: "Outros", value: "outros" },
  { label: "Utensílios em geral", value: "utensilios" },
  { label: "Limpeza", value: "limpeza" },
];

function Catalog() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState<number>(1);

  const [items, setItems] = useState<Gift[]>([]);
  const [selectedGift, setSelectedGift] = useState<Gift | null>(null);

  const [loading, setLoading] = useState(false);
  const [loadingItems, setLoadingItems] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("");

  const isEditing = selectedGift !== null;

  useEffect(() => {
    fetchItems();
  }, []);

  const resetForm = () => {
    setTitle("");
    setDesc("");
    setCategory("");
    setQuantity(1);
    setSelectedGift(null);
  };

  const fetchItems = async () => {
    setLoadingItems(true);
    try {
      const snapshot = await getDocs(collection(db, "gifts"));
      const itemsList: Gift[] = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          title: data.title ?? "",
          desc: data.desc ?? "",
          category: data.category ?? "",
          quantity: data.quantity ?? 0,
          createdAt: data.createdAt ? new Date(data.createdAt) : undefined,
        };
      });
      setItems(itemsList);
    } catch (err) {
      console.error("Erro ao buscar itens:", err);
    } finally {
      setLoadingItems(false);
    }
  };

  const handleCreateGift = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const newGift = {
        title,
        desc,
        category,
        quantity,
        createdAt: new Date(),
      };

      const docRef = doc(collection(db, "gifts"));
      await setDoc(docRef, newGift);
      fetchItems();
      resetForm();
    } catch (err) {
      if (err instanceof Error) console.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (item: Gift) => {
    setSelectedGift(item);
    setTitle(item.title);
    setDesc(item.desc ?? "");
    setCategory(item.category ?? "");
    setQuantity(item.quantity ?? 1);
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedGift) return;

    try {
      const giftRef = doc(db, "gifts", selectedGift.id);
      await updateDoc(giftRef, { title, desc, category, quantity });

      setItems((prev) =>
        prev.map((item) =>
          item.id === selectedGift.id
            ? { ...item, title, desc, category, quantity }
            : item
        )
      );
      resetForm();
    } catch (error) {
      console.error("Erro ao atualizar item", error);
    }
  };

  const handleDeleteGift = async (itemId: string) => {
    if (!window.confirm("Deseja mesmo remover o item?")) return;

    try {
      await deleteDoc(doc(db, "gifts", itemId));
      setItems((prev) => prev.filter((item) => item.id !== itemId));
    } catch (error) {
      console.error("Erro ao apagar item", error);
    }
  };

  return (
    <div className={styles.main}>
      <h1 className={styles.title}>Gerencie seu Catálogo</h1>
      <div className={styles.container}>
        <section className={styles.createBox}>
          <h2 className={styles.subtitle}>
            {isEditing ? "Editar Item" : "Adicionar Item"}
          </h2>
          <form
            onSubmit={isEditing ? handleSaveEdit : handleCreateGift}
            className={styles.form}
          >
            <input
              type="text"
              placeholder="Título"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="text"
              placeholder="Descrição"
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className={styles.input}
              required
            />
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className={styles.input}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Quantidade desejada"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.input}
              min={1}
              required
            />
            <button type="submit" disabled={loading} className={styles.button}>
              {loading
                ? isEditing
                  ? "Salvando..."
                  : "Criando..."
                : isEditing
                ? "Salvar Edição"
                : "Cadastrar"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className={styles.button}
              >
                Voltar
              </button>
            )}
          </form>
        </section>

        <section className={styles.deleteBox}>
          <h2 className={styles.subtitle}>Filtrar Itens</h2>
          <div className={styles.controls}>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={styles.select}
            >
              <option value="">Todas as categorias</option>
              {categorias.map((cat) => (
                <option key={cat.value} value={cat.value}>
                  {cat.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Buscar por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.search}
            />
          </div>

          {loadingItems ? (
            <p>Carregando itens...</p>
          ) : (
            <div className={styles.itemListWrapper}>
              <ul className={styles.itemList}>
                {items
                  .filter(
                    (item) =>
                      item.title
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase()) &&
                      (filter === "" || item.category === filter)
                  )
                  .sort((a, b) => a.title.localeCompare(b.title))
                  .map((gift) => (
                    <li key={gift.id} className={styles.giftItem}>
                      <div onClick={() => handleEditClick(gift)}>
                        <span>{gift.title}</span>
                        <span>({gift.quantity})</span>
                      </div>
                      <button
                        className={styles.deleteButton}
                        onClick={() => handleDeleteGift(gift.id)}
                      >
                        DEL
                      </button>
                    </li>
                  ))}
              </ul>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default Catalog;
