// import { type } from "@testing-library/user-event/dist/type";
import ChatBtn from "../components/ChatBtn";
import Footer from "../components/Footer";
import MainBg from "../components/MainBg";
import NavBarShop from "../components/NavBarShop";
import ThirdTitle from "../components/ThirdTitle";
import MarketFloorPlanB from "../components/MarketFloorPlanB";
import styles from "./setStalls.module.scss";
import React, { useEffect, useState } from "react";
import { Container, Row, Col } from "react-bootstrap";
// import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const SetStalls = () => {
  const [selectedVendors, setSelectedVendors] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("4");
  const [season, setSeason] = useState(4);
  const [season_data, setSeasonData] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  // const [showLogin, setShowLogin] = useState(false); //有無登入
  // const navigate = useNavigate();
  const rentDays = selectedPeriod === "1" ? 65 : 62;
  const handleSelectedChange = (event) => {
    setSelectedPeriod(event.target.value)
    setSeason(event.target.value)
  }
  const handleSelectedVendor = (vendors) => {
    setSelectedVendors(vendors);
  }
  // const handleRentVendor = await () => {
  //   try {
  //     const 
  //   }
  // }  
  useEffect(() => {
    const getSeasonData = async () => {
      try {
        const response = await axios.get(`http://localhost:3200/map/seasondata/${season}`,
        );
        setSeasonData(response.data.season_data.map(item => `${item.postion}0${item.number}`))
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getSeasonData();
  }, [season])
  console.log(season);
  
  const cartVisible = 1;
  //攤位價目表
  const vendorsPrice = {
    'A01': 800,
    'A02': 800,
    'B01': 800,
    'B02': 800,
    'C01': 800,
    'C02': 800,
    'D01': 800,
    'D02': 800,
    'A03': 600,
    'A04': 600,
    'A05': 600,
    'B03': 600,
    'B04': 600,
    'B05': 600,
    'C03': 600,
    'C04': 600,
    'C05': 600,
    'D03': 600,
    'D04': 600,
    'D05': 600
  }
  

  return (
    <div>
      <NavBarShop cartVisible={cartVisible} />
      <MainBg title="我要擺攤" page="setStalls" />
      <Container fluid className="mt-4 bg-white p-5">
        <Row className="d-flex h-100">
          <div className="flex-1 border pt-5 pb-3 pe-0 ps-5">
          <Col>
            <ThirdTitle title="市集平面圖" />
          </Col>
          <MarketFloorPlanB
            className="flex-1"
            fetchData={handleSelectedVendor}
            season_data={season_data}
          ></MarketFloorPlanB>
          </div>
          <Col md={6} className="d-flex flex-1">
            <div className="border p-5" style={{ width: "100%" }}>
              <ThirdTitle title="攤位租金" />
              <div className="d-flex justify-content-between mt-3">
                <div className="d-flex align-items-center">
                  <div
                    className="bg-red me-2"
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                  <span>800元/天</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="bg-secondary me-2"
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                  <span>600元/天</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="bg-lightBlue me-2"
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                  <span>已選攤位</span>
                </div>
                <div className="d-flex align-items-center">
                  <div
                    className="bg-gray me-2"
                    style={{ width: "20px", height: "20px" }}
                  ></div>
                  <span>已出租</span>
                </div>
              </div>
              <hr />
                <div className="d-flex mt-5 mb-2" style={{ fontSize: "20px" }}>
                  <div className="f-start flex-1">
                    <span className="d-flex" style={{ fontSize: "20px" }}>
                      選擇季度：
                    </span>
                    <select
                      className="form-select d-flex flex-1 "
                      style={{ maxWidth: "200px" }}
                      value={selectedPeriod}
                      onChange={handleSelectedChange}
                    >
                      <option value="4">2024/10-2024/12</option>  
                      <option value="1">2025/1-2025/3</option>
                    </select>
                  </div>
                </div>
                <div>
                  <p style={{ fontSize: "20px" }}>已選攤位：{selectedVendors}</p>
                </div>
                <div>
                  <p className="" style={{ fontSize: "20px" }}>
                    攤位價格：{vendorsPrice[`${selectedVendors}`]}元/天
                  </p>
                </div>
                <div>
                  <p className="" style={{ fontSize: "20px" }}>
                    租用天數：{rentDays}天(周一周二休市)
                  </p>
                </div>
                <div className="form-dec">
                  <span className="" style={{ fontSize: "20px" }}>
                    總計金額：{(vendorsPrice[`${selectedVendors}`] ? vendorsPrice[`${selectedVendors}`] * rentDays : 0).toLocaleString() || ""}元
                  </span>
                </div>
                <div className="f-center mt-3">
                  <button 
                  className={`btn rounded-pill border border-3 ${styles.confirmbtn}`}
                  style={{ fontSize: "20px" }}
                  onClick>
                    確定租用
                  </button>
                </div>
            </div>
          </Col>
        </Row>
      </Container>
      <ChatBtn />
      <Footer />
    </div>
  );
};

export default SetStalls;
