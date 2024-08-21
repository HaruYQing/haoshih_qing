import styles from "./InfoCard.module.scss";

const InfoCard = () => {
  return (
    <>
      <div className={`mb-5 ${styles.cardSize}`}>
        <div
          className={`col-4  overflow-hidden w-100 rounded-4 border border-secondary-subtle bg-white  ${styles.cardStyle}`}
        >
          <div className={styles.infoImg}>
            <img src="images/img/news.png" alt="infoImg" />
          </div>
          <div>
            <div className="position-relative">
              <div>
                <div className={` bg-secondary ${styles.date}`}>
                  <div className="fs-1">08</div>
                  <div className="fs-6">/</div>
                  <div className="fs-3">16</div>
                </div>
              </div>
              <div className="px-4 pb-2 d-flex flex-column justify-content-between">
                <h3 className="text-end pb-4">第4季攤位招租</h3>
                <p className={styles.infoText}>
                  攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊,攤位招租詳細資訊
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoCard;
