import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Form from "react-bootstrap/Form";

const EditProduct = () => {
  // 重新導向功能
  const navigate = useNavigate();

  const { vid, pid } = useParams();
  const [loading, setLoading] = useState(true);
  // 資料庫抓出來的
  const [productInfo, setProductInfo] = useState(null);

  useEffect(() => {
    const fetchProductInfo = async () => {
      setLoading(true);
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/theProduct/${pid}`
        );
        setProductInfo(response.data);
      } catch (error) {
        console.error("Error fetching Products Data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductInfo();
  }, [pid]);

  console.log("productInfo: ", productInfo);

  // 重抓攤位資訊
  // const refetchProductInfo = async (updatedData = null) => {
  //   if (updatedData) {
  //     setProductInfo((prevProfile) => ({ ...prevProfile, ...updatedData }));
  //   } else {
  //     try {
  //       const response = await axios.get(
  //         `http://localhost:3200/vendor/theProduct/${pid}`
  //       );
  //       setProductInfo(response.data);
  //     } catch (error) {
  //       console.error("Error refetching ProductInfo:", error);
  //     }
  //   }
  // };

  const [itemData, setItemData] = useState({
    is_show: "",
    name: "",
    quantity: "",
    price: "",
    content: "",
    img01: "",
  });

  // 管理預覽圖片的狀態
  // const [previewImages, setPreviewImages] = useState({
  //   img01: null,
  // });

  // 當 productInfo 加載完成後，更新 previewImages
  // useEffect(() => {
  //   setPreviewImages({
  //     img01: productInfo.img01 || null,
  //   });
  // }, [productInfo]);

  // 點擊圖片區域來觸發文件選擇
  // const fileInputRefs = {
  //   img01: useRef(null),
  // };

  // 創建一個預覽並更新 itemData 和 previewImages
  // const handleImageUpload = (event, fieldName) => {
  //   const file = event.target.files[0];
  //   if (file && (file.type === "image/jpeg" || file.type === "image/png")) {
  //     const reader = new FileReader();
  //     reader.onloadend = () => {
  //       setPreviewImages((prev) => ({ ...prev, [fieldName]: reader.result }));
  //       setItemData((prev) => ({ ...prev, [fieldName]: reader.result }));
  //     };
  //     reader.readAsDataURL(file);
  //   }
  // };

  // 為每個圖片欄位渲染上傳區域
  // const renderImageUpload = (fieldName) => {
  //   return (
  //     <div
  //       className="position-relative"
  //       style={{ width: "210px", height: "150px", cursor: "pointer" }}
  //       // onClick={() => fileInputRefs[fieldName].current.click()}
  //     >
  //       {previewImages[fieldName] ? (
  //         <img
  //           src={previewImages[fieldName]}
  //           alt={`商品照片 ${fieldName}`}
  //           className="w-100 h-100 object-fit-cover rounded"
  //         />
  //       ) : (
  //         <div className="w-100 h-100 bg-gray d-flex justify-content-center align-items-center rounded">
  //           <i className="bi bi-plus-lg fs-1 c-white"></i>
  //         </div>
  //       )}
  //       <input
  //         type="file"
  //         // ref={fileInputRefs[fieldName]}
  //         style={{ display: "none" }}
  //         accept="image/png, image/jpeg"
  //         onChange={(e) => handleImageUpload(e, fieldName)}
  //       />
  //     </div>
  //   );
  // };

  // 表單是否已經被驗證
  const [validated, setValidated] = useState(false);
  // 商品名稱驗證狀態
  const [itemNameError, setItemNameError] = useState(false);

  // 有 change => 更新 state
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setItemData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));

    if (name === "name" && value !== "") {
      setItemNameError(!validateItemName(value));
    } else if (name === "name" && value === "") {
      setItemNameError(false);
    }
  };

  const validateItemName = (name) => {
    return name.length <= 20;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();

    // 添加所有字段，包括圖片（現在是 Base64 字符串）
    Object.keys(itemData).forEach((key) => {
      formData.append(key, itemData[key]);
    });

    let isValid = true;

    if (itemData.name && !validateItemName(itemData.name)) {
      setItemNameError(true);
      isValid = false;
    }

    if (!isValid) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // 把有改變且與原始數據不同的項目打包成一個新物件 updatedFields
      const updatedFields = Object.keys(itemData).reduce((acc, key) => {
        if (itemData[key] !== "" && itemData[key] !== productInfo[key]) {
          acc[key] = itemData[key];
        }
        return acc;
      }, {});

      console.log("Sending update request with:", updatedFields);
      const response = await axios.put(
        `http://localhost:3200/vendor/theProduct/${productInfo.pid}`,
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

        const updatedProductInfo = { ...productInfo, ...updatedFields };

        // 更新表單狀態
        setItemData((prevState) => ({
          ...prevState,
          ...updatedFields,
        }));

        // 更新 productInfo
        // refetchProductInfo(updatedProductInfo);

        alert("資料更新成功");
        navigate(`/vendor/${productInfo.vid}/products`);
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

  if (loading) return <p>Loading...</p>;

  return (
    <Form
      noValidate
      validated={validated}
      onSubmit={handleSubmit}
      className="my-5"
    >
      <Form.Group as={Row} className="mb-3">
        <Form.Label column sm="2" className="text-end">
          立即上架
        </Form.Label>
        <Col sm="8" className="d-flex align-items-center">
          {/* <Form.Control
            type="radio"
            name="is_show"
            value={1}
            id="is_show_true"
          /> */}
          <input
            type="radio"
            value={1}
            name="is_show"
            id="is_show_true"
            checked={productInfo.is_show ? "checked" : ""}
          />
          &nbsp;<label htmlFor="is_show_true">是</label>
          &nbsp;&nbsp;&nbsp;&nbsp;
          {/* <Form.Control
            type="radio"
            name="is_show"
            value={0}
            id="is_show_false"
            /> */}
          <input
            type="radio"
            value={0}
            name="is_show"
            id="is_show_false"
            checked={!productInfo.is_show ? "checked" : ""}
          />
          &nbsp;<label htmlFor="is_show_false">否</label>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="productName" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          商品名稱
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="text"
            placeholder={productInfo.name}
            name="name"
            // value={stallData.brand_name}
            // onChange={handleInputChange}
            // isInvalid={brandNameError}
          />
          <Form.Text muted>字數限20字以內</Form.Text>
          <Form.Control.Feedback type="invalid">
            請輸入20字以內
          </Form.Control.Feedback>
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="productQuantity" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          商品數量
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="number"
            name="quantity"
            placeholder={productInfo.quantity}
            max="250"
            style={{ width: "8rem" }}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="productPrice" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          商品價格
        </Form.Label>
        <Col sm="8">
          <Form.Control
            type="number"
            name="price"
            placeholder={productInfo.price}
            style={{ width: "8rem" }}
            // value={stallData.tag2}
            // onChange={handleInputChange}
          />
        </Col>
      </Form.Group>

      <Form.Group as={Row} controlId="productContent" className="mb-3">
        <Form.Label column sm="2" className="text-end">
          商品介紹
        </Form.Label>
        <Col sm="8">
          <Form.Control
            as="textarea"
            rows={10}
            placeholder={productInfo.content}
            name="content"
            // value={stallData.content}
            // onChange={handleInputChange}
            // isInvalid={contentError}
          />
          <Form.Text muted>字數限250字以內</Form.Text>
          <Form.Control.Feedback type="invalid">
            請輸入250字以內商品介紹
          </Form.Control.Feedback>
        </Col>
      </Form.Group>
      <Form.Group as={Row} controlId="productImages" className="mb-5">
        <Form.Label column sm="2" className="text-end">
          商品照片
        </Form.Label>
        <Col sm="10">
          <div
            className="d-flex flex-wrap gap-3"
            style={{ width: "210px", height: "150px" }}
          >
            {/* {renderImageUpload("img01")} */}
            {/* <img src={productInfo.img01} alt="商品照片" /> */}
            <img
              src={productInfo.img01}
              alt="商品照片"
              className="w-100 h-100 object-fit-cover rounded"
            />
          </div>
          <Form.Text muted>檔案類型限PNG或JPG</Form.Text>
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
                navigate(-1);
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
  );
};

export default EditProduct;
