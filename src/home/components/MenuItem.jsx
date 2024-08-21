import { useState } from "react";
import styles from "./MenuItem.module.scss";
import { openLink } from "../../utils/link.js";

const MenuItem = ({ item, id }) => {
  const { img, title, link, description } = item;
  const [isHovered, setIsHovered] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const redir = () => {
    alert("請先登入攤主帳號");
    openLink("/login");
  }
  return (
    <div
      className={`d-flex flex-column align-items-center col-4 m-5 py-3 rounded-4 ${styles.menuItems} ${isHovered ? styles.hovered : styles.default}`}
      onClick={() => {
        if(id !== 4) {
          openLink(link);
        }else {
          user ? (user.vid ? openLink(link) : 
          redir()):openLink("/login")
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {!isHovered ? (
        <>
          <img className="w-50" src={img} alt={title} />
          <h1 className="pt-4 text-white fs-medium font-special">{title}</h1>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-white fs-medium font-special">{title}</h2>
          <p className="text-white fs-5">{description}</p>
        </div>
      )}
    </div>
  );
};

export default MenuItem;
