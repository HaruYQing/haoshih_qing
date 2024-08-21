import styles from "./SectionBtn.module.scss";

const SectionBtn = ({ title, type, changeType, choose }) => {
  // console.log(choose)
  return (
    <>
      <div
        className={`f-center w-100 mx-2 px-2 py-3 fs-4 text-center ${choose? "bg-secondary":"bg-white"} rounded-3  cursor-pointer hover-bg-secondary ${styles.sectionBtn}`}
        onClick={()=>{changeType(type)}} id={type}
      >
        {title}
      </div>
    </>
  );
};
export default SectionBtn;
