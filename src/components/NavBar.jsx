import { openLink } from "../utils/link";
import {useNavigate} from "react-router-dom"
const data = [
  {
    id: 1,
    text: "最新消息",
    src: "/news",
    hoverText: `市集公告、攤位招
    租、最新活動等相𨶹資訊`,
  },
  {
    id: 2,
    text: "攤販類型",
    src: "/type",
    hoverText: `介紹好尸、集內的
多元攤販`,
  },
  {
    id: 3,
    text: "市集地圖",
    src: "/map",
    hoverText: `提供市集導覽與交通資訊，帶領你們
走進好尸、集`,
  },
  {
    id: 4,
    text: "我要擺攤",
    src: "/SetStalls",
    hoverText: `提供攤主們擺攤資
訊與攤位出租申請`,
  },
]; // 改物件
const user = JSON.parse(localStorage.getItem("user"));
const NavBar = () => {
  const navigate = useNavigate()
  const redir = (url) => {
    if (user) {
      // return user.vid ? url :
      if (user.vid) {
        return url;
      } else {
        console.log(user);

        return "/login";
      }
    }
  };
  return (
    <>
      <div className="navBar">
        <nav className="navbar navbar-expand p-3">
          <div className="container-fluid">
            <a href="/haoshih">
              <img className="pe-auto" src="images/img/logo.png" alt="logo" />
            </a>
            <div className="d-flex flex-row">
              {data.map((item) => (
                <a
                  key={item.id}
                  className={`cursor-pointer text-decoration-none c-black fs-5 px-3 py-2 hover-bg-secondary rounded-pill`}
                  onClick={() => {
                    if (item.id === 4) {
                      if (user) {
                        if (user.uid) {
                          alert("請先登入攤主帳號");
                          navigate("/login")
                        } else {
                          navigate(item.src);
                        }
                      }else{
                        alert("請先登入攤主帳號");
                        navigate("/login")
                      }
                    } else {
                      navigate(item.src);
                    }
                  }}
                >
                  {item.text}
                </a>
              ))}
            </div>
            <div className="rounded-pill fs-5 px-3 py-2 bg-primary c-white hover-bg-blueGray cursor-pointer">
              <a className="link-light text-decoration-none" href="/shop">
                市集商城
              </a>
            </div>
          </div>
        </nav>
      </div>
    </>
  );
};

export default NavBar;
