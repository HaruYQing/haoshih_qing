import SubTitleYellow from "../../components/SubTitleYellow";
import ChatBtn from "../../components/ChatBtn";
import { useState, useEffect } from "react";
import axios from "axios";
import useAxios from "axios-hooks";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Row, Col } from "react-bootstrap";

const VendorPaymentSettings = () => {
  // 控制使用中帳戶
  const [currentBankInfo, setCurrentBankInfo] = useState({
    bank_code: "",
    bank_account: "",
  });

  // 控制輸入帳戶
  const [bankInfo, setBankInfo] = useState({
    bank_code: "",
    bank_account: "",
  });

  const { vid } = useParams();
  const navigate = useNavigate();
  const cartVisible = 1;

  // 表單是否已經被驗證
  const [validated, setValidated] = useState(false);
  // 銀行帳號驗證狀態
  const [bankAccountError, setBankAccountError] = useState(false);
  // 銀行帳號驗證函數
  const validateBankAccount = (bankAccount) => {
    const bankAccountRegex = /^([0-9]{10,14})$/;
    return bankAccountRegex.test(bankAccount);
  };

  // refetch功能
  const [{ data, loading, error }, refetch] = useAxios(
    `http://localhost:3200/vendor/bankInfo/${vid}`
  );

  useEffect(() => {
    console.log("Current path:", window.location.pathname);
  }, []);

  useEffect(() => {
    const fetchBankInfo = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3200/vendor/bankInfo/${vid}`
        );
        setCurrentBankInfo(response.data);
        setBankInfo(response.data);
      } catch (error) {
        console.error("Error fetching bank info:", error);
      }
    };
    fetchBankInfo();
  }, [vid]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setBankInfo((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    // 確保輸入時立即檢查
    if (name === "bank_account" && value !== "") {
      setBankAccountError(!validateBankAccount(value));
    } else if (name === "validateBankAccount" && value === "") {
      setBankAccountError(false); // 如果欄位為空，不顯示錯誤
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    let isValid = true;

    if (
      !bankInfo.bank_code ||
      !bankInfo.bank_account ||
      !validateBankAccount(bankInfo.bank_account)
    ) {
      isValid = false;
    }

    if (!isValid) {
      event.stopPropagation();
      setValidated(true);
      return;
    }

    try {
      // 把有改變且與原始數據不同的項目打包成一個新物件 updatedFields
      const updatedFields = Object.keys(bankInfo).reduce((acc, key) => {
        if (bankInfo[key] !== "") {
          acc[key] = bankInfo[key];
        }
        return acc;
      }, {});

      console.log("Sending update request with:", updatedFields);
      const response = await axios.put(
        `http://localhost:3200/vendor/bankInfo/${vid}`,
        updatedFields
      );
      console.log("Full response:", response);

      // 根據響應決定是否導航
      if (response.status === 200) {
        console.log("Updated successfully:", response.data.message);
        console.log("Updated fields:", response.data.updatedFields);

        await refetch();

        // 更新狀態
        setCurrentBankInfo((prevState) => ({
          ...prevState,
          ...updatedFields,
        }));
        setBankInfo((prevState) => ({
          ...prevState,
          ...updatedFields,
        }));

        alert("資料更新成功");
        // 重新導回會員資料頁面
        navigate(`/vendor/${vid}/payment`);
      } else {
        console.log("Unexpected response status:", response.status);
      }
    } catch (error) {
      // 在這裡處理錯誤，例如顯示錯誤消息
      console.error("Error updating bank info :", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
        console.log("Error status:", error.response.status);
      }
    }
  };

  return (
    <>
      <div>
        <SubTitleYellow title="交易設定" />

        <div className="tempPaymentArea">
          <Form noValidate validated={validated} onSubmit={handleSubmit}>
            <Form.Group as={Row} className="my-4">
              <Form.Label column sm="3" className="text-end">
                <h3>收款帳戶</h3>
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  plaintext
                  readOnly
                  style={{ visibility: "hidden" }}
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="my-4">
              <Form.Label column sm="3" className="text-end">
                使用中帳戶
              </Form.Label>
              <Col sm="9">
                <Form.Control
                  plaintext
                  readOnly
                  value={
                    currentBankInfo.bank_code +
                    "-" +
                    currentBankInfo.bank_account
                  }
                />
              </Col>
            </Form.Group>
            <Form.Group as={Row} className="my-4">
              <Form.Label column sm="3" className="text-end">
                變更帳戶
              </Form.Label>
              <Col sm="9" className="d-flex align-items-center">
                <Form.Select
                  name="bank_code"
                  style={{ width: "10rem" }}
                  onChange={handleInputChange}
                >
                  <option>選擇銀行</option>
                  <option value="004">004 – 臺灣銀行</option>
                  <option value="005">005 – 土地銀行</option>
                  <option value="006">006 – 合作商銀</option>
                  <option value="007">007 – 第一銀行</option>
                  <option value="008">008 – 華南銀行</option>
                  <option value="009">009 – 彰化銀行</option>
                  <option value="011">011 – 上海商業儲蓄銀行</option>
                  <option value="012">012 – 台北富邦銀行</option>
                  <option value="013">013 – 國泰世華銀行</option>
                  <option value="016">016 – 高雄銀行</option>
                  <option value="017">017 – 兆豐國際商業銀行</option>
                  <option value="018">018 – 農業金庫</option>
                  <option value="025">025 – 首都銀行</option>
                  <option value="039">039 – 澳商澳盛銀行</option>
                  <option value="040">040 – 中華開發工業銀行</option>
                  <option value="050">050 – 臺灣企銀</option>
                  <option value="052">052 – 渣打國際商業銀行</option>
                  <option value="053">053 – 台中商業銀行</option>
                  <option value="054">054 – 京城商業銀行</option>
                  <option value="072">072 – 德意志銀行</option>
                  <option value="075">075 – 東亞銀行</option>
                  <option value="081">081 – 匯豐(台灣)商業銀行</option>
                  <option value="085">085 – 新加坡商新加坡華僑銀行</option>
                  <option value="101">101 – 大台北銀行</option>
                  <option value="102">102 – 華泰銀行</option>
                  <option value="103">103 – 臺灣新光商銀</option>
                  <option value="104">104 – 台北五信</option>
                  <option value="106">106 – 台北九信</option>
                  <option value="108">108 – 陽信商業銀行</option>
                  <option value="114">114 – 基隆一信</option>
                  <option value="115">115 – 基隆二信</option>
                  <option value="118">118 – 板信商業銀行</option>
                  <option value="119">119 – 淡水一信</option>
                  <option value="120">120 – 淡水信合社</option>
                  <option value="124">124 – 宜蘭信合社</option>
                  <option value="127">127 – 桃園信合社</option>
                  <option value="130">130 – 新竹一信</option>
                  <option value="132">132 – 新竹三信</option>
                  <option value="146">146 – 台中二信</option>
                  <option value="147">147 – 三信商業銀行</option>
                  <option value="158">158 – 彰化一信</option>
                  <option value="161">161 – 彰化五信</option>
                  <option value="162">162 – 彰化六信</option>
                  <option value="163">163 – 彰化十信</option>
                  <option value="165">165 – 鹿港信合社</option>
                  <option value="178">178 – 嘉義三信</option>
                  <option value="179">179 – 嘉義四信</option>
                  <option value="188">188 – 台南三信</option>
                  <option value="204">204 – 高雄三信</option>
                  <option value="215">215 – 花蓮一信</option>
                  <option value="216">216 – 花蓮二信</option>
                  <option value="222">222 – 澎湖一信</option>
                  <option value="223">223 – 澎湖二信</option>
                  <option value="224">224 – 金門信合社</option>
                  <option value="512">512 – 雲林區漁會</option>
                  <option value="515">515 – 嘉義區漁會</option>
                  <option value="517">517 – 南市區漁會</option>
                  <option value="518">518 – 南縣區漁會</option>
                  <option value="520">520 – 小港區漁會；高雄區漁會</option>
                  <option value="521">
                    521 – 彌陀區漁會；永安區漁會；興達港區漁會；林園區漁會
                  </option>
                  <option value="523">
                    523 – 東港漁會；琉球區漁會；林邊區漁會
                  </option>
                  <option value="524">524 – 新港區漁會</option>
                  <option value="525">525 – 澎湖區漁會</option>
                  <option value="605">605 – 高雄市農會</option>
                  <option value="612">612 – 豐原市農會；神岡鄉農會</option>
                  <option value="613">613 – 名間農會</option>
                  <option value="614">614 – 彰化地區農會</option>
                  <option value="616">616 – 雲林地區農會</option>
                  <option value="617">617 – 嘉義地區農會</option>
                  <option value="618">618 – 台南地區農會</option>
                  <option value="619">619 – 高雄地區農會</option>
                  <option value="620">620 – 屏東地區農會</option>
                  <option value="621">621 – 花蓮地區農會</option>
                  <option value="622">622 – 台東地區農會</option>
                  <option value="624">624 – 澎湖農會</option>
                  <option value="625">625 – 台中市農會</option>
                  <option value="627">627 – 連江縣農會</option>
                  <option value="700">700 – 中華郵政</option>
                  <option value="803">803 – 聯邦商業銀行</option>
                  <option value="805">805 – 遠東銀行</option>
                  <option value="806">806 – 元大銀行</option>
                  <option value="807">807 – 永豐銀行</option>
                  <option value="808">808 – 玉山銀行</option>
                  <option value="809">809 – 萬泰銀行</option>
                  <option value="810">810 – 星展銀行</option>
                  <option value="812">812 – 台新銀行</option>
                  <option value="814">814 – 大眾銀行</option>
                  <option value="815">815 – 日盛銀行</option>
                  <option value="816">816 – 安泰銀行</option>
                  <option value="822">822 – 中國信託</option>
                  <option value="901">901 – 大里市農會</option>
                  <option value="903">903 – 汐止農會</option>
                  <option value="904">904 – 新莊農會</option>
                  <option value="910">910 – 財團法人農漁會聯合資訊中心</option>
                  <option value="912">912 – 冬山農會</option>
                  <option value="916">916 – 草屯農會</option>
                  <option value="922">922 – 台南市農會</option>
                  <option value="928">928 – 板橋農會</option>
                  <option value="951">951 – 北農中心</option>
                  <option value="954">954 – 中南部地區農漁會</option>
                </Form.Select>
                <Form.Control
                  type="input"
                  name="bank_account"
                  placeholder="請輸入銀行帳號"
                  className="ms-2"
                  style={{ width: "18rem" }}
                  onChange={handleInputChange}
                  isInvalid={bankAccountError}
                />
                <Form.Control.Feedback type="invalid">
                  請輸入10~14位數字的銀行帳號，開頭 0 可省略
                </Form.Control.Feedback>
              </Col>
            </Form.Group>
            <Row className="mt-5">
              <Col sm={{ span: 9, offset: 3 }}>
                <div className="d-flex">
                  <Button
                    variant="bg-white border border-2  rounded-pill px-4 py-2"
                    type="reset"
                  >
                    取消變更
                  </Button>
                  <Button
                    className="ms-3"
                    variant=" bg-blueGray text-white rounded-pill px-4 py-2"
                    type="submit"
                  >
                    儲存變更
                  </Button>
                </div>
              </Col>
            </Row>
          </Form>
        </div>

        <ChatBtn />
      </div>
    </>
  );
};

export default VendorPaymentSettings;
