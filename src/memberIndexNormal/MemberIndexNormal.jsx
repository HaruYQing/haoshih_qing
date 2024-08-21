import NavBarShop from "../components/NavBarShop";
import MemberSideBar from "../components/MemberSideBar";
import MemberForm from "../components/MemberForm";
import MemberOrderNormal from "../MemberOrderNormal/MemberOrderNormal";
import ChatBtn from "../components/ChatBtn";
import Footer from "../components/Footer";
import SubTitleYellow from "../components/SubTitleYellow";
import MemberLike from "./components/MemberLike";
import axios from "axios";
import { useState, useEffect } from "react";
import { useParams, Routes, Route, Outlet } from "react-router-dom";

const MemberIndexNormal = () => {
  const [memberData, setMemberData] = useState(null);
  const { uid } = useParams();
  const user = JSON.parse(localStorage.getItem("user"));
  const updateProfileData = (newData) => {
    setMemberData(newData);
  };
  const cartVisible = 1;

  // 抓會員資料
  useEffect(() => {
    const fetchMemberData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/member/profile/${uid}`
        );
        setMemberData(response.data);
        console.log("Member Data:", response.data); // 數據首次被獲取時在控制台顯示
      } catch (error) {
        console.error("Error fetching member data:", error);
      }
    };
    fetchMemberData();
  }, [uid]); // 空陣列表示這個效果只在組件首次渲染時運行

  // 抓訂單資料
  const [orderData, setOrderData] = useState(null);
  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/member/orderList/${uid}`
        );
        setOrderData(response.data);
      } catch (error) {
        console.error("Error fetching order data:", error);
      }
    };
    fetchOrderData();
  }, [uid]);

  // 抓按讚資料
  const [likedData, setLikedData] = useState(null);
  useEffect(() => {
    const fetchLikedData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/member/like/${user.uid}`
        );
        setLikedData(response.data);
      } catch (error) {
        console.error("Error fetching liked data:", error);
      }
    };
    fetchLikedData();
  }, [user.uid]);

  const MemberProfile = () => (
    <>
      <SubTitleYellow title="會員資料" />
      {memberData ? (
        <MemberForm profile={memberData} onProfileUpdate={updateProfileData} />
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
          <MemberSideBar />
        </div>
        <div className="col-10">
          <Routes>
            <Route index element={<MemberProfile />} />
            <Route
              path="order"
              element={
                orderData ? (
                  <MemberOrderNormal orderData={orderData} />
                ) : (
                  <p>Loading...</p>
                )
              }
            />
            <Route
              path="like"
              element={
                likedData ? (
                  <MemberLike likedData={likedData} />
                ) : (
                  <p>還沒有按讚的攤位喔</p>
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

export default MemberIndexNormal;
