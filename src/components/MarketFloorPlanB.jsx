import React,  { useEffect, useState }from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import styles from "./MarketFloorPlanB.module.scss";


const MarketFloorPlan = ({fetchData, season_data}) => {
  const [selectedStalls, setSelectedStalls] = useState(new Set());
  console.log(season_data);
  const getBoothClass = (booth) => {
    if (season_data.includes(booth)) {
      return "bg-select-gray";
    }else if (["A01", "A02", "B01", "B02", "C01", "C02", "D01", "D02"].includes(booth)) {
      return "bg-red";
    }return "bg-secondary";
  };
  const handleClick = (event) => {
    const element = event.target;
    console.log(element);
    if(element.classList.contains("bg-lightBlue")) {
      //如果已經是bg-lightBlue，則恢復originalClass
      element.classList.remove("bg-lightBlue");
      if(element.dataset.originalClass  === "bg-red") {
        element.classList.add("bg-red");
      }else {
        element.classList.add("bg-secondary");
      }
    }else {
      element.dataset.originalClass = element.classList.contains("bg-red") ? "bg-red" : "bg-secondary";
      element.classList.remove("bg-red", "bg-secondary");
      element.classList.add("bg-lightBlue")
    }
    
    const vendors = element.innerText;
    const newSelectedStalls = new Set(selectedStalls);
    
    if (newSelectedStalls.has(vendors)) {
      // 如果已經選擇了，則移除並清空資料
      newSelectedStalls.delete(vendors);
      fetchData(''); // 清空父元件資料
    } else {
      // 如果未選擇，則添加
      newSelectedStalls.add(vendors);
      fetchData(vendors); // 更新父元件資料
    }

    setSelectedStalls(newSelectedStalls);
  };
  const position = ["A", "B", "C", "D"];
  const vendor_unmber = ["01", "02", "03", "04", "05"];
  
  return (
    <Container fluid className={styles.containerSize}>
      <Row className={styles.floorPlanRow}>
        <Col>
          <div className={styles.floorPlan}>
            <div className={styles.mainStage}>主舞台</div>
            {[...Array(4)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                className={styles.stallRow}
                style={{ top: `${20 + rowIndex * 20}%` }} 
                >
                {[...Array(5)].map((_, colIndex) => (
                  <div key={colIndex} 
                  className={`${styles.stall} ${styles.hover} ${getBoothClass(position[rowIndex] + vendor_unmber[colIndex])}`}
                  onClick={handleClick}
                  >
                    {position[rowIndex] + vendor_unmber[colIndex]}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </Col>
      </Row>
      <br />
      <Row className={styles.footer}>
      </Row>
    </Container>
  );
};

export default MarketFloorPlan;
