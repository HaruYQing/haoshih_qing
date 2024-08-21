var express = require("express");
var memberRouter = express.Router();
memberRouter.use(express.urlencoded({ extended: true }));
memberRouter.use(express.json());
var config = require("./databaseConfig.js");
var conn = config.connection;

const { queryAsync, hashPW } = require("../src/utils/utils.js");

// --------測試路由用----------
// memberRouter.get('/', function(req,res){res.send('OK')})

// memberRouter.get('/test', function(req,res){
//     conn.query("SELECT * FROM member WHERE uid = 1",function(err,result){res.json(result)})
// })
// --------測試路由用----------

// 資料庫更新函式 (一般會員)
async function updateUserProfile(uid, profileData) {
  return new Promise((resolve, reject) => {
    const keys = Object.keys(profileData);
    // 如果都沒填寫，就不執行動作
    if (keys.length === 0) {
      resolve();
      return;
    }
    // 依照有填寫的欄位動態生成 SQL語法
    let sql = `UPDATE member SET ${keys
      .map((key) => `${key} = ?`)
      .join(",")} WHERE uid = ?`;
    let params = [...Object.values(profileData), uid];
    // 更新資料庫
    conn.query(sql, params, (err, result) => {
      if (err) {
        reject(err);
      } else {
        resolve(result);
      }
    });
  });
}

memberRouter.get("/", (req, res) => {
  res.setHeader("Content-Type", "text/html; charset=utf-8");
  res.send("<h1>您即將進入會員專區～</h1>");
});

// 會員專區首頁 => 預設導到會員資料畫面
memberRouter.get("/:uid", (req, res) => {
  res.redirect(`/profile/${req.params.uid}`);
});

// 會員資料 API
memberRouter.get("/profile/:uid", (req, res) => {
  // console.log(`Received request for user ID: ${req.params.uid}`); // 添加這行日誌

  conn.query(
    "select * from member where uid = ?",
    [req.params.uid],
    (err, result) => {
      if (err) {
        console.error("Database query error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.length === 0) {
        return res.status(404).json({ error: "User not found" });
      }
      // console.log("Query result:", result[0]); // 添加這行日誌
      res.json(result[0]);
    }
  );
});

// 編輯會員資料 --React--
memberRouter.put("/profile/:uid", async (req, res) => {
  try {
    const { first_name, last_name, nickname, phone, email, address, password } =
      req.body;
    const uid = req.params.uid;

    // 有被填寫的欄位才會傳入 value
    let updateFields = {};
    if (first_name) updateFields.first_name = first_name;
    if (last_name) updateFields.last_name = last_name;
    if (nickname) updateFields.nickname = nickname;
    if (phone) updateFields.phone = phone;
    if (email) updateFields.email = email;
    if (address) updateFields.address = address;
    // 有被填寫的密碼才會被雜湊加密並傳入
    if (password) {
      var hashedPW = await hashPW(password);
      updateFields.password = hashedPW;
    }

    // 假如有欄位被填寫才會 update到資料庫，否則就是回到原畫面
    if (Object.keys(updateFields).length > 0) {
      await updateUserProfile(uid, updateFields);
      res.status(200).json({
        message: "Profile updated successfully",
        updatedFields: Object.keys(updateFields),
      });
    } else {
      res.status(200).json({ message: "No fields to update" });
    }
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).send("An error occurred while updating the profile");
  }
});

