import MainBg from "../components/MainBg";
import NavBar from "../components/NavBar";
import SubTitleYellow from "../components/SubTitleYellow";
import ThirdTitle from "../components/ThirdTitle";
import Footer from "../components/Footer";
import VendorDetail from "./components/VendorDetail";
import MarketFloorPlan from "./components/MarketFloorPlan";
import { useEffect, useState } from "react";
import axios from "axios";
import { Col, Form } from "react-bootstrap";

const Map = () => {
  const [data_from_parent, setVinfo] = useState([]);
  const [season_data, setSeason] = useState([]);
  const [vendor_number, setVendorNumber] = useState("A01");
  const fetchData = async (vinfo) => {
    try {
      const response = await axios.get("http://localhost:3200/map/getdata", {
        params: { vinfo },
      });
      setVinfo(response.data.data_from_server);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };
  const fetchSeasonData = async (season) => {
    try {
      const response = await axios.get(`http://localhost:3200/map/seasondata/${season}`, {
      });
      setSeason(response.data);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };  
  //確保dataFromParent資料已動態更新
  useEffect(() => {
    console.log(data_from_parent);
  }, [data_from_parent]);
  
  //確保seasondata資料已動態更新
  useEffect(() => {
    const getSeasonData = async () => {
      try {
        const response = await axios.get("http://localhost:3200/map/seasondata/3",
        );
        setSeason(response)
        console.log(response.data.season_data.map(item => `${item.postion}${item.number}`));
      } catch (error) {
        console.error("Error fetching data", error);
      }
    };
    getSeasonData();
  }, [])
  useEffect(() => {
    console.log(season_data.season_data);
  }, [season_data])
  return (
    <>
      <NavBar />
      <MainBg title="市集地圖" page="map" />
      <div className=" p-5">
        <SubTitleYellow title="攤位導覽" />
        <div>
          <div className="d-flex   m-5  ">
            <div className="w-50 me-2 border border-dark p-3">
              <div className="d-flex justify-content-between align-items-center">
                <Col>
                  <ThirdTitle title="市集平面圖" />
                </Col>
                <Col xs="auto">
                  <Form.Select size="sm" onChange={(event) => fetchSeasonData(event.target.value)}>
                    <option value="3">2024/07-2024/09</option>
                    <option value="4">2024/10-2024/12</option>
                  </Form.Select>
                </Col>
              </div>
              <div>
                <MarketFloorPlan fetchData={fetchData} setVendorNumber={setVendorNumber}/>
              </div>
            </div>
            <div className="border border-dark p-3 w-50" id="shop">
              <VendorDetail data_from_parent={data_from_parent} vendor_number={vendor_number} />
            </div>
          </div>
        </div>
      </div>
      <div className="p-5 m-5 bg-white">
        <SubTitleYellow title="交通資訊" />
        <div>
          <div className="my-5">
            <ThirdTitle title="大眾交通運輸" />
          </div>

          <div className="d-flex justify-content-between r">
            <div className="w-50">
              <img className="w-100 h-100 " src="images/img/busMap.png" />
            </div>
            <div className="w-50">
              <img
                className="w-100 h-100 object-fit-cover"
                src="images/img/busRoute.png"
              />
            </div>
          </div>
        </div>

        <div>
          <div className="my-5">
            <ThirdTitle title="自行開車" />
          </div>

          <div className="d-flex justify-content-between r">
            <div className="w-50">
              <img className="w-100 h-100 " src="images/img/parking.png" />
            </div>
            <iframe
              className="w-50"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3640.6038853440277!2d120.64844997697156!3d24.150545373293948!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x34693d9650422ae1%3A0x334dfd5796c49ff6!2z6LOH5bGV5ZyL6ZqbLeWOnyDos4fnrZbmnIMt5pW45L2N5pWZ6IKy56CU56m25omALeS4reWNgA!5e0!3m2!1szh-TW!2stw!4v1722097483550!5m2!1szh-TW!2stw"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};
export default Map;
