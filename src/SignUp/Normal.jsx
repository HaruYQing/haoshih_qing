import React from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import NavBarShop from "../components/NavBarShop";
import NormalForm from "./components/NormalForm";
import SignUpMain from "./components/SignUpMain";

const Normal = () => {
  const navigate = useNavigate();

  const doRegSuccess = () => {
    // console.log('註冊成功');
    alert("註冊成功！");
    navigate("/login"); // 回登入頁面
  };
  return (
    <>
      <NavBarShop />
      <SignUpMain title="一般會員註冊" />
      <div className="f-center p-5 ">
        <NormalForm onRegSuccess={doRegSuccess} />
      </div>
      <Footer />
    </>
  );
};
export default Normal;
