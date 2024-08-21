import { Table, Card } from "react-bootstrap";
import CheckOutItem from "./CheckOutItem";

const CheckOutCard = ({groupedProducts}) => {
  // console.log(groupedProducts);
  return (
    <>
      {Object.entries(groupedProducts).map(([vinfo, products]) => (
        <Card className="my-5" key={vinfo}>
          <Card.Body>
            <Table borderless>
              <thead>
                <tr>
                  <th colSpan="5">{products[0].brand_name}</th>
                </tr>
                <tr className="border-bottom">
                  <th className="text-center">商品</th>
                  <th className="text-center">單價</th>
                  <th className="text-center">數量</th>
                  <th className="text-center">小計</th>
                </tr>
              </thead>
                <tbody>
                  <CheckOutItem products={products} />
                </tbody>
            </Table>
          </Card.Body>
        </Card>
      ))}
    </>
  );
};

export default CheckOutCard;