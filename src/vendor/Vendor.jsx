import { useState, useEffect } from "react";
import { Carousel } from "bootstrap";

import NavBarShop from "../components/NavBarShop";
import styles from "./Vendor.module.scss";
import VendorCard from "./components/VendorCardYellow";
import PageBtn from "../components/PageBtn";
import Footer from "../components/Footer";
import ChatBtn from "../components/ChatBtn";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { Buffer } from "buffer";
import ProductModal from "./components/ProductModal";

const Vendor = () => {
  const [vendor, setVendor] = useState({});
  const params = useParams();
  const [logoImgSrc, setLogoImgSrc] = useState("");
  const cartVisible = 1;
  // console.log(params) // can get vid
  const [showModal, setShowModal] = useState(false); //商品彈窗顯示
  const [product, setProduct] = useState({}); //商品彈窗資料
  const user = JSON.parse(localStorage.getItem("user"));
  const [showLogin, setShowLogin] = useState(false); //有無登入
  const navigate = useNavigate();
  const [sortType, setSortType] = useState(0)
  const type = ["最新上架", "價格高 → 低", "價格低 → 高"]

  useEffect(() => {
    window.scrollTo(0, 0);
    if (user) {
      setShowLogin(true);
    } else {
      setShowLogin(false);
    }
  }, []);

  const fetchVendorData = async () => {
    var url = "http://localhost:3200/shop/vendor/" + params.vid;
    try {
      const response = await axios.get(url);
      setVendor(response.data[0]);
      // 檢查用：數據首次被獲取時顯示
      // console.log("Vendors Data:", response.data[0]);

      const base64String = `data:image/jpeg;base64,${Buffer.from(response.data[0].logo_img.data).toString("base64")}`;
      setLogoImgSrc(base64String);

      // 渲染輪播圖
      //選擇按鈕、圖片容器元素
      const indicatorsContainer = document.getElementById(
        "carousel-indicators"
      );
      const imageContainer = document.getElementById("carousel-inner");
      if (!indicatorsContainer) return;
      //每次動態生成前先清空容器內容
      indicatorsContainer.innerHTML = "";
      imageContainer.innerHTML = "";
      var imageList = [
        response.data[0].brand_img01,
        response.data[0].brand_img02,
        response.data[0].brand_img03,
        response.data[0].brand_img04,
        response.data[0].brand_img05,
      ];
      //使用forEach迴圈生成輪播按鈕、圖片
      imageList.forEach((image, index) => {
        if (image !== null) {
          //生成輪播按鈕
          const cbutton = document.createElement("button");
          cbutton.type = "button";
          cbutton.dataset.bsTarget = "#carouselExampleIndicators";
          cbutton.dataset.bsSlideTo = index;
          cbutton.ariaLabel = `Slide ${index + 1}`;
          if (index === 0) {
            cbutton.classList.add("active");
            cbutton.ariaCurrent = "true";
          }
          //按鈕添加到容器
          indicatorsContainer.appendChild(cbutton);

          //生成輪播圖片
          //圖片容器
          const cimagecontainer = document.createElement("div");
          cimagecontainer.className = "carousel-item";
          if (index === 0) {
            cimagecontainer.classList.add("active");
          }
          //圖片
          const cimage = document.createElement("img");
          cimage.src = `data:image/jpeg;base64,${Buffer.from(image.data).toString("base64")}`;
          cimage.className = "d-block w-100 carousel";
          cimage.alt = "...";
          //圖片添加到容器
          cimagecontainer.appendChild(cimage);
          //圖片容器添加到父元素容器
          imageContainer.appendChild(cimagecontainer);
        }
      });
    } catch (error) {
      console.error("Error fetching vendors data:", error);
    }
  };

  useEffect(() => {
    fetchVendorData();
  }, [params.vid]);

  useEffect(() => {
    if (!vendor) return;
    // console.log("Vendor data updated:", vendor);
  }, [vendor, params.vid]);


  //按讚攤位
  const [likedData, setLikedData] = useState([]);

  useEffect(() => {
    const fetchLikedData = async () => {
      try {
        const response = await axios.get(`http://localhost:3200/shop/like/${user.uid}`);
        setLikedData(response.data);
        // console.log('res',response.data)
      } catch (error) {
        console.error("Error fetching liked data:", error);
      }
    };
    fetchLikedData();
    // console.log('like',likedData)
  }, []); // uid

  // 收藏功能
  const changeHeartList = async () => {
    // console.log('OK')
    if (!showLogin) {
      alert('請先登入！')
      navigate("/login");
    } else {

      var list = []
      if (likedData.includes(vendor.vinfo)) {
        var index = likedData.indexOf(vendor.vinfo)
        list = [...likedData]
        list.splice(index, 1)
        // console.log(list)
        setLikedData(list)
      } else {
        list = [...likedData]
        list.push(vendor.vinfo)
        setLikedData(list)
      }
      let res = await axios.post(`http://localhost:3200/shop/like/${user.uid}`, { list: list })
    }
  }


  return (
    <>
      <NavBarShop cartVisible={cartVisible}/>
      {/* vendorHeader */}
      <div
        className={`p-4 d-flex justify-content-center align-items-center d-grid gap-4 ${styles.header}`}
      >
        <div className="w-100 d-flex align-items-center d-grid gap-3">
          {/* 攤販圖Logo */}
          <div className=" w-25">
            <img
              className="rounded-circle w-100 object-fit-contain "
              // src="https://rhinoshield.tw/cdn/shop/collections/dttofriends-logo.jpg?v=1701837247"
              src={logoImgSrc}
            />
          </div>
          <div className=" w-75">
            {/*攤販資訊} */}
            <div className="d-flex align-items-center">
              <h3>{vendor.brand_name}</h3>
              <i className={`c-red fs-5 bi ${(likedData.includes(vendor.vinfo)) ? 'bi-heart-fill' : 'bi-heart'} px-3 text-black-50 cursor-pointer`}
                onClick={() => { changeHeartList() }}></i>
            </div>
            <p className={`${styles.headerText} overflow-hidden`}>
              {vendor.content}
            </p>
            {/* 攤販link */}
            <div className=" d-flex justify-content-end fs-3 d-grid gap-3 ">
              <a className="text-black-50" href={vendor.fb} target="_blank">
                <i className="bi bi-facebook"></i>
              </a>
              <a className="text-black-50" href={vendor.ig} target="_blank">
                <i className="bi bi-instagram "></i>
              </a>
              <a className="text-black-50" href={vendor.web} target="_blank">
                <i className="bi bi-globe"></i>
              </a>
            </div>
          </div>
        </div>

        {/* carousel */}
        <div className={`w-100 overflow-hidden rounded-4 ${styles.carousel}`}>
          <div
            id="carouselExampleIndicators"
            className="carousel slide w-100"
            data-bs-ride="carousel"
            data-bs-interval="3000" //控制播放
          >
            <div className="carousel-indicators" id="carousel-indicators"></div>
            {/* 輪播圖片 */}
            <div className="carousel-inner " id="carousel-inner"></div>
            {/*  */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="prev"
            >
              <span
                className="carousel-control-prev-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExampleIndicators"
              data-bs-slide="next"
            >
              <span
                className="carousel-control-next-icon"
                aria-hidden="true"
              ></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
        </div>
      </div>
      {/* dropdown */}
      <div className="dropdown text-end my-3 mx-5 ">
        <button
          className="bg-white px-4 py-1 dropdown-toggle rounded-4"
          type="button"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          {type[sortType]}
        </button>
        <ul
          className="dropdown-menu  text-center"
          aria-labelledby="dropdownMenuButton1"
        >
          <li>
            <span className="dropdown-item" onClick={()=>setSortType(0)}>
              最新上架
            </span>
          </li>
          <li>
            <span className="dropdown-item" onClick={()=>setSortType(1)}>
              價格高 → 低
            </span>
          </li>
          <li>
            <span className="dropdown-item" onClick={()=>setSortType(2)}>
              價格低 → 高
            </span>
          </li>
        </ul>
      </div>

      {/* VendorCards */}
      <div className="mb-5">
        <div className="container">
          <div className="row row-gap-4">
            <VendorCard
              params={params}
              type={sortType}
              productDetail={(data) => {
                setProduct(data);
              }}
              showProduct={() => {
                setShowModal(true);
              }}
            />
          </div>
        </div>
      </div>
      {/* <PageBtn /> */}
      <Footer />
      <ChatBtn />
      <ProductModal
        show={showModal}
        onHide={() => setShowModal(false)}
        product={product}
      />
    </>
  );
};

export default Vendor;
