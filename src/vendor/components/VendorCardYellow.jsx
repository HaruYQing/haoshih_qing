import styles from "./VendorCard.module.scss";
import { useState, useEffect } from "react";
import axios from 'axios';
import { Buffer } from 'buffer';
import { turnPrice } from "../../utils/turnPrice";

const VendorCard = ({ params, productDetail, showProduct, type }) => {
  const [vendorData, setVendorData] = useState([])
  // console.log(params.vid); 檢查是哪一個攤販
  // console.log(type)
  useEffect(() => {
    const fetchVendorData = async () => {
      try {
        const response = await axios.get(`http://localhost:3200/shop/${params.vid}/products/${type}`);
        setVendorData(response.data);
        // console.log(response.data)
      } catch (error) {
        console.error("Error fetching Vendor Data:", error);
      }
    };
    fetchVendorData();
  }, [type]);

  if (!vendorData) {
    return <tr><td colSpan="5">Loading...</td></tr>;
  }

  return (
    <>
      {vendorData.map((product, index) => {
        const imageData = product.img01;
        const base64String = Buffer.from(imageData.data).toString('base64');
        const imgSrc = `data:image/jpeg;base64,${base64String}`;

        return (
          <div className="col-3" key={index}>
            <div className={`card ${styles.cardBg} cursor-pointer`}
              onClick={() => {
                productDetail(product)
                showProduct()
              }}>
              <img
                className="rounded-3 overflow-hidden mx-3 mt-3"
                src={imgSrc}
                alt=""
              />
              <div className="card-body">
                <h5 className={`fw-bold card-title ${styles.cardTitle} text-center`}>
                  {product.name}
                </h5>
                <p className="fw-bold card-text text-center c-red">NT{turnPrice(product.price)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </>
  );
};
export default VendorCard;
