import React, { useEffect, useState } from "react";
import { Modal, Button, InputGroup, FormControl } from "react-bootstrap";
import styled from "styled-components";
import { X, Dash, Plus, Cart } from "react-bootstrap-icons";
import { Buffer } from "buffer";
import axios from "axios";
import { turnPrice } from "../../utils/turnPrice";
// import { Alert } from "bootstrap";
import { useNavigate } from "react-router-dom";

const StyledModal = styled(Modal)`
  .modal-content {
    border-radius: 15px;
    border: 1px solid rgba(158, 158, 158, 0.5);
    background: #fff;
    width: 950px;
    margin: auto;
  }

  .modal-body {
    display: flex;
    padding: 20px 50px;
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
`;

const CloseButton = styled(Button)`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  color: #000;
  font-size: 1.5rem;
  &:hover {
    color: #666;
    background: none;
  }
`;

const ProductTitle = styled.h2`
  font-size: 24px;
  font-weight: bold;
  margin-top: 20px;
`;

const ProductPrice = styled.p`
  font-size: 20px;
  color: #ff6b6b;
  font-weight: bold;
`;

const QuantitySelector = styled(InputGroup)`
  width: 150px;
`;

const AddToCartButton = styled(Button)`
  width: 150px;
  background-color: #e7f1ff;
  color: #1f618d;
  border: 2px solid #1f618d;
  &:hover {
    background-color: #1f618d;
  }
`;

const ProductDescription = styled.div`
  border-top: 1px solid #e0e0e0;
  padding-top: 15px;
  margin-top: 15px;
`;

const ProductModal = ({ show, onHide, product}) => {
  const [amount, setAmount] = useState(1);
  // const [amountData, setAmountData] = useState({});
  const [imgSrc, setImgSrc] = useState("");
  // const [isSubmitting, setIsSubmitting] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleQuantityChange = (value) => {
    setAmount(amount + value);
  };
  // console.log("ProductModal 80", product);

  useEffect(() => {
    const imageData = product.img01 || ""; // 提供一个默認值
    if (imageData) {
      const base64String = Buffer.from(imageData).toString("base64");
      setImgSrc(`data:image/jpeg;base64,${base64String}`);
    }
    setAmount(1);
  }, [product.img01]);


  useEffect(() => {
    if (user) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, []); // 空陣列表示只在組件掛載時執行一次

  const handleSubmit = async () => {
    if(showLogin) {

      try {
        // 1. 首先獲取最新的購物車數據
        const cartResponse = await axios.get(`http://localhost:3200/carts/${user.uid}`);
        const cartData = cartResponse.data;
  
        // 2. 查找當前商品在購物車中的數據
        const cartItem = cartData.find((item) => item.pid === product.pid);
        const currentCartAmount = cartItem ? cartItem.amount : 0;

        // 3. 檢查是否超出庫存
        if (amount + currentCartAmount > product.quantity) {
          alert("該商品選購數量已達庫存上限，請至購物車進行數量更改");
          return;
        }
  
        // 4. 提交購物車更新請求
        const response = await axios.post("http://localhost:3200/carts", {
          uid: user.uid,
          pid: product.pid,
          amount:
            amount + currentCartAmount > product.quantity
              ? product.quantity
              : amount,
          quantity: product.quantity,
        });

        console.log("Success:", response.data);
        onHide(); // 成功後關閉彈跳窗

      } catch (error) {
        console.error("Error:", error);
        alert("加入購物車失敗，請稍後再試");
      }

    } else {
      alert('請先登入！')
      navigate("/login");
    }


  };

  return (
    <StyledModal show={show} onHide={onHide} size="lg" centered>
      <Modal.Body>
        <CloseButton onClick={onHide}>
          <X />
        </CloseButton>

        <div style={{ display: "flex" }}>
          <div style={{ width: "400px", flex: "1" }}>
            <img src={imgSrc} className="img-fluid rounded" alt="Loding..." />
          </div>
          <div style={{ flex: "1", marginLeft: "100px" }}>
            <ProductTitle>{product.name}</ProductTitle>
            <ProductPrice>NT$ {turnPrice(product.price)}</ProductPrice>
            <QuantitySelector>
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(-1)}
                disabled={amount <= 1}
              >
                <Dash />
              </Button>
              <FormControl value={amount} className="text-center" readOnly />
              <Button
                variant="outline-secondary"
                onClick={() => handleQuantityChange(1)}
                disabled={amount >= product.quantity}
              >
                <Plus />
              </Button>
            </QuantitySelector>
            <p style={{ marginTop: "10px" }}>庫存 : {product.quantity}</p>
            <p style={{ marginTop: "10px" }}>
              小計 : {turnPrice(amount * product.price)}
            </p>
            <AddToCartButton onClick={handleSubmit}>
              <Cart /> 加入購物車
            </AddToCartButton>
          </div>
        </div>
        <ProductDescription>
          <p>{product.content}</p>
        </ProductDescription>
      </Modal.Body>
    </StyledModal>
  );
};

export default ProductModal;
