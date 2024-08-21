import styles from "./MainBg.module.scss";

const MainBg = ({ title, page }) => {
  return (
    <>
      <div className="position-relative">
        <div className={`${styles.mainBg} ${styles[`${page}BgUrl`]}`}>
          <div
            className={`fs-larger bg-blueGray c-white opacity-75 font-special ${styles.mainText} `}
          >
            {title}
          </div>
        </div>
      </div>
    </>
  );
};
export default MainBg;
