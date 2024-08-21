import styles from "./AllVendorsCard.module.scss";
import { Buffer } from "buffer";
const AllVendorsCard = ({ data , linkTo}) => {
  var imgBlob = Buffer.from(data.brand_img01).toString('base64')
  return (
    <>
      <div className="col-3" onClick={()=>{linkTo(data.vinfo)}}>
        <div className={`card p-3 mx-2  my-3 ${styles.cardBg} cursor-pointer`}>
          <img
            className={styles.cardImg}
            src={"data:image/jpeg;base64,"+imgBlob}
            alt=""
          />
          <div className="card-body">
            <h4 className="card-title">{data.brand_name}</h4>
            <p className={`card-text ${styles.cardText}`}>
              {data.content}
            </p>
            <div className={styles.cardTag}>#{data.tag1||"美好市集"}</div>
            <div className={styles.cardTag}>#{data.tag2||"美好市集"}</div>
          </div>
        </div>
      </div>
    </>
  );
};
export default AllVendorsCard;
