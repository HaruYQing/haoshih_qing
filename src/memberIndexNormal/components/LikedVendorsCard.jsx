import styles from "./LikedVendorsCard.module.scss";

const LikedVendorsCard = (props) => {
  const { data, linkTo } = props;
  return (
    <>
      <div
        className="col-4 cursor-pointer"
        onClick={() => {
          linkTo(data.vinfo);
        }}
      >
        <div className={`card p-3 mx-2  my-3 ${styles.cardBg}`}>
          <img
            className={styles.cardImg}
            src={"data:image/jpeg;base64," + data.brand_img01}
            alt=""
          />
          <div className="card-body">
            <h4 className="card-title">{data.brand_name}</h4>
            <p className={`card-text ${styles.cardText}`}>{data.content}</p>
            <div className={styles.cardTag}>#{data.tag1 || "美好市集"}</div>
            <div className={styles.cardTag}>#{data.tag2 || "美好市集"}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default LikedVendorsCard;
