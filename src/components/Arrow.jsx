import styles from "./Arrow.module.scss";

const Arrow = ({ color, title }) => {
  return (
    <>
      <div className={`p-5 w-fit fs-5 ${styles.bg} ${styles[color]}`}>
        {title}
      </div>
    </>
  );
};

export default Arrow;
