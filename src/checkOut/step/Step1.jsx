import NavBarShop from "../../components/NavBarShop";
import Arrow from "../../components/Arrow";
import Footer from "../../components/Footer";
import ChatBtn from "../../components/ChatBtn";
import CheckOutCard from "../CheckOutCard";
import { Button } from "react-bootstrap";
import { turnPrice } from "../../utils/turnPrice";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Col from "react-bootstrap/Col";

const Step1 = () => {
  const [productsData, setProductsData] = useState(null);
  const [useProducts, setUseProducts] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);

  const data = queryParams.get("data");
  // console.log(data);
  const navigate = useNavigate();
  const cartVisible = false;

  let products = [];

  if (data) {
    try {
      products = JSON.parse(data);
      // console.log(products);
    } catch (error) {
      console.error("Error parsing data:", error);
    }
  }
  
  useEffect(() => {
    const fetchProductsData = async () => {
      try {
        const fetchedData = [];
        for (let i = 0; i < products.length; i++) {
          const response = await axios.get(
            `http://localhost:3200/carts/products/${products[i].pid}/1`
          );
          fetchedData.push(response.data[0]); // 只取第一個元素
        }
        setProductsData(fetchedData);

        // 合併資料
        const useProducts = products.map((item, index) => ({
          pid: item.pid,
          amount: item.amount,
          ...fetchedData[index],
        }));

        setUseProducts(useProducts);

        // 計算總金額
        const total = useProducts.reduce(
          (sum, product) => sum + product.price * product.amount,
          0
        );
        setTotalPrice(total);
      } catch (error) {
        console.error("Error fetching Products Data:", error);
      }
    };
    fetchProductsData();
  }, [data]);

  const groupedProducts = useProducts.reduce((acc, product) => {
    const { vinfo } = product;
    if (!acc[vinfo]) {
      acc[vinfo] = [];
    }
    acc[vinfo].push(product);
    return acc;
  }, {});

  const total = {total: totalPrice};


  const handleCheckout = () => {
    localStorage.setItem("Step1Data", JSON.stringify(useProducts));
    localStorage.setItem("total", JSON.stringify(total));
    navigate("/Step2");
    console.log(useProducts);
    
  };

  if (!productsData){
    return <div>Loading...</div>;
  }


  return (
    <>
      <NavBarShop cartVisible={cartVisible} />
      <div className="f-space-around">
        <Arrow color="yellow" title="確認商品" />
        <Arrow color="white" title="寄送資訊" />
        <Arrow color="white" title="付款方式" />
        <Arrow color="white" title="完成訂單" />
      </div>
      <div className="container">
        <CheckOutCard groupedProducts={groupedProducts} />
        <div className="f-end-end mt-5 gap-3 ">
          <Col className="d-flex justify-content-end align-items-end">
            <div className="fs-4">總金額：NT{turnPrice(totalPrice)}</div>
            <Button
              className="bg-white border border-red me-3 ms-2"
              variant="border border-2 rounded-pill px-4"
              type="button"
              onClick={() => navigate(-1)}
            >
              回上一步
            </Button>
            <Button
              className="rounded-pill px-4 py-2 bg-secondary c-black border border-2"
              onClick={handleCheckout}
            >
              下一步
            </Button>
          </Col>
        </div>
      </div>
      <Footer />
      <ChatBtn />
    </>
  );
};
export default Step1;
