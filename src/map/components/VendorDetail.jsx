import { useEffect, useState } from "react";
import axios from "axios";
import { Buffer } from "buffer";
import styles from "./VendorDetail.module.scss";
const VendorDetail = ({data_from_parent,vendor_number}) => {
  var [data, setData] = useState();
  //useEffect用於畫面上有變化時動態更新資料
  useEffect(() => {
    const getData = async (vinfo) => {
      try {
        const response = await axios.get("http://localhost:3200/map/getdata", {
          params: { vinfo },
        });
        setData(response.data);
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getData();
  }, []);
  //輪播、標籤設置
  useEffect(() => {
    if (!data) return;
    //選擇按鈕、圖片容器
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
    if (data_from_parent.length !== 0) {
      imageList = [
        data_from_parent[0].brand_img01,
        data_from_parent[0].brand_img02,
        data_from_parent[0].brand_img03,
        data_from_parent[0].brand_img04,
        data_from_parent[0].brand_img05,
      ];
    }
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
    //選擇標籤容器
    const tagContainer = document.getElementById("tagContainer");
    //每次動態生成前先清空元素內容
    tagContainer.innerHTML = "";
    //攤位標籤清單
    var tagList = [
      data.data_from_server[0].tag1,
      data.data_from_server[0].tag2
    ];
    if(data_from_parent.length !== 0) {
      tagList = [
        data_from_parent[0].tag1,
        data_from_parent[0].tag2
      ];
    };
    //tag顏色表
    const colorPalette = [
      "#00a381",  // 顏色 1
      "#b7efe0",  // 顏色 2
      "#f8e7e5",  // 顏色 3
      "#9e9e9e",  // 顏色 4
      "#f7ea57",  // 顏色 5
      "#5a79ba",  // 顏色 6
      "#a58f86",  // 顏色 7
      "#b8cd1d",  // 顏色 8
      // "linear-gradient(120deg, #a1c4fd 0%, #c2e9fb 100%)", //顏色9
    ];
    
    function getRandomColorFromPalette() {
      const randomIndex = Math.floor(Math.random() * colorPalette.length);
      return colorPalette[randomIndex];
    }

    //使用forEach迴圈生成攤位標籤
      tagList.forEach(tag => {
        if(tag !== null) {
          const brand_tag = document.createElement('span');
          const randomColor = getRandomColorFromPalette();
          brand_tag.className = `${styles.tagSpan}`;
          brand_tag.innerText = `#${tag}`;
          brand_tag.style.setProperty('--tag-background-color', randomColor); 
          brand_tag.style.backgroundColor = randomColor; 
          tagContainer.appendChild(brand_tag);
        };
      });
  }, [data, data_from_parent]);

  if (!data) {
    return <p>Loading</p>;
  }

  
  //攤位名稱
  var brandName = data.data_from_server[0].brand_name;
  if (data_from_parent.length !== 0) {
    brandName = data_from_parent[0].brand_name;
  }
  //攤位簡介
  var vendorContent = data.data_from_server[0].content;
  if (data_from_parent.length !== 0) {
    vendorContent = data_from_parent[0].content;
  }
  //攤位類別，中英對照表
  const brandTypeList = {
    'clothing':'服飾',
    'accessories':'飾品',
    'handmade':'手作',
    'food':'美食',
    'pet':'寵物',
    'others':'其他'
  }
  //攤位類別
  var brandType = data.data_from_server[0].brand_type;
  if (data_from_parent.length !== 0) {
    brandType = data_from_parent[0].brand_type;
  }
  //攤位vinfo
  var brandVinfo = data.data_from_server[0].vinfo;
  if (data_from_parent.length !== 0) {
    brandVinfo = data_from_parent[0].vinfo
  }
  //攤位社群連結FB、IG、網頁
  var brandFB = data.data_from_server[0].fb;
  if (data_from_parent.length !== 0) {
    brandFB = data_from_parent[0].fb
  }
  var brandIG = data.data_from_server[0].ig;
  if (data_from_parent.length !== 0) {
    brandIG = data_from_parent[0].ig
  }
  var brandWeb = data.data_from_server[0].web;
  if (data_from_parent.length !== 0) {
    brandWeb = data_from_parent[0].web
  }
  
  return (
    <div id="shop">
      <div className="f-row-center" id="shopnav">
        <h2 className="c-blueGray fw-bold flex-5 pad-5" id="brand_name">
          {vendor_number}  {brandName}
        </h2>
        <h5 className="c-gray fw-600 flex-1 f-right" id="brand_type">
          {brandTypeList[`${brandType}`]}
        </h5>
      </div>
      <div className="f-row-end" id="tagContainer">
      </div>
      <br />
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
        <p className="fs-content fw-530">{vendorContent}</p>
      </div>
      <div id="shop_link">
        <a className={styles.seeMore} href={`http://localhost:3000/shop/${brandVinfo}`}>
          <p className="fw-500">查看攤位→</p>
        </a>
      </div>
      <div className=" d-flex justify-content-end fs-3 d-grid gap-3 ">
              <a className="text-black-50" href={brandFB} target="_blank">
                <i className="bi bi-facebook"></i>
              </a>
              <a className="text-black-50" href={brandIG} target="_blank">
                <i className="bi bi-instagram "></i>
              </a>
              <a className="text-black-50" href={brandWeb} target="_blank">
                <i className="bi bi-globe"></i>
              </a>
      </div>
    </div>
  );
};
export default VendorDetail;
