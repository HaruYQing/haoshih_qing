import { useState, useRef, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Form from "react-bootstrap/Form";
import "bootstrap-icons/font/bootstrap-icons.css";
import InputGroup from "react-bootstrap/InputGroup";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import axios from "axios";
// import useAxios from "axios-hooks";
import SubTitleYellow from "../../components/SubTitleYellow";

const EditStallProfile = (props) => {
  // 重新導向功能
  const navigate = useNavigate();
  // refetch功能
  // const [{ data, loading, error }, refetch] = useAxios(
  //   `http://localhost:3200/vendor/info/${props.stallProfile.vid}`
  // );
  // 資料庫抓出來的資料
  const stallProfile = props.stallProfile;
  // 新填寫的表單資料
  const [stallData, setStallData] = useState({
    logo_img: "",
    brand_name: "",
    brand_type: "",
    fb: "",
    ig: "",
    web: "",
    tag1: "",
    tag2: "",
    content: "",
    brand_img01: "",
    brand_img02: "",
    brand_img03: "",
    brand_img04: "",
    brand_img05: "",
  });

  // 管理預覽圖片的狀態
  const [previewImages, setPreviewImages] = useState({
    brand_img01: null,
    brand_img02: null,
    brand_img03: null,
    brand_img04: null,
    brand_img05: null,
  });
  // 當 stallProfile 加載完成後，更新 previewImages
  useEffect(() => {
    setPreviewImages({
      brand_img01: stallProfile.brand_img01 || null,
      brand_img02: stallProfile.brand_img02 || null,
      brand_img03: stallProfile.brand_img03 || null,
      brand_img04: stallProfile.brand_img04 || null,
      brand_img05: stallProfile.brand_img05 || null,
    });
  }, [stallProfile]);
  // 點擊圖片區域來觸發文件選擇
  const fileInputRefs = {
    brand_img01: useRef(null),
    brand_img02: useRef(null),
    brand_img03: useRef(null),
    brand_img04: useRef(null),
    brand_img05: useRef(null),
  };
  // 創建一個預覽並更新 stallData 和 previewImages
  const handleImageUpload = (event, fieldName) => {
    const file = event.target.files[0];
    if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
        setStallData((prev) => ({ ...prev, [fieldName]: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };
  // 為每個圖片欄位渲染上傳區域
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
            alt={`品牌視覺照 ${fieldName}`}
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

  // 表單是否已經被驗證
  const [validated, setValidated] = useState(false);
  // 品牌名稱驗證狀態
  const [brandNameError, setBrandNameError] = useState(false);
  // 品牌標籤驗證狀態
  const [tag1Error, setTag1Error] = useState(false);
  const [tag2Error, setTag2Error] = useState(false);
  // 品牌描述驗證狀態
  const [contentError, setContentError] = useState(false);

  // 有 change => 更新 state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStallData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));

    if (name === "brand_name" && value !== "") {
      setBrandNameError(!validateBrandName(value));
    } else if (name === "brand_name" && value === "") {
      setBrandNameError(false);
    }

    if (name === "tag1" && value !== "") {
      setTag1Error(!validateTags(value));
    } else if (name === "tag1" && value === "") {
      setTag1Error(false);
    }

    if (name === "tag2" && value !== "") {
      setTag2Error(!validateTags(value));
    } else if (name === "tag2" && value === "") {
      setTag2Error(false);
    }

    if (name === "content" && value !== "") {
      setContentError(!validateContent(value));
    } else if (name === "content" && value === "") {
      setContentError(false);
    }
  };

  const validateBrandName = (brandName) => {
    return brandName.length <= 30;
  };

  const validateTags = (tag) => {
    return tag.length <= 6;
  };

  const validateContent = (content) => {
    return content.length <= 300;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // 添加所有字段，包括圖片（現在是 Base64 字符串）
    Object.keys(stallData).forEach((key) => {
      formData.append(key, stallData[key]);
    });

    let isValid = true;

    if (stallData.brand_name && !validateBrandName(stallData.brand_name)) {
      setBrandNameError(true);
      isValid = false;
    }
    if (stallData.tag1 && !validateTags(stallData.tag1)) {
      setTag1Error(true);
      isValid = false;
    }
    if (stallData.tag2 && !validateTags(stallData.tag2)) {
      setTag2Error(true);
      isValid = false;
    }
    if (stallData.content && !validateContent(stallData.content)) {
      setContentError(true);
      isValid = false;
    }
    if (!isValid) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // 把有改變且與原始數據不同的項目打包成一個新物件 updatedFields
      const updatedFields = Object.keys(stallData).reduce((acc, key) => {
        if (stallData[key] !== "" && stallData[key] !== stallProfile[key]) {
          acc[key] = stallData[key];
        }
        return acc;
      }, {});

      console.log("Sending update request with:", updatedFields);
      const response = await axios.put(
        `http://localhost:3200/vendor/info/${stallProfile.vid}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log("Full response:", response);

      // 根據響應決定是否導航
      if (response.status === 200) {
        console.log("Stall Data updated successfully:", response.data.message);
        console.log("Updated fields:", response.data.updatedFields);

        const updatedStallProfile = { ...stallProfile, ...updatedFields };

        // 更新表單狀態
        setStallData((prevState) => ({
          ...prevState,
          ...updatedFields,
        }));

        // 更新 stallProfile
        if (typeof props.onProfileUpdate === "function") {
          props.onProfileUpdate(updatedStallProfile);
        }

        alert("資料更新成功");
        navigate(`/vendor/${stallProfile.vid}/vendorInfo`);
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      // 在這裡處理錯誤，例如顯示錯誤消息
      console.error("Error updating data:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
    }
  };

  return (
    <>
      <SubTitleYellow title="攤位資訊" />
      <Form
        noValidate
        validated={validated}
        onSubmit={handleSubmit}
        className="my-5"
      >
        <Form.Group as={Row} controlId="validationCustom00" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌Logo
          </Form.Label>
          <Col sm="6">
            <Form.Control
              type="file"
              name="logo_img"
              accept="image/png, image/jpeg"
            />
            <Form.Text muted>檔案類型限PNG或JPG</Form.Text>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="validationCustom01" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌名稱
          </Form.Label>
          <Col sm="6">
            <Form.Control
              type="text"
              placeholder={stallProfile.brand_name}
              name="brand_name"
              value={stallData.brand_name}
              onChange={handleInputChange}
              isInvalid={brandNameError}
            />
            <Form.Text muted>字數限30字以內</Form.Text>
            <Form.Control.Feedback type="invalid">
              請輸入30字以內品牌名稱
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="validationCustom02" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌類型
          </Form.Label>
          <Col sm="6">
            <Form.Select
              name="brand_type"
              style={{ width: "8rem" }}
              onChange={handleInputChange}
            >
              <option>選擇類型</option>
              <option value="clothing">服飾</option>
              <option value="accessories">飾品</option>
              <option value="handmade">手作</option>
              <option value="food">美食</option>
              <option value="pet">寵物</option>
              <option value="others">其他</option>
            </Form.Select>
            <Form.Control.Feedback type="invalid">
              請選擇品牌類型
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌標籤
          </Form.Label>
          <Col sm="6">
            <InputGroup>
              <Form.Control
                type="text"
                style={{ width: "8rem" }}
                id="validationCustom03"
                placeholder={stallProfile.tag1}
                name="tag1"
                value={stallData.tag1}
                onChange={handleInputChange}
                isInvalid={tag1Error}
              />
              <Form.Control
                type="text"
                style={{ width: "8rem" }}
                id="validationCustom04"
                placeholder={stallProfile.tag2}
                name="tag2"
                value={stallData.tag2}
                onChange={handleInputChange}
                isInvalid={tag2Error}
              />
            </InputGroup>
            <Form.Text muted>字數限6字以內</Form.Text>
            <Form.Control.Feedback type="invalid" tooltip>
              請輸入6個字以內品牌標籤
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="validationCustom05" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌ＦＢ
          </Form.Label>
          <Col sm="6">
            <Form.Control
              type="text"
              placeholder={stallProfile.fb}
              name="fb"
              value={stallData.fb}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              網址過長，請先縮短網址至250字以內
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="validationCustom06" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌ＩＧ
          </Form.Label>
          <Col sm="6">
            <InputGroup>
              <Form.Control
                type="text"
                placeholder={stallProfile.ig}
                name="ig"
                value={stallData.ig}
                onChange={handleInputChange}
              />
              <Form.Control.Feedback type="invalid">
                網址過長，請先縮短網址至250字以內
              </Form.Control.Feedback>
            </InputGroup>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="validationCustom07" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌官網
          </Form.Label>
          <Col sm="6">
            <Form.Control
              type="text"
              placeholder={stallProfile.web}
              name="web"
              value={stallData.web}
              onChange={handleInputChange}
            />
            <Form.Control.Feedback type="invalid">
              網址過長，請先縮短網址至250字以內
            </Form.Control.Feedback>
          </Col>
        </Form.Group>

        <Form.Group as={Row} controlId="validationCustom08" className="mb-3">
          <Form.Label column sm="2" className="text-end">
            品牌描述
          </Form.Label>
          <Col sm="6">
            <Form.Control
              as="textarea"
              rows={10}
              placeholder={stallProfile.content}
              name="content"
              value={stallData.content}
              onChange={handleInputChange}
              isInvalid={contentError}
            />
            <Form.Text muted>字數限300字以內</Form.Text>
            <Form.Control.Feedback type="invalid">
              請輸入300字以內品牌描述
            </Form.Control.Feedback>
          </Col>
        </Form.Group>
        <Form.Group as={Row} controlId="validationCustom09" className="mb-5">
          <Form.Label column sm="2" className="text-end">
            品牌視覺照
          </Form.Label>
          <Col sm="9">
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
          <Col sm="8">
            <div className="d-flex justify-content-center">
              <Button
                className="me-5 bg-white"
                variant="bg-white border border-2 c-gray rounded-pill px-4 py-2"
                type="button"
                onClick={() => {
                  alert("確定要取消變更嗎？");
                  navigate(`/vendor/${stallProfile.vid}/vendorInfo`);
                }}
              >
                取消變更
              </Button>
              <Button
                className="ms-5"
                variant=" bg-blueGray text-white rounded-pill px-4 py-2"
                type="submit"
              >
                儲存變更
              </Button>
            </div>
          </Col>
        </Row>
      </Form>
    </>
  );
};

export default EditStallProfile;
