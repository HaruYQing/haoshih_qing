import "bootstrap-icons/font/bootstrap-icons.css";
import LoginForm from "../components/LoginForm";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginVendor = (props) => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { doBackClick } = props;

  const handleVendorSubmit = async (formData) => {
    try {
      // console.log('準備發送的登入數據：', { ...formData, userType: 'vendor' });
      const response = await axios.post("http://localhost:3200/login", {
        account: formData.account,
        password: formData.password,
        userType: "vendor",
      });
      if (response.data.success) {
        // console.log('攤販登入成功:', response.data);
        const { vid, userType } = response.data;

        const brandnameResponse = await axios.get(
          `http://localhost:3200/login/vendor/${vid}`
        );
        const { brand_name } = brandnameResponse.data;

        const vendorData = {
          vid,
          brand_name,
          userType,
        };

        localStorage.setItem("user", JSON.stringify(vendorData));
        navigate(`/${userType}/${vid}`);
      } else {
        // 登入失敗
        setError(response.data.error || "登入失敗，請檢查您的帳號和密碼");
      }
    } catch (error) {
      console.error("登入過程中發生錯誤:", error);
      setError("登入過程發生錯誤，請稍後再試");
    }
    // console.log(response.data);
  };

  return (
    <>
      <div className="p-5 ">
        <div className=" d-flex rounded-5 overflow-hidden ">
          {/* 一般用戶 */}
          <div className="bg-lake w-50 f-col-around p-5 gap-3 ">
            <div className="w-50">
              <img
                className=" w-100 f-center object-fit-contain"
                src="images/img/login2.png"
                alt=""
                style={{ height: "200px" }}
              />
            </div>
            <p className="text-center w-50 font-special fs-2">
              分享創意，連結熱情，享受與客戶交流的美好時光
            </p>
            <i
              className="bi bi-arrow-left-circle fw-bolder c-white fs-1 cursor-pointer"
              onClick={doBackClick}
            ></i>
          </div>

          {/* 登入 */}

          <div className="w-50 f-col-center p-5 bg-glass">
            <LoginForm
              onSubmit={handleVendorSubmit}
              buttonText="攤販登入"
              userType="vendor"
            />
          </div>
        </div>
      </div>
    </>
  );
};
export default LoginVendor;
