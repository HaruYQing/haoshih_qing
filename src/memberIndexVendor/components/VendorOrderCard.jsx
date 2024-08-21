import React from "react";
import { Card, Container, Row, Col, Button } from "react-bootstrap";
import VendorOrderItem from "./VendorOrderItem";

const VendorOrderCard = (props) => {
  // 這裡拿到的是一張訂單
  const { orderData } = props;
  // 這是訂單中的品項陣列
  const itemData = orderData.detail.item;

  return (
    <Container className="mt-4">
      <Card>
        <Card.Header className="bg-white">
          <Row>
            <Col className="f-start">
              <h4 className="mb-0 d-inline-block">訂單編號：{orderData.oid}</h4>
              <p className="c-gray ms-auto me-3 mb-0">
                訂購日期：{orderData.formatted_order_time}
              </p>
            </Col>
          </Row>
        </Card.Header>
        <Card.Body>
          {itemData.map((item) => (
            <VendorOrderItem key={item.pid} item={item} />
          ))}

          {/* Order total */}
          <Row className="mt-4">
            <Col className="text-end">
              <p className="c-gray">付款方式：{orderData.payment}</p>
              <p className="c-gray">訂單狀態：{orderData.status}</p>
              <h5 className="text-red">
                訂單總額：NT$ {orderData.detail.total}
              </h5>
            </Col>
          </Row>

          {/* Delivery info */}
          <Row className="c-gray">
            <Col>
              <p>收件資訊</p>
              <p>收件人：{orderData.send_data.fullName}</p>
              <p>電話：{orderData.send_data.phone}</p>
              <p>
                地址：
                {orderData.send_data.address.postNum +
                  orderData.send_data.address.city +
                  orderData.send_data.address.district +
                  orderData.send_data.address.address}
              </p>
            </Col>
          </Row>
          <Col className="text-end">
            <Button className="rounded-pill px-3 border border-2 bg-white c-gray me-2 hover-bg-blueGray hover-c-white">
              取消訂單
            </Button>
            {/* <Button className="rounded-pill px-3 border border-2 bg-white c-gray hover-bg-blueGray hover-c-white">
            聯絡攤主
          </Button> */}
          </Col>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default VendorOrderCard;
