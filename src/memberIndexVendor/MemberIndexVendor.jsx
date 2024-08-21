import { useState, useEffect } from "react";
import { useParams, Routes, Route, Outlet } from "react-router-dom";
import axios from "axios";
import NavBarShop from "../components/NavBarShop";
import MemberVenderSideBar from "../components/MemberVenderSideBar";
import SubTitleYellow from "../components/SubTitleYellow";
import VendorForm from "../components/VendorForm";
import ChatBtn from "../components/ChatBtn";
import Footer from "../components/Footer";
import VendorStallProfile from "./components/VendorStallProfile";
import EditStallProfile from "./components/EditStallProfile";
import VendorPaymentSettings from "./components/VendorPaymentSettings";
import VendorProducts from "./components/VendorProducts";
import VendorOrders from "./components/VendorOrders";

const MemberIndexVendor = () => {
  const [vendorData, setVendorData] = useState(null);
  const [stallProfile, setStallProfile] = useState(null);
  const [productsData, setProductsData] = useState(null);
  const [orderData, setOrderData] = useState(null);
  const { vid } = useParams();
  const updateProfileData = (newData) => {
    setVendorData(newData);
  };
  const cartVisible = 1;

  // 抓會員資料
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/profile/${vid}`
        );
        setVendorData(response.data);
        // console.log("Vendor Data:", response.data); // 數據首次被獲取時在控制台顯示
      } catch (error) {
        console.error("Error fetching vendor data:", error);
      }
    };

    fetchVendorData();
  }, [vid]); // 空陣列表示這個效果只在組件首次渲染時運行

  // 抓攤位資訊
  useEffect(() => {
    const fetchStallProfile = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/info/${vid}`
        );
        setStallProfile(response.data);
      } catch (error) {
        console.error("Error fetching StallProfile:", error);
      }
    };

    fetchStallProfile();
  }, [vid]);

  // 重抓攤位資訊
  const refetchStallProfile = async (updatedData = null) => {
    if (updatedData) {
      setStallProfile((prevProfile) => ({ ...prevProfile, ...updatedData }));
    } else {
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/info/${vid}`
        );
        setStallProfile(response.data);
      } catch (error) {
        console.error("Error refetching StallProfile:", error);
      }
    }
  };

  // 抓商品資訊
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/allProducts/${vid}`
        );
        setProductsData(response.data);
      } catch (error) {
        console.error("Error fetching Products Data:", error);
      }
    };

    fetchProductsData();
  }, [vid]);

  // 抓訂單資料
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/allOrders/${vid}`
        );
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching Order Data:", error);
      }
    };

    fetchOrderData();
  }, [vid]);

  console.log(orderData);

  const VendorProfile = () => (
    <>
      <SubTitleYellow title="會員資料" />
      {vendorData ? (
        <VendorForm profile={vendorData} onProfileUpdate={updateProfileData} />
      ) : (
        <p>Loading...</p>
      )}
    </>
  );

  return (
    <>
      <NavBarShop cartVisible={cartVisible} />
      <div className="row mw-100">
        <div className="col-2  border-end border-3">
          <MemberVenderSideBar />
        </div>
        <div className="col-10">
          <Routes>
            {/* http://localhost:3000/vendor/1 */}
            <Route index element={<VendorProfile />} />

            <Route
              path="vendorInfo"
              element={
                stallProfile ? (
                  <VendorStallProfile stallProfile={stallProfile} />
                ) : (
                  <p>Loading...</p>
                )
              }
            />
            <Route
              path="edit"
              element={
                <EditStallProfile
                  stallProfile={stallProfile ? stallProfile : ""}
                  onProfileUpdate={refetchStallProfile}
                />
              }
            />

            {/* http://localhost:3000/vendor/1/payment */}
            <Route path="payment" element={<VendorPaymentSettings />} />

            <Route
              path="products/*"
              element={
                productsData ? (
                  <VendorProducts productsData={productsData} />
                ) : (
                  <p>Loading...</p>
                )
              }
            />

            <Route
              path="orders"
              element={
                orderData ? (
                  <VendorOrders orderData={orderData} />
                ) : (
                  <p>Loading...</p>
                )
              }
            />
          </Routes>
          <Outlet />

          <ChatBtn />
        </div>
      </div>
      <Footer />
    </>
  );
};

export default MemberIndexVendor;
