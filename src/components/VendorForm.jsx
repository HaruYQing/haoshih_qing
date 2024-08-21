import { useState } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "bootstrap-icons/font/bootstrap-icons.css";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import useAxios from "axios-hooks";

const VendorForm = (props) => {
  // 重新導向功能
  const navigate = useNavigate();
  // refetch功能
  const [{ data, loading, error }, refetch] = useAxios(
    `http://localhost:3200/vendor/profile/${props.profile.vid}`
  );
  // 管理表單資料
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    doubleCheck: "",
  });
  // 表單是否已經被驗證
  const [validated, setValidated] = useState(false);
  // 手機號碼驗證狀態
  const [phoneError, setPhoneError] = useState(false);
  // 電子信箱驗證狀態
  const [emailError, setEmailError] = useState(false);
  // 密碼驗證狀態
  const [pwError, setPwError] = useState(false);
  // 密碼顯示狀態
  const [showPassword, setShowPassword] = useState(false);
  // 確認密碼
  const [dbCheckError, setDbCheckError] = useState(false);

  // 有 change => 更新 state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));

    if (name === "phone" && value !== "") {
      setPhoneError(!validatePhone(value));
    } else if (name === "phone" && value === "") {
      setPhoneError(false); // 如果欄位為空，不顯示錯誤
    }

    if (name === "email" && value !== "") {
      setEmailError(!validateEmail(value));
    } else if (name === "email" && value === "") {
      setEmailError(false); // 如果欄位為空，不顯示錯誤
    }

    if (name === "password" && value !== "") {
      setPwError(!validatePassword(value));
    } else if (name === "password" && value === "") {
      setPwError(false); // 如果欄位為空，不顯示錯誤
    }

    if (name === "doubleCheck") {
      setDbCheckError(value !== formData.password);
    }
  };

  // 手機號碼驗證函數
  const validatePhone = (phone) => {
    const phoneRegex = /^09\d{8}$/;
    return phoneRegex.test(phone);
  };

  // 電子信箱驗證
  const validateEmail = (email) => {
    const emailRegex = /^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/;
    return emailRegex.test(email);
  };

  // 密碼驗證
  function validatePassword(password) {
    const passwordRegex = /^[a-zA-Z0-9!@#$%^&*()]{8,12}$/;
    return passwordRegex.test(password);
  }

  // 確認密碼驗證
  function validateDbCheck(doubleCheck) {
    return doubleCheck === formData.password;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    // const form = event.currentTarget;

    let isValid = true;

    if (formData.phone && !validatePhone(formData.phone)) {
      setPhoneError(true);
      isValid = false;
    }

    if (formData.email && !validateEmail(formData.email)) {
      setEmailError(true);
      isValid = false;
    }

    if (formData.password && !validatePassword(formData.password)) {
      setPwError(true);
      isValid = false;
    }
    if (formData.password && !validateDbCheck(formData.doubleCheck)) {
      setDbCheckError(true);
      isValid = false;
    }

    if (!isValid) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // 把有改變且與原始數據不同的項目打包成一個新物件 updatedFields
      const updatedFields = Object.keys(formData).reduce((acc, key) => {
        if (formData[key] !== "" && formData[key] !== props.profile[key]) {
          acc[key] = formData[key];
        }
        return acc;
      }, {});

      console.log("Sending update request with:", updatedFields);
      const response = await axios.put(
        `http://localhost:3200/vendor/profile/${props.profile.vid}`,
        updatedFields
      );
      console.log("Full response:", response);

      // 根據響應決定是否導航
      if (response.status === 200) {
        console.log("Profile updated successfully:", response.data.message);
        console.log("Updated fields:", response.data.updatedFields);

        // 更新表單狀態
        setFormData((prevState) => ({
          ...prevState,
          ...updatedFields,
        }));

        // 更新 props.profile
        if (typeof props.onProfileUpdate === "function") {
          props.onProfileUpdate({ ...props.profile, ...updatedFields });
        }

        alert("資料更新成功");
        // 重新導回會員資料頁面
        navigate(`/vendor/${props.profile.vid}`);
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      // 在這裡處理錯誤，例如顯示錯誤消息
      console.error("Error updating profile:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className=" my-5 ">
        <Col sm="2" className="text-end">
          <p className="c-gray">攤主會員</p>
        </Col>
        <Col sm="6">
          <div className="f-start">
            <h2 className="me-2">{props.profile.last_name}</h2>
            <h2 className="me-3">{props.profile.first_name}</h2>
          </div>
        </Col>
      </Row>
      <Row>
        <Col sm="2" className="text-end">
          <p>身份字號</p>
        </Col>
        <Col sm="6">{props.profile.tw_id}</Col>
      </Row>
      <Row>
        <Col sm="2" className="text-end">
          <p>會員帳號</p>
        </Col>
        <Col sm="6">{props.profile.account}</Col>
      </Row>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員姓名
        </Form.Label>
        <Col sm="2">
          <Form.Control
            type="text"
            placeholder={props.profile.last_name}
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            id="validationCustomLastName"
          />
        </Col>
        <Col sm="4">
          <Form.Control
            type="text"
            placeholder={props.profile.first_name}
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            id="validationCustomFirstName"
          />
          <Form.Control.Feedback type="invalid">
            請輸入正確姓名
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      {/* 手機號碼 ==> 已加入驗證邏輯 */}
      <Form.Group as={Row} controlId="validationCustom02" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          手機號碼
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="tel"
            placeholder={props.profile.phone}
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            isInvalid={phoneError}
          />
          <Form.Control.Feedback type="invalid">
            請輸入有效的手機號碼（格式：09xxxxxxxx）
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom03" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          電子信箱
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="email"
            placeholder={props.profile.email}
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            isInvalid={emailError}
          />
          <Form.Control.Feedback type="invalid">
            請輸入正確格式之電子信箱
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom04" className="mb-5">
        <Form.Label column sm="2" className="text-end">
          通訊地址
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="address"
            placeholder={props.profile.address}
            name="address"
            value={formData.address}
            onChange={handleInputChange}
          />
          <Form.Control.Feedback type="invalid">
            請輸入正確地址
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom05" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          修改密碼
        </Form.Label>
        <Col sm="6">
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="請輸入新密碼"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              isInvalid={pwError}
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                borderColor: "#ced4da",
                backgroundColor: "#B7EFE0",
                borderTopRightRadius: "0.25rem",
                borderBottomRightRadius: "0.25rem",
              }}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </Button>
            <Form.Control.Feedback type="invalid" tooltip>
              請輸入8-12位密碼，可包含大小寫字母、數字和特殊符號
            </Form.Control.Feedback>
          </InputGroup>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="validationCustom06" className="mb-5">
        <Form.Label column sm="2" className="text-end">
          確認密碼
        </Form.Label>
        <Col sm="6">
          <Form.Control
            type="password"
            placeholder="請再次輸入新密碼"
            name="doubleCheck"
            value={formData.doubleCheck || ""}
            onChange={handleInputChange}
            isInvalid={dbCheckError}
            required={!!formData.password}
          />
          <Form.Control.Feedback type="invalid">
            請輸入相同密碼
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Row className="mb-5">
        <Col sm="8">
          <div className="d-flex justify-content-center">
            <Button
              className="me-5 bg-white"
              variant="bg-white border border-2 c-gray rounded-pill px-4 py-2"
              type="button"
              onClick={() => {
                alert("確定要取消變更嗎？");
                navigate(`/vendor/${props.profile.vid}`);
              }}
            >
              取消變更
            </Button>
            <Button
              className="ms-5"
              variant=" bg-blueGray text-white rounded-pill px-4 py-2"
              type="submit"
              onClick={async () => {
                await refetch(); // 先執行 refetch
                navigate(`/vendor/${props.profile.vid}`); // 然後導航
              }}
            >
              儲存變更
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default VendorForm;
