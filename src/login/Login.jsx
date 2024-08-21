import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import LoginNormal from "../loginNormal/LoginNormal";
import LoginVendor from "../loginVendor/LoginVendor";
import axios from "axios";

const Login = () => {
  const [error, setError] = useState("");
  const [loginType, setLoginType] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const googleLoginData = searchParams.get("googleLoginData");
    const errorMessage = searchParams.get("error");

    if (googleLoginData) {
      try {
        const userData = JSON.parse(decodeURIComponent(googleLoginData));
        handleLoginSuccess(userData);
      } catch (error) {
        console.error("解析 Google 登入數據時出錯:", error);
        setError("登入過程中發生錯誤");
      }
    } else if (errorMessage) {
      setError(decodeURIComponent(errorMessage));
    }
  }, [location]);

  const doMemberClick = () => {
    setLoginType("member");
  };

  const doVendorClick = () => {
    setLoginType("vendor");
  };

  const doBackClick = () => {
    setLoginType("");
  };

  const renderLoginForm = () => {
    if (loginType === "member") {
      return <LoginNormal doBackClick={doBackClick} />;
    } else if (loginType === "vendor") {
      return <LoginVendor doBackClick={doBackClick} />;
    }
    return null;
  };

  //抓會員暱稱

  const doLogin = async (formData, userType) => {
    try {
      const response = await axios.post("http://localhost:3200/", {
        account: formData.account,
        password: formData.password,
        userType: userType,
      });
      if (response.data.success) {
        // console.log('登入成功', response.data);
        const { uid, userType, userName } = response.data;
        localStorage.setItem("user", JSON.stringify(response.data));
        navigate(`/${userType}/${uid}`);
      } else {
        setError(response.data.error || "登入失敗");
      }
    } catch (error) {
      console.error("登入失敗:", error);
      setError(error.response?.data?.error || "登入失敗");
    }
  };

  const doMemberSubmit = async (formData) => {
    // console.log('一般會員登入');
    await doLogin(formData, "member");
  };

  const doVendorSubmit = async (formData) => {
    // console.log('攤主登入');
    await doLogin(formData, "vendor");
  };

  // console.log('Login渲染');

  const handleLoginSuccess = (userData) => {
    // 根據用戶類型導到相應頁面
    if (userData === "member") {
      navigate(`/member/${userData.uid}`);
    } else if (userData === "vendor") {
      navigate(`/vendor/${userData.uid}`);
    }
  };
  return (
    <>
      <div
        className="p-5 "
        style={loginType ? { display: "none" } : { display: "block" }}
      >
        <div className=" d-flex rounded-5 overflow-hidden font-special">
          {/* 一般用戶 */}
          <div className="bg-primary w-50 f-col-center p-5 ">
            <img className="w-50 f-center" src="images/img/normal.png" alt="" />
            <button
              className="w-50 fs-medium border border-4 bg-white   hover-bg-pink px-1 py-2 m-5 rounded-pill "
              onClick={doMemberClick}
            >
              我是顧客
            </button>
          </div>

          {/* 攤主 */}

          <div className="bg-lake w-50 f-col-center p-5 ">
            <img className="w-50 f-center" src="images/img/vendor.png" alt="" />
            <button
              className="w-50 fs-medium border border-3 bg-white hover-bg-secondary px-1 py-2 m-5 rounded-pill"
              onClick={doVendorClick}
            >
              我是攤主
            </button>
          </div>
        </div>
      </div>
      {renderLoginForm()}
    </>
  );
};
export default Login;
