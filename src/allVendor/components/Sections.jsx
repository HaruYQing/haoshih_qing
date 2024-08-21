import SectionBtn from "./SectionBtn";

const title = ["全部", "服飾", "飾品", "手作", "美食", "寵物", "其他"];
const en_title = ["all", "clothing", "accessories", "handmade", "food", "pet", "others"]
const Sections = ({ type, changeType }) => {
  return (
    <>
      <div className="p-5 d-flex ">
        {title.map((item, index) => (
          <SectionBtn key={index} title={item} type={en_title[index]} changeType={changeType} choose={(type === en_title[index])}/>
        ))}
      </div>
    </>
  );
};

export default Sections;
