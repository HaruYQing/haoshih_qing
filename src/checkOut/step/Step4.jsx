import React, { useState, useEffect } from "react";
import { Button, Col, Modal, Container, Card } from "react-bootstrap";
import NavBarShop from "../../components/NavBarShop";
import Arrow from "../../components/Arrow";
import Footer from "../../components/Footer";
import ChatBtn from "../../components/ChatBtn";

const Step4 = () => {
  const [paymentStatus, setPaymentStatus] = useState("processing");
  const [showErrorModal, setShowErrorModal] = useState(false);
  const cartVisible = false;
  const detail = JSON.parse(localStorage.getItem("detail"));
  const send_data = JSON.parse(localStorage.getItem("send_data"));
  console.log("打包成功!", detail, send_data);

  useEffect(() => {
    // 從 URL 讀取狀態參數
    const urlParams = new URLSearchParams(window.location.search);
    const status = urlParams.get("status");

    if (status === "success" || status === "failed") {
      setPaymentStatus(status);
      if (status === "failed") {
        setShowErrorModal(true);
      }
    } else {
      // 如果 URL 中沒有有效的狀態，則模擬付款過程
      const simulatePayment = setTimeout(() => {
        const isSuccessful = Math.random() > 0.3; // 70% 成功率
        setPaymentStatus(isSuccessful ? "success" : "failed");
        if (!isSuccessful) {
          setShowErrorModal(true);
        }
      }, 3000);

      return () => clearTimeout(simulatePayment);
    }
  }, []);

  const handleCloseErrorModal = () => setShowErrorModal(false);

  return (
    <>
      <NavBarShop cartVisible={cartVisible} />
      <div className="f-space-around">
        <Arrow color="green" title="確認商品" />
        <Arrow color="green" title="寄送資訊" />
        <Arrow color="green" title="付款方式" />
        <Arrow color="yellow" title="完成訂單" />
      </div>
      <Container>
        <Card className="border p-5 my-5">
          {paymentStatus === "processing" && (
            <div className="text-center">
              <h2>正在處理您的付款...</h2>
              <p>請稍候，不要關閉或重新整理頁面。</p>
            </div>
          )}
          {paymentStatus === "success" && (
            <div className="text-center">
              <img src="stickers/003.png" alt="成功圖標" />
              <h2 className="text-success ">付款成功！</h2>
              <p>感謝您的購買。您的訂單已經成功完成。</p>
              <p>我們將盡快處理您的訂單並安排發貨。</p>
            </div>
          )}
          {paymentStatus === "failed" && (
            <div className="text-center">
              <img src="stickers/022.png" alt="失敗圖標" />
              <h2 className="text-danger">付款失敗</h2>
              <p>很抱歉，您的付款未能成功處理。</p>
              <p>請檢查您的付款資訊並重試，或選擇其他付款方式。</p>
            </div>
          )}
        </Card>

        <Col className="f-end">
          <Button
            className="bg-white border border-red me-3"
            variant="border border-2 rounded-pill px-4"
            type="button"
          >
            <a href="/step3" className="c-black text-decoration-none">
              回上一步
            </a>
          </Button>
          <Button
            className="rounded-pill px-4 py-2 bg-secondary  border border-2"
            type="button"
          >
            <a href="/member/1/order" className="c-black text-decoration-none">
              我的訂單
            </a>
          </Button>
        </Col>
      </Container>
      <Footer />
      <ChatBtn />

      <Modal show={showErrorModal} onHide={handleCloseErrorModal}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">付款失敗</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          很抱歉，您的付款未能成功處理。請檢查您的付款資訊並重試，或選擇其他付款方式。
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            className="rounded-pill"
            onClick={handleCloseErrorModal}
          >
            關閉
          </Button>
          <Button
            variant="primary"
            className="rounded-pill"
            onClick={() => window.history.back()}
          >
            返回付款頁面
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Step4;
