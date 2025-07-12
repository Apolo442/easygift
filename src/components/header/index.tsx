import React from "react";
import styles from "./styles.module.css";

function Header() {
  return (
    <div className={styles.main}>
      <div className={styles.header}>
        <section className={styles.content}>
          <h1 className={styles.logo}>Easy Gift</h1>
          <nav className={styles.nav}></nav>
        </section>
      </div>
    </div>
  );
}

export default Header;
