import SubTitleYellow from "../components/SubTitleYellow";
import OrderCard from "./components/OrderCard";
import { Form, Row, Col, Container } from "react-bootstrap";
import { useState } from "react";

const MemberOrderNormal = (props) => {
  const { orderData } = props;
  const [formData, setFormData] = useState({
    sortByOrderTime: "1",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value.trim(),
    }));
  };

  return (
    <>
      <SubTitleYellow title="我的訂單" />
      <Container className="p-5">
        <Row className="f-end">
          <Col xs="auto">
            {/* 抓取sortByOrderTime的value值，顛倒訂單順序 */}
            <Form.Select
              aria-label="Default select example"
              className="select-auto-width"
              name="sortByOrderTime"
              onChange={handleInputChange}
            >
              <option>訂購日期</option>
              <option value="1">新 → 舊</option>
              <option value="2">舊 → 新</option>
            </Form.Select>
          </Col>
        </Row>
        {/* 有好幾筆訂單，所以要用map */}
        {formData.sortByOrderTime === "2"
          ? orderData
              .toReversed()
              .map((order) => <OrderCard key={order.oid} orderData={order} />)
          : orderData.map((order) => (
              <OrderCard key={order.oid} orderData={order} />
            ))}
      </Container>
    </>
  );
};
export default MemberOrderNormal;
