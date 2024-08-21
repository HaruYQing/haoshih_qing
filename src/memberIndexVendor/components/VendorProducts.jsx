import ProductCard from "./ProductCard";
import SubTitleYellow from "../../components/SubTitleYellow";
import Button from "react-bootstrap/Button";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Routes, Route, Outlet } from "react-router-dom";
import EditProduct from "./EditProduct";
import { useNavigate } from "react-router-dom";

const VendorProducts = (props) => {
  const { productsData } = props;
  const navigate = useNavigate();
  const handleNavigation = (vid, pid) => {
    navigate(`/vendor/${vid}/products/edit/${pid}`);
  };

  // 抓單一商品資訊

  const ShowAllProducts = () => {
    return (
      <>
        <div className="d-flex justify-content-end px-5 py-3">
          <Button
            variant="outline-light"
            className="rounded-pill px-4 py-2"
            type="button"
            style={{ border: "2px solid #f06f5f", color: "#f06f5f" }}
          >
            新增商品&nbsp;<i className="bi bi-plus-circle-fill"></i>
          </Button>
        </div>
        <div className="d-flex flex-wrap align-items-center px-5">
          {productsData.map((product, index) => (
            <div
              // key={product.pid}
              className="col-12 col-sm-6 col-md-6 col-lg-6 my-4 d-flex justify-content-center align-items-center"
            >
              <ProductCard
                key={product.pid}
                linkTo={handleNavigation}
                data={product}
              />
            </div>
          ))}
        </div>
      </>
    );
  };

  return (
    <>
      <SubTitleYellow title="商品管理" />
      <div className="col-10 p-4">
        <Routes>
          <Route
            index
            element={productsData ? <ShowAllProducts /> : <p>Loading...</p>}
          />
          <Route path="edit/:pid" element={<EditProduct />} />
        </Routes>
        <Outlet />
      </div>
    </>
  );
};

export default VendorProducts;
