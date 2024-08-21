import styles from "./SubTitleOrange.module.scss";
const SubTitleOrange = ({ title }) => {
  return (
    <>
      <div className="border-top-0 border-end-0 border-start-0 border border-3 ">
        <div className={`fs-1 my-4 font-special ${styles.title}`}>{title}</div>
      </div>
    </>
  );
};
export default SubTitleOrange;
