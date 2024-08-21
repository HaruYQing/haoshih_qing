import styles from "./MemberVenderSideBar.module.scss";

const MemberVenderSideBar = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  return (
    <>
      <div className="p-3 d-flex flex-column align-items-center font-special">
        <div className="d-flex flex-column align-items-start ">
          <h2 className="mb-5">會員專區</h2>
          <div className={`w-100 ${styles.sideBarSubTitle}`}>
            <a
              className="text-decoration-none c-black"
              href={`http://localhost:3000/vendor/${user.vid}`}
            >
              <h4>會員資料</h4>
            </a>
            <a
              className="text-decoration-none c-black"
              href="http://localhost:3000/SetStalls"
            >
              <h4>我要擺攤</h4>
            </a>
            <h4>
              攤位管理 <span className="bi bi-chevron-down fs-5" />
            </h4>
            <div className="py-1 ps-3 ">
              <a
                className="text-decoration-none c-black"
                href={`http://localhost:3000/vendor/${user.vid}/vendorInfo`}
              >
                <h5>攤位資訊</h5>
              </a>
              <a
                className="text-decoration-none c-black"
                href={`http://localhost:3000/vendor/${user.vid}/payment`}
              >
                <h5>交易設定</h5>
              </a>
              <a
                className="text-decoration-none c-black"
                href={`http://localhost:3000/vendor/${user.vid}/products`}
              >
                <h5>商品管理</h5>
              </a>
            </div>
            <a
              className="text-decoration-none c-black"
              href={`http://localhost:3000/vendor/${user.vid}/orders`}
            >
              <h4>訂單管理</h4>
            </a>
            <h4>
              <a className="text-decoration-none c-black" href="/chatroom">
                聊天室
              </a>
            </h4>
          </div>
        </div>
        <h5>登出</h5>
      </div>
    </>
  );
};

export default MemberVenderSideBar;