// 我的訂單 API
memberRouter.get("/orderList/:uid", async (req, res) => {
  try {
    // 抓這個 uid 的訂單資料 => vid 找到 vendor table => vinfo 找到 vendor_info table
    const orderQuery = `
      SELECT o.*, vi.brand_name, vi.vinfo 
      FROM orderList o 
      JOIN vendor v ON o.vid = v.vid 
      JOIN vendor_info vi ON v.vinfo = vi.vinfo 
      WHERE o.uid = ?
      ORDER BY o.order_time DESC
    `;
    const orders = await queryAsync(conn, orderQuery, [req.params.uid]);

    // 將交易狀態轉為文字訊息
    function getStatusText(status) {
      switch (status) {
        case 0:
          return "待付款";
        case 1:
          return "待出貨";
        case 2:
          return "已出貨";
        case 3:
          return "待收貨";
        case 4:
          return "已完成";
        default:
          return "處理中";
      }
    }

    // 將付款方式轉為文字
    function getPaymentText(payment) {
      switch (payment) {
        case 0:
          return "Line Pay";
        case 1:
          return "轉帳";
        case 2:
          return "貨到付款";
        default:
          return "其他";
      }
    }

    const formattedOrdersPromises = orders.map(async (order) => {
      let detailObj;
      try {
        detailObj = JSON.parse(order.detail);
      } catch (error) {
        console.error(
          "Error parsing JSON:",
          error,
          "Order detail:",
          order.detail
        );
        detailObj = { item: [], total: 0, payment: 0 }; // 設置一個默認值
      }

      let sendDataObj = JSON.parse(order.send_data);

      // 抓商品資料

      const productPromises = detailObj.item.map(async (item) => {
        let productData = await queryAsync(
          conn,
          "SELECT * FROM product WHERE pid = ?",
          [item.pid]
        );

        // 假設 productData 中包含了名為 img01 的 Base64 圖片數據
        let productImage = productData[0]?.img01;

        // 根據 productImage 的實際類型進行處理
        if (productImage) {
          if (Buffer.isBuffer(productImage)) {
            // 如果是 Buffer，轉換為 Base64
            productImage = `data:image/jpeg;base64,${productImage.toString(
              "base64"
            )}`;
          } else if (typeof productImage === "string") {
            // 如果已經是字串，檢查是否需要添加前綴
            if (!productImage.startsWith("data:image/")) {
              productImage = `data:image/jpeg;base64,${productImage}`;
            }
          } else {
            // 如果是其他類型，設置為 null
            console.log("Unexpected image data type");
            productImage = null;
          }
        } else {
          productImage = null;
        }

        const { img01, img02, img03, img04, img05, ...restProductData } =
          productData[0];

        return {
          ...item,
          productData: {
            ...restProductData,
            productImage,
          },
        };
      });

      const products = await Promise.all(productPromises);

      return {
        ...order,
        detail: { ...detailObj, item: products },
        send_data: sendDataObj,
        payment: getPaymentText(detailObj.payment),
        status: getStatusText(order.status),
        formatted_order_time: new Date(order.order_time).toLocaleString(
          "zh-TW",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          }
        ),
      };
    });

    const formattedOrders = await Promise.all(formattedOrdersPromises);

    res.json(formattedOrders);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Fail to provide data" });
  }
});

// 按讚攤位 API
memberRouter.get("/like/:uid", async (req, res) => {
  try {
    const heartQuery = `
        SELECT * FROM heart WHERE uid = ?
    `;
    const likes = await queryAsync(conn, heartQuery, [req.params.uid]);
    // console.log(`likes: ${JSON.stringify(likes)}`);

    if (likes.length === 0 || !likes[0].list) {
      return res.json({
        uid: req.params.uid,
        likes: likes,
      });
    }

    const likesNumArr = likes[0]["list"].split(",").map(Number);
    // console.log(`likesNumArr: ${likesNumArr}`); // 1,2

    const likesQuery = `
    SELECT vi.vinfo, vi.brand_name, vi.tag1, vi.tag2,vi.content, vi.brand_img01 
    FROM vendor_info vi
    WHERE vi.vinfo = ?
  `;

    const likedBrandPromises = likesNumArr.map(async (value) => {
      try {
        const result = await queryAsync(conn, likesQuery, [value]);
        return result;
      } catch (error) {
        console.error(`Error querying for vinfo ${value}:`, error);
        return null;
      }
    });

    const likedBrandResult = await Promise.all(likedBrandPromises);

    let likedBrandArr = likedBrandResult
      .map((result) => result[0])
      .filter(Boolean);
    likedBrandArr = likedBrandArr.map((brand) => {
      return {
        ...brand,
        brand_img01: brand.brand_img01
          ? brand.brand_img01.toString("base64")
          : null,
      };
    });

    res.json(likedBrandArr);
  } catch (error) {
    console.error("Error in /member/like/:uid:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = memberRouter;
