import MenuItem from "./MenuItem";

const menuItems = [
  {
    id: 1,
    img: "images/icon/News.png",
    title: "最新消息",
    link: "/news",
    description: "市集公告、攤位招租、最新活動等相關資訊",
  },
  {
    id: 2,
    img: "images/icon/Diversity.png",
    title: "攤販類型",
    link: "/type",
    description: "介紹事集內好ㄕˋ集多元攤販",
  },
  {
    id: 3,
    img: "images/icon/Travel_Signpost.png",
    title: "市集地圖",
    link: "/map",
    description: "提供市集導覽與交通資訊，帶領你們走進好ㄕˋ集",
  },
  {
    id: 4,
    img: "images/icon/Stall.png",
    title: "我要擺攤",
    link: "/SetStalls",
    description: "提供攤主們擺攤資訊與攤位出租申請",
  },
  {
    id: 5,
    img: "images/icon/Shopping_Mall.png",
    title: "市集商城",
    link: "/shop",
    description: "讓大家無論在哪也能線上購買市集商品",
  },
];

const Menu = () => {
  return (
    <>
      <div>
        <h1 className="fs-larger py-5 text-center font-special">功能介紹</h1>
        <div className="container">
          <div className="row  d-flex justify-content-center mw-100">
            {menuItems.map((item) => (
              <MenuItem key={item.id} item={item} id={item.id}/>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default Menu;
