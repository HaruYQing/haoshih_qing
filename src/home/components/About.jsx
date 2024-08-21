import { useState } from "react";
import styles from "./About.module.scss";

const About = () => {
  return (
    <>
      <div className="p-5 ">
        <div className="position-relative">
          <div className="w-25">
            <img className={styles.sunImg} src="images/img/sun.png" alt="sun" />
          </div>
          <div className="w-100 text-center position-relative">
            <div className="w-50 text-center position-absolute top-50 start-50 translate-middle">
              <h1 className="py-3 w-75 font-special fs-larger">關於我們</h1>
              <h2 className=" w-75 fs-2 lh-lg  text-wrap font-special">
                為大家帶來美好體驗，讓「好」融入生活中的每一刻。在這裡，每次相遇都是一場心靈的盛宴，藝術、手作與生活的完美交融，讓我們共同探索生活中的美好與驚喜。
              </h2>
            </div>
            <div className="w-100">
              <img className="w-75" src="images/img/about.png" alt="about" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default About;
