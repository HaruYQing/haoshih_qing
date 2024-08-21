import NavBar from "../components/NavBar";
import MainBg from "../components/MainBg";
import Footer from "../components/Footer";
import InfoCards from "./components/InfoCards";
import SubTitleOrange from "../components/SubTitleOrange";

const News = () => {
  return (
    <>
      <NavBar />
      <MainBg title="最新消息" page="news" />
      <SubTitleOrange title="活動公告" />
      <InfoCards />
      <SubTitleOrange title="相關文章" />
      <InfoCards />
      <Footer />
    </>
  );
};
export default News;
