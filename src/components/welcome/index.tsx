import React from "react";
import styles from "./styles.module.css";
import Image from "next/image";

import WelcomeImg from "../../../public/assets/welcome.png";

function WelcomeBox() {
  return (
    <div className={styles.welcomeContainer}>
      <div className={styles.box}>
        <h1 className={styles.title}>Olá</h1>
        <Image
          className={styles.image}
          src={WelcomeImg}
          alt="Imagem de presente"
          priority
        />
        <p className={styles.description}>
          Lorem ipsum, dolor sit amet consectetur adipisicing elit. Et,
          accusantium natus libero.
        </p>
      </div>
    </div>
  );
}

export default WelcomeBox;
