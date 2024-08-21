import styles from "./ProductCard.module.scss";
// import { useNavigate } from "react-router-dom";
import "bootstrap-icons/font/bootstrap-icons.css";

const ProductCard = (props) => {
  const { data, linkTo } = props;

  return (
    <div className={styles.productCard}>
      <div className={data.is_show ? styles.cardHead1 : styles.cardHead0}>
        <span className={data.is_show ? "c-black fw-bold" : "c-white fw-bold"}>
          {data.name}
        </span>
        <span className={data.is_show ? "c-black fw-bold" : "c-white fw-bold"}>
          {data.is_show ? "已上架" : "未上架"}
        </span>
      </div>
      <div className={styles.cardBody}>
        <img
          className={styles.cardBodyImg}
          src={data.img01}
          alt="product image"
        />
        <div className={styles.hoverCover}>
          <div
            className={styles.productBtn}
            onClick={() => {
              linkTo(data.vid, data.pid);
            }}
          >
            <i className="bi bi-pencil"></i>
          </div>
          <div className={styles.productBtn}>
            <i className="bi bi-trash3"></i>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
