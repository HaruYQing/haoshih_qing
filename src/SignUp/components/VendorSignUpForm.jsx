import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import "bootstrap-icons/font/bootstrap-icons.css";

const VendorRegistrationForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    last_name: "",
    first_name: "",
    nickname: "",
    tw_id: "",
    account: "",
    phone: "",
    email: "",
    address: "",
    password: "",
    doubleCheck: "",
    brand_name: "",
    brand_type: "",
    tag1: "",
    tag2: "",
    fb: "",
    ig: "",
    web: "",
    content: "",
  });

  const [validated, setValidated] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  // 檔案上傳相關狀態
  const [previewImages, setPreviewImages] = useState({
    logo_img: null,
    brand_img01: null,
    brand_img02: null,
    brand_img03: null,
    brand_img04: null,
    brand_img05: null,
  });
  const fileInputRefs = {
    logo_img: useRef(null),
    brand_img01: useRef(null),
    brand_img02: useRef(null),
    brand_img03: useRef(null),
    brand_img04: useRef(null),
    brand_img05: useRef(null),
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));

    // 在這裡添加各驗證邏輯
    validateField(name, value);
  };

  const validateField = (name, value) => {
    let newErrors = { ...errors };

    switch (name) {
      case "phone":
        newErrors.phone = !/^09\d{8}$/.test(value)
          ? "請輸入有效的手機號碼（格式：09xxxxxxxx）"
          : "";
        break;
      case "email":
        newErrors.email =
          !/^([a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4})*$/.test(value)
            ? "請輸入正確格式之電子信箱"
            : "";
        break;
      case "password":
        newErrors.password = !/^[a-zA-Z0-9!@#$%^&*()]{8,12}$/.test(value)
          ? "請輸入8-12位密碼，可包含大小寫字母、數字和特殊符號"
          : "";
        break;
      case "doubleCheck":
        newErrors.doubleCheck =
          value !== formData.password ? "請輸入相同密碼" : "";
        break;
      case "brand_name":
        newErrors.brand_name =
          value.length > 30 ? "請輸入30字以內品牌名稱" : "";
        break;
      case "tag1":
      case "tag2":
        newErrors[name] = value.length > 6 ? "請輸入6個字以內品牌標籤" : "";
        break;
      case "content":
        newErrors.content = value.length > 300 ? "請輸入300字以內品牌描述" : "";
        break;
      case "logo_img":
        if (value instanceof File) {
          const allowedTypes = ["image/jpeg", "image/png"];
          if (!allowedTypes.includes(value.type)) {
            newErrors[name] = "只能上傳 PNG 或 JPG 格式的圖片";
          } else {
            newErrors[name] = "";
          }
        }
        break;
      case "brand_img":
        if (value instanceof File) {
          const allowedTypes = ["image/jpeg", "image/png"];
          if (!allowedTypes.includes(value.type)) {
            newErrors[name] = "只能上傳 PNG 或 JPG 格式的圖片";
          } else {
            newErrors[name] = "";
          }
        }
        break;
      default:
        break;
    }

    setErrors(newErrors);
  };

  const handleImageUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
        setFormData((prev) => ({ ...prev, [fieldName]: file }));
      };
      reader.readAsDataURL(file);
    }
  };

  const renderImageUpload = (fieldName) => {
    return (
      <div
        className="position-relative"
        style={{ width: "210px", height: "150px", cursor: "pointer" }}
        onClick={() => fileInputRefs[fieldName].current.click()}
      >
        {previewImages[fieldName] ? (
          <img
            src={previewImages[fieldName]}
            alt={`${fieldName} preview`}
            className="w-100 h-100 object-fit-cover rounded"
          />
        ) : (
          <div className="w-100 h-100 bg-gray d-flex justify-content-center align-items-center rounded">
            <i className="bi bi-plus-lg fs-1 c-white"></i>
          </div>
        )}
        <input
          type="file"
          ref={fileInputRefs[fieldName]}
          style={{ display: "none" }}
          accept="image/png, image/jpeg"
          onChange={(e) => handleImageUpload(e, fieldName)}
        />
      </div>
    );
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const formDataToSend = new FormData();
      for (const key in formData) {
        if (formData[key] instanceof File) {
          formDataToSend.append(key, formData[key]);
        } else if (formData[key] !== "") {
          formDataToSend.append(key, formData[key]);
        }
      }

      const response = await axios.post(
        "http://localhost:3200/login/register/vendor",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        }
      );

      if (response.data.success) {
        alert("攤販註冊成功！");
        navigate("/login"); // 註冊成功後導向登入頁面
      } else {
        alert(response.data.error || "註冊失敗，請稍後再試");
      }
    } catch (error) {
      console.error("註冊失敗:", error);
      let errorMsg = "發生錯誤，請稍後再試";
      if (error.response) {
        console.error("錯誤狀態:", error.response.status);
        console.error("錯誤數據:", error.response.data);
        errorMsg = Array.isArray(error.response.data.error)
          ? error.response.data.error.join(", ")
          : error.response.data.error ||
            `註冊失敗: ${error.response.data.message || "伺服器錯誤"} (狀態: ${error.response.status})`;
      } else if (error.request) {
        console.error("未收到回應:", error.request);
        errorMsg = "無法連接到伺服器，請檢查您的網絡連接";
      } else {
        console.error("錯誤:", error.message);
        errorMsg = `發生錯誤: ${error.message}`;
      }
      setErrors({ general: errorMsg });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="my-5">
        <Col sm="2" className="text-end">
          <p className="c-gray">攤販會員註冊</p>
        </Col>
      </Row>

      {/* 個人資料部分 */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員姓名
        </Form.Label>
        <Col sm="3">
          <Form.Control
            type="text"
            placeholder="姓氏"
            name="last_name"
            value={formData.last_name}
            onChange={handleInputChange}
            required
          />
        </Col>
        <Col sm="5">
          <Form.Control
            type="text"
            placeholder="名字"
            name="first_name"
            value={formData.first_name}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          身分字號
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="開頭字母大寫"
            name="tw_id"
            value={formData.tw_id}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          會員帳號
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="8~12個英數字組合"
            name="account"
            value={formData.account}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          手機號碼
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="tel"
            placeholder="手機號碼"
            name="phone"
            value={formData.phone}
            onChange={handleInputChange}
            isInvalid={!!errors.phone}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          電子信箱
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="email"
            placeholder="電子信箱"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            isInvalid={!!errors.email}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          通訊地址
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="通訊地址"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          設定密碼
        </Form.Label>
        <Col sm="8">
          <InputGroup>
            <Form.Control
              type={showPassword ? "text" : "password"}
              placeholder="請輸入密碼"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              isInvalid={!!errors.password}
              required
            />
            <Button
              variant="outline-secondary"
              onClick={() => setShowPassword(!showPassword)}
            >
              <i
                className={`bi ${showPassword ? "bi-eye-slash" : "bi-eye"}`}
              ></i>
            </Button>
          </InputGroup>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-5">
        <Form.Label column sm="2" className="text-end">
          確認密碼
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="password"
            placeholder="請再次輸入密碼"
            name="doubleCheck"
            value={formData.doubleCheck}
            onChange={handleInputChange}
            isInvalid={!!errors.doubleCheck}
            required
          />
        </Col>
      </Form.Group>

      {/* 攤販資料部分 */}
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌Logo
        </Form.Label>
        <Col sm="8">
          {renderImageUpload("logo_img")}
          <Form.Text muted>檔案類型限PNG或JPG</Form.Text>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌名稱
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="品牌名稱"
            name="brand_name"
            value={formData.brand_name}
            onChange={handleInputChange}
            isInvalid={!!errors.brand_name}
            required
          />
          <Form.Text muted>字數限30字以內</Form.Text>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌類型
        </Form.Label>
        <Col sm="8">
          <Form.Select
            name="brand_type"
            value={formData.brand_type}
            onChange={handleInputChange}
            required
          >
            <option value="">選擇類型</option>
            <option value="clothing">服飾</option>
            <option value="accessories">飾品</option>
            <option value="handmade">手作</option>
            <option value="food">美食</option>
            <option value="pet">寵物</option>
            <option value="others">其他</option>
          </Form.Select>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌標籤
        </Form.Label>
        <Col sm="4">
          <Form.Control
            type="text"
            placeholder="標籤1"
            name="tag1"
            value={formData.tag1}
            onChange={handleInputChange}
            isInvalid={!!errors.tag1}
          />
        </Col>
        <Col sm="4">
          <Form.Control
            type="text"
            placeholder="標籤2"
            name="tag2"
            value={formData.tag2}
            onChange={handleInputChange}
            isInvalid={!!errors.tag2}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌FB
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Facebook 連結"
            name="fb"
            value={formData.fb}
            onChange={handleInputChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌IG
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="Instagram 連結"
            name="ig"
            value={formData.ig}
            onChange={handleInputChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌官網
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder="官方網站連結"
            name="web"
            value={formData.web}
            onChange={handleInputChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          品牌描述
        </Form.Label>
        <Col sm="8">
          <Form.Control
            as="textarea"
            rows={5}
            placeholder="請簡短描述您的品牌"
            name="content"
            value={formData.content}
            onChange={handleInputChange}
            isInvalid={!!errors.content}
          />
          <Form.Text muted>字數限300字以內</Form.Text>
        </Col>
      </Form.Group>

      <Form.Group as={Row} className="mb-5">
        <Form.Label column sm="2" className="text-end">
          品牌視覺照
        </Form.Label>
        <Col sm="8">
          <div className="d-flex flex-wrap gap-3">
            {renderImageUpload("brand_img01")}
            {renderImageUpload("brand_img02")}
            {renderImageUpload("brand_img03")}
            {renderImageUpload("brand_img04")}
            {renderImageUpload("brand_img05")}
          </div>
          <Form.Text muted>最多可上傳五張，檔案類型限PNG或JPG</Form.Text>
        </Col>
      </Form.Group>

      <Row>
        <Col sm="8" className="offset-sm-2">
          <div className="d-flex justify-content-center">
            <Button
              className="me-3 bg-white c-black  border border-2 rounded-pill"
              type="button"
              onClick={() => {
                if (
                  window.confirm("確定要取消註冊嗎？所有輸入的資料將會遺失。")
                ) {
                  navigate("/"); // 假設取消後回到首頁
                }
              }}
              disabled={isLoading}
            >
              取消註冊
            </Button>
            <Button
              className="me-3 bg-secondary c-black  border border-2 rounded-pill"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "提交中..." : "確認註冊"}
            </Button>
          </div>
        </Col>
      </Row>
    </Form>
  );
};

export default VendorRegistrationForm;
