import { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import styles from "./VendorDetail.module.scss";

const VendorDetail = ({data_from_parent}) => {
  const [data, setData] = useState();
  
  //useEffect用於畫面上有變化時動態更新資料
  useEffect(() => {
    const getData = async (vinfo) => {
      try {
        const response = await axios.get("http://localhost:8000/getdata",
        {params: {vinfo}});
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getData();
  }, []);
      
      //輪播容器
  useEffect(() => {
    if (!data) return;
    //選擇按鈕、圖片容器元素
    const indicatorsContainer = document.getElementById("carousel-indicators");
    const imageContainer = document.getElementById("carousel-inner");

    if (!indicatorsContainer) return;
    //每次動態生成前先清空容器內容
    indicatorsContainer.innerHTML = "";
    imageContainer.innerHTML = "";

    
    //圖片src清單
    var imageList = [
      data.data_from_server[0].brand_img01,
      data.data_from_server[0].brand_img02,
      data.data_from_server[0].brand_img03,
      data.data_from_server[0].brand_img04,
      data.data_from_server[0].brand_img05,
    ];

    if(data_from_parent.length != 0) {
      imageList = [
        data_from_parent[0].brand_img01,
        data_from_parent[0].brand_img02,
        data_from_parent[0].brand_img03,
        data_from_parent[0].brand_img04,
        data_from_parent[0].brand_img05
      ];
    }
    

    console.log(data_from_parent[0]);
    console.log( data.data_from_server[0]);
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
        cimage.src = `data:image/jpeg;base64,${Buffer.from(image).toString("base64")}`;
        cimage.className = "d-block w-100 carousel";
        cimage.alt = "...";
        //圖片添加到容器
        cimagecontainer.appendChild(cimage);
        //圖片容器添加到父元素容器
        imageContainer.appendChild(cimagecontainer);
      }
    });
  }, [data, data_from_parent]);

  if (!data) {
    return <p>Loading</p>;
  }

  //攤位名稱
  var brandName = data.data_from_server[0].brand_name;
  if(data_from_parent.length != 0) {
    brandName = data_from_parent[0].brand_name;
  };
  //攤位簡介
  var vendorContent = data.data_from_server[0].content;
  if(data_from_parent.length != 0) {
    vendorContent = data_from_parent[0].content;
  };
  return (
    <div id="shop">
      <div id="shop_nav">
        <div id="brand_logo"></div>
        <h3 id="brand_name">{brandName}</h3>
      </div>
      {/* //輪播圖 */}
      <div className={`w-100 overflow-hidden rounded-4 ${styles.carousel}`}>
        <div
          id="carouselExampleIndicators"
          className="carousel slide w-100"
          data-bs-ride="carousel"
          data-bs-interval="3000" //控制播放
        >
          {/* 輪播按鈕 */}
          <div className="carousel-indicators" id="carousel-indicators"></div>
          {/* 輪播圖片 */}
          <div className="carousel-inner" id="carousel-inner"></div>
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
      <br />
      <div id="shop_detail">
        <p>{vendorContent}</p>
      </div>
      <div id="shop_btn">
        
      </div>
    </div>
  );
};
export default VendorDetail;
