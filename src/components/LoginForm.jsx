import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";

function LoginForm({ onSubmit, buttonText = "登入", userType }) {
  // console.log('LoginForm 接收到的', { onSubmit, buttonText });

  const [validated, setValidated] = useState(false);
  const [formData, setFormData] = useState({
    account: "",
    password: "",
  });
  const navigate = useNavigate();

  const doSubmit = (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.preventDefault();
      event.stopPropagation();
    } else {
      // console.log('呼叫onSubmit', formData);
      if (typeof onSubmit === "function") {
        onSubmit(formData);
      } else {
        // console.error('LoginForm: onSubmit不是一個函數', onSubmit);
        alert("登入異常");
      }
    }
    setValidated(true);
  };

  const doChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const doRegister = () => {
    const path =
      userType === "vendor" ? "/register/vendor" : "/register/member";
    navigate(path);
  };

  const doGoogleLogin = (e) => {
    e.preventDefault();
    window.location.href = `http://localhost:3200/login/auth/google?userType=${userType}`;
  };

  return (
    <Form noValidate validated={validated} onSubmit={doSubmit}>
      <Col>
        <Form.Group as={Col} controlId="validationCustom01" className="mb-1">
          <Form.Label column>帳號</Form.Label>
          <Form.Control
            type="text"
            name="account"
            value={formData.account}
            onChange={doChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            請輸入帳號
          </Form.Control.Feedback>
        </Form.Group>
        <Form.Group as={Col} controlId="validationCustom02" className="mb-1">
          <Form.Label column>密碼</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={doChange}
            required
          />
          <Form.Control.Feedback type="invalid">
            請輸入密碼
          </Form.Control.Feedback>
        </Form.Group>

        <Col>
          <div className="f-center py-2">
            <Button
              className="bg-white hover-bg-pink hover-c-white"
              variant=" border border-2 c-black rounded-pill px-4 py-2 w-25"
              type="submit"
            >
              {buttonText || "登入"}
            </Button>
          </div>
          <div className="f-start border-top p-3 mt-4 gap-3 w-100">
            <div className="fs-6"> 其他登入</div>
            <div className="f-center gap-4 w-25">
              <i
                className="w-25 bi bi-google fs-2 cursor-pointer px-2"
                onClick={doGoogleLogin}
              ></i>
              {/* <img
                className="w-25"
                src="images/icon/google.png"
                alt="google"
                onClick={doGoogleLogin}
              /> */}
              <i
                className="w-25 bi bi-facebook fs-2 cursor-pointer"
                style={{ visibility: "hidden" }}
              ></i>
              {/* <i className="w-25 bi bi-twitter-x fs-2 cursor-pointer"></i> */}
              <img
                className="w-25"
                src="images/icon/twitter.png"
                alt="twitter"
                style={{ visibility: "hidden" }}
              />
            </div>
          </div>
        </Col>
      </Col>
      <div className="f-end gap-2">
        <div className="c-black">還沒有帳號嗎？</div>
        <Button
          className="bg-white hover-bg-pink hover-c-white"
          variant="c-gray border border-2 rounded-pill px-4 py-2 w-25"
          type="button"
          onClick={doRegister}
        >
          註冊
        </Button>
      </div>
    </Form>
  );
}

export default LoginForm;
