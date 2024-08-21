import React from "react";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import "bootstrap-icons/font/bootstrap-icons.css";
import Row from "react-bootstrap/Row";
import { useNavigate } from "react-router-dom";
import DOMPurify from "dompurify";
import SubTitleYellow from "../../components/SubTitleYellow";

const VendorStallProfile = (props) => {
  //   console.log(props.stallProfile);
  const stallProfile = props.stallProfile;
  //   console.log(stallProfile);
  const navigate = useNavigate();
  const createCleanHTML = (content) => {
    const cleanContent = content.replace(/\r\n|\n|\r/g, "<br>");
    return DOMPurify.sanitize(cleanContent);
  };

  return (
    <>
      <SubTitleYellow title="攤位資訊" />
      <Row className="p-4 d-flex justify-content-start align-items-center">
        <Col
          sm="4"
          className="d-flex justify-content-center align-items-center"
        >
          <div className="w-50 d-flex justify-content-center align-items-center d-grid">
            <img
              src={stallProfile.logo_img}
              className="rounded-circle w-100 object-fit-contain d-block"
            />
          </div>
        </Col>
        <Col sm="4">
          <div className="w-100">
            <div className="d-flex justify-content-center">
              <Button
                className="me-5"
                variant=" bg-blueGray text-white rounded-pill px-4 py-2"
                type="button"
                onClick={() => {
                  navigate(`/vendor/${stallProfile.vid}/edit`);
                }}
              >
                編輯
              </Button>
              <Button
                variant="bg-white border border-2 c-gray rounded-pill px-4 py-2"
                type="button"
                onClick={() => {
                  navigate(`/shop/${stallProfile.vinfo}`);
                }}
              >
                查看我的攤位
              </Button>
            </div>
          </div>
        </Col>
      </Row>
      <div className="p-4 mb-5">
        <Row>
          <Col sm="2" className="text-end">
            <p>品牌名稱</p>
          </Col>
          <Col sm="6">{stallProfile.brand_name}</Col>
        </Row>
        <Row>
          <Col sm="2" className="text-end">
            <p>品牌類型</p>
          </Col>
          <Col sm="6">{stallProfile.brand_type_text}</Col>
        </Row>
        <Row>
          <Col sm="2" className="text-end">
            <p>品牌標籤</p>
          </Col>
          <Col sm="6">
            {stallProfile.tag1 ? `${stallProfile.tag1}` : ""}
            {stallProfile.tag2 ? ` ; ${stallProfile.tag2}` : ""}
          </Col>
        </Row>

        <Row>
          <Col sm="2" className="text-end">
            <p>品牌ＦＢ</p>
          </Col>
          <Col sm="6">{stallProfile.fb ? stallProfile.fb : "無"}</Col>
        </Row>

        <Row>
          <Col sm="2" className="text-end">
            <p>品牌ＩＧ</p>
          </Col>
          <Col sm="6">{stallProfile.ig ? stallProfile.ig : "無"}</Col>
        </Row>

        <Row>
          <Col sm="2" className="text-end">
            <p>品牌網站</p>
          </Col>
          <Col sm="6">{stallProfile.web ? stallProfile.web : "無"}</Col>
        </Row>

        <Row className="mb-5">
          <Col sm="2" className="text-end">
            <p>品牌描述</p>
          </Col>
          {/* TODO: 需要解決排版問題 */}
          <Col sm="6">
            <div
              dangerouslySetInnerHTML={{
                __html: createCleanHTML(stallProfile.content),
              }}
            />
          </Col>
        </Row>

        <Row>
          <Col sm="2" className="text-end">
            <p>品牌視覺照</p>
          </Col>
          <Col sm="10">
            <div className="d-flex flex-wrap gap-3">
              {[
                stallProfile.brand_img01,
                stallProfile.brand_img02,
                stallProfile.brand_img03,
                stallProfile.brand_img04,
                stallProfile.brand_img05,
              ]
                .filter((img) => img) // 過濾掉沒有圖片的項目
                .map((img, index) => (
                  <div
                    key={index}
                    className="position-relative"
                    style={{ width: "210px", height: "150px" }}
                  >
                    <img
                      src={img}
                      alt={`品牌視覺照 ${index + 1}`}
                      className="w-100 h-100 object-fit-cover rounded"
                    />
                  </div>
                ))}
            </div>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default VendorStallProfile;
