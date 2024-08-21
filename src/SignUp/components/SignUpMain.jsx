import React from "react";
import styles from "./SignUpMain.module.scss";

const SignUpMain = ({ title }) => {
  return (
    <>
      <div className={`position-relative overflow-hidden ${styles.mainBg}`}>
        <div className={`position-absolute end-0 ${styles.mainImg}`}>
          <img className="w-100" src="/images/img/sun.png" alt="" />
        </div>
        <div
          className={`bg-secondary fs-larger font-special position-absolute start-0 px-4 ${styles.mainTitle}`}
        >
          {title}
        </div>
      </div>
    </>
  );
};
export default SignUpMain;
