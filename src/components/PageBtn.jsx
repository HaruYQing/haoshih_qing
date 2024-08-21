import styles from "./PageBtn.module.scss";
const PageBtn = () => {
  return (
    <>
      <div className={`d-flex justify-content-center ${styles.pageBtn}`}>
        <ul className="pagination">
          <li>
            <a href="#">«</a>
          </li>
          <li>
            <a href="#">1</a>
          </li>
          <li>
            <a className="active" href="#">
              2
            </a>
          </li>
          <li>
            <a href="#">3</a>
          </li>

          <li>
            <a href="#">»</a>
          </li>
        </ul>
      </div>
    </>
  );
};
export default PageBtn;
