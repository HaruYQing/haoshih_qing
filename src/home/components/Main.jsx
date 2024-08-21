import React, { useState, useEffect } from "react";
import styles from "./Main.module.scss";

const Main = () => {
  const [text, setText] = useState("");
  const [isTyping, setIsTyping] = useState(true);
  const fullText = "在好事集\n 探索生活中的美好事物";

  useEffect(() => {
    let timer;
    let index = 0;

    const typeText = () => {
      if (index <= fullText.length) {
        setText(fullText.slice(0, index));
        index++;
        timer = setTimeout(typeText, 150);
      } else {
        setTimeout(() => {
          setText("");
          index = 0;
          timer = setTimeout(typeText, 500);
        }, 2000);
      }
    };

    if (isTyping) {
      typeText();
    }

    return () => clearTimeout(timer);
  }, [isTyping]);
  return (
    <>
      <div className="d-flex position-relative">
        <div className={styles.rectangle}>
          <div className={styles.rectangle1}></div>
          <div className={styles.rectangle2}> </div>
        </div>
        <div className="w-100">
          <div>
            <img
              className={`w-75 ${styles.mainImg}`}
              src="images/img/home.png"
              alt="homeImg"
            />
          </div>
          <div className="position-absolute top-25 end-0">
            <img
              className="w-100 object-fit-cover"
              src="images/img/sticker.png"
              alt="sticker"
            />
          </div>
        </div>
        <div className={styles.textContainer}>
          <h1 className={`font-special fs-larger ${styles.typewriter}`}>
            {text.split("\n").map((line, index) => (
              <span key={index} className={index === 1 ? styles.indent : ""}>
                {line}
              </span>
            ))}
          </h1>
        </div>
      </div>
    </>
  );
};
export default Main;
