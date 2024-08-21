import React from "react";
import styles from "./Layout.module.scss";
import Home from "./home/Home";
import News from "./news/News";
import AllVendors from "./allVendor/AllVendors";
import Vendor from "./vendor/Vendor";
import Type from "./type/Type";
import Map from "./map/Map";
import MemberIndexNormal from "./memberIndexNormal/MemberIndexNormal";
import MemberIndexVendor from "./memberIndexVendor/MemberIndexVendor";
import Login from "./login/Login";
import LoginNormal from "./loginNormal/LoginNormal";
import LoginVendor from "./loginVendor/LoginVendor";
import ShopCart from "./shopCart/ShopCart";
import Normal from "./SignUp/Normal";
import SetStalls from "./setStalls/SetStalls";
import Default from "./default/Default";
import Chatroom from "./chatroom/Chatroom";
import Step1 from "./checkOut/step/Step1";
import Step2 from "./checkOut/step/Step2";
import Step3 from "./checkOut/step/Step3";
import Step4 from "./checkOut/step/Step4";
import VendorSignUp from "./SignUp/VendorSingUp";

import { Routes, Route, useLocation } from "react-router-dom";

// TODO:
// 1. 把 Home 搬進來、Layout 搬進 App（注意路徑改變）
// 2. 加上背景xe
// 3. 加上 React Router
const Layout = () => {
  const location = useLocation();
  return (
    <div className="layout">
      <div className="position-relative">
        <div className={styles.background}>
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/haoshih" element={<Home />} />
            <Route path="/news" element={<News />} />
            <Route path="/shop" element={<AllVendors />} />
            <Route path="/shop/:vid/*" element={<Vendor />} />
            <Route path="/type" element={<Type />} />
            <Route path="/map" element={<Map />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register/member" element={<Normal />} />
            <Route path="/register/vendor" element={<VendorSignUp />} />
            <Route path="/SetStalls" element={<SetStalls />} />
            {/* TODO: default route  =- 已經在 default/Default.jsx */}
            <Route path="/member/:uid/*" element={<MemberIndexNormal />} />
            <Route path="/vendor/:vid/*" element={<MemberIndexVendor />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/login" element={<Login />} />
            {/* ======= */}
            <Route path="/Step1" element={<Step1 />} />
            <Route path="/Step2" element={<Step2 />} />
            <Route path="/Step3" element={<Step3 />} />
            <Route path="/Step4" element={<Step4 />} />
            <Route path="/ShopCart" element={<ShopCart />} />
            <Route path="/chatroom" element={<Chatroom />} />
          </Routes>
        </div>
      </div>
      {/* <Login /> */}
      {/* <LoginNormal /> */}
      {/* <LoginVendor /> */}
    </div>
  );
};

export default Layout;
