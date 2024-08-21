import { Image } from "react-bootstrap";
import { turnPrice } from "../utils/turnPrice";
import { Buffer } from 'buffer';

const CheckOutItem = ({ products }) => {
  return (
    <>
      {products.map(product => {
        const { pid, amount, name, price, img01 } = product;
        const base64String = Buffer.from(img01.data).toString('base64');
        const imgSrc = `data:image/jpeg;base64,${base64String}`;

        return (
          <tr key={pid}>
            <td>
              <div className="f-start">
                <div className="overflow-hidden rounded" style={{ width: "100px", height: "100px" }}>
                  <Image src={imgSrc} alt="商品圖片" className="w-100 h-100 object-fit-cover" />
                </div>
                <span className="ms-3">{name}</span>
              </div>
            </td>
            <td className="text-center align-middle">NT{turnPrice(price)}</td>
            <td className="text-center align-middle">{amount}</td>
            <td className="text-center align-middle">NT{turnPrice(price * amount)}</td>
          </tr>
        );
      })}
    </>
  );
};

export default CheckOutItem;