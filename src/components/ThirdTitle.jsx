import styles from "./ThirdTitle.module.scss";
const ThirdTitle = ({ title }) => {
  return (
    <>
      <div className={styles.thirdTitle}>{title}</div>
    </>
  );
};
export default ThirdTitle;
