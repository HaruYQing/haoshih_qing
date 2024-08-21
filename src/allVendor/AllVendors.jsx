import NavBarShop from "../components/NavBarShop";
import MainBg from "../components/MainBg";
import Sections from "./components/Sections";
import AllVendorsCard from "./components/AllVendorsCard";
// import PageBtn from "../components/PageBtn";
import Footer from "../components/Footer";
import styles from "./AllVendors.module.scss";
import ChatBtn from "../components/ChatBtn";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const AllVendors = () => {
  const [vendors, setVendors] = useState([]);
  const [type, setType] = useState("all");
  const cartVisible = 1;

  let navigate = useNavigate();

  const handleNavigation = (vid) => {
    navigate("/shop/" + vid);
    // console.log("click",vid)
  };

  const fetchVendorData = async (type) => {
    var url = "http://localhost:3200/shop/";
    if (type !== "all") {
      url += type;
    }
    try {
      const response = await axios.get(url);
      console.log(response.data);

      setVendors(response.data);
      // 檢查用：數據首次被獲取時顯示
      // console.log("Vendors Data:", response.data);
    } catch (error) {
      console.error("Error fetching vendors data:", error);
    }
  };
  useEffect(() => {
    fetchVendorData(type);
  }, [type]); // 空陣列表示這個效果只在 component 首次渲染時執行

  return (
    <>
      <NavBarShop cartVisible={cartVisible} />
      <MainBg title="市集商城" page="allVendors" />
      <Sections
        type={type}
        changeType={(current_type) => {
          setType(current_type);
          // console.log(current_type)
        }}
      />
      <div className={`row p-5 ${styles.vendorBorder}`}>
        {vendors.map((vendor, index) => (
          <AllVendorsCard
            key={vendor.vinfo}
            data={vendor}
            linkTo={handleNavigation}
          />
        ))}
      </div>
      {/* <PageBtn /> */}
      <Footer />
      {/* <ChatBtn /> */}
    </>
  );
};
export default AllVendors;
