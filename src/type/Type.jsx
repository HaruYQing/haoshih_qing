import NavBar from "../components/NavBar";
import MainBg from "../components/MainBg";
import TypeCardBlue from "./components/TypeCardBlue";
import TypeCardYellow from "./components/TypeCardYellow";
import Footer from "../components/Footer";

const vendorTypeList = [
  {
    id: 1,
    imgLink: "typeImg/clothing.png",
    title: "服飾",
    text: "從衣帽到鞋襪應有盡有，不論是尋找休閒風格的日常穿搭，還是尋求獨特設計的潮流服飾，都能在這裡找到專屬於自己的時尚風格。",
  },
  {
    id: 2,
    imgLink: "typeImg/accessories.png",
    title: "飾品",
    text: "飾品不僅是裝飾，更是展現個人品味和風格的方式。來飾品攤位，為自己挑選一件心儀的飾品，或是為親友送上獨特的心意。",
  },
  {
    id: 3,
    imgLink: "typeImg/handMade.png",
    title: "手作",
    text: "每一件手作品都充滿溫度與個性。無論是家居裝飾，還是心靈療癒的小物，都能體驗手工的溫暖，為生活增添一份專屬的幸福感。",
  },
  {
    id: 4,
    imgLink: "typeImg/food.png",
    title: "美食",
    text: "匯集了各種鹹食與甜品，滿足每個挑剔的味蕾。美食攤位不僅是品嚐美食的場所，更是與家人朋友共享美好時光的絕佳去處。",
  },
  {
    id: 5,
    imgLink: "typeImg/pet.png",
    title: "寵物",
    text: "從健康營養的寵物食品到時尚實用的配件，應有盡有。無論是為愛寵挑選美味的零食，或尋找合適的玩具與用品，都能提供滿意的選擇。",
  },
  {
    id: 6,
    imgLink: "typeImg/other.png",
    title: "其他",
    text: "匯集了各種鹹食與甜品，滿足每個挑剔的味蕾。美食攤位不僅是品嚐美食的場所，更是與家人朋友共享美好時光的絕佳去處。",
  },
];
const Type = () => {
  return (
    <>
      <NavBar />
      <MainBg page="type" title="攤位類型" />

      <div className="ps-5">
        {vendorTypeList.map((item, index) =>
          index % 2 === 0 ? (
            <TypeCardBlue key={item.id} item={item} />
          ) : (
            <TypeCardYellow key={item.id} item={item} />
          )
        )}
      </div>
      <Footer />
    </>
  );
};
export default Type;
