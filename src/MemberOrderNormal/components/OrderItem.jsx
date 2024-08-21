import { Row, Col, Image } from "react-bootstrap";
import styles from "../components/OrderItem.module.scss";

const OrderItem = (props) => {
  const { item } = props;
  return (
    <>
      <Row className="mb-3">
        <Col xs={2}>
          <div className={styles.imgContainer}>
            <Image
              src={item.productData.productImage}
              className={styles.productImg}
            />
          </div>
        </Col>
        <Col xs={6}>
          <h5>{item.productData.name}</h5>
          <p className="mb-0">x {item.amount}</p>
        </Col>
        <Col xs={4} className="text-end">
          <h5>NT$ {item.productData.price * item.amount}</h5>
        </Col>
      </Row>
    </>
  );
};
export default OrderItem;
