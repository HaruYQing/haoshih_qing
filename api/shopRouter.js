var express = require("express");
var shopRouter = express.Router();
shopRouter.use(express.urlencoded({ extended: false }));
shopRouter.use(express.json());
var config = require("./databaseConfig.js");
var conn = config.connection;
const { queryAsync } = require("../src/utils/utils.js");

// --------測試路由用----------
// shopRouter.get('/', function(req,res){res.send('OK')})

// shopRouter.get('/test', function(req,res){
//     conn.query("SELECT * FROM member WHERE uid = 1",function(err,result){res.json(result)})
// })
// --------測試路由用----------

// 所有攤販類型
shopRouter.get("/", function (req, res) {
  conn.query("select * from vendor_info", function (err, result) {
    res.json(result);
  });
});

shopRouter.get("/vendor/:id", function (req, res) {
  conn.query(
    "select * from vendor_info where vinfo = ?",
    [req.params.id],
    function (err, result) {
      res.json(result);
    }
  );
});

// 切換特定攤販類型
shopRouter.get("/:type", function (req, res) {
  conn.query(
    "select * from vendor_info where brand_type = ?",
    [req.params.type],
    function (err, result) {
      res.json(result);
    }
  );
});

// 取得該攤販的商品
shopRouter.get("/:vinfo/products/:sortType", function (req, res) {
  var query = "select * from product where vid = ? and is_show = 1 and quantity>0 order by "
  if (req.params.sortType == 0) {
    conn.query(
      query+"launch desc",
      [req.params.vinfo],
      function (err, result) {
        res.json(result);
      }
    );
  } else if(req.params.sortType == 1){
    conn.query(
      query+"price desc",
      [req.params.vinfo],
      function (err, result) {
        res.json(result);
      }
    );
  }else {
    conn.query(
      query+"price",
      [req.params.vinfo],
      function (err, result) {
        res.json(result);
      }
    );
  }
});

// 取得單件商品
shopRouter.get("/product/:pid", function (req, res) {
  conn.query(
    "select * from product where pid = ?",
    [req.params.pid],
    function (err, result) {
      res.json(result);
    }
  );
});

// 按讚收藏
shopRouter.get("/like/:uid", async function (req, res) {
  try {
    const heartQuery = `
        SELECT * FROM heart WHERE uid = ?
    `;
    const likes = await queryAsync(conn, heartQuery, [req.params.uid]);

    const likesNumArr = likes[0]["list"].split(",").map(Number);
    res.json(likesNumArr);
    // console.log(`likesNumArr: ${likesNumArr}`); // 1,2
  } catch (error) {
    console.error("Error in /shop/like/:uid:", error);
    res.status(500).send("Internal Server Error");
  }
});

shopRouter.post("/like/:uid", async function (req, res) {
  // console.log(req.body.list)
  const list = req.body.list.toString()
  // const list = [1,2,3].toString()
  const heartQuery = `
        SELECT * FROM heart WHERE uid = ?
    `;
  const likes = await queryAsync(conn, heartQuery, [req.params.uid]);
  if (likes.length === 0) {
    conn.query(
      "INSERT INTO heart(uid, list) VALUES (?,?)",
      [req.params.uid, list],
      function (err, result) {
        res.json(result);
      }
    )
  } else {
    try {
      conn.query(
        "UPDATE heart set list=? WHERE uid = ?",
        [list, req.params.uid],
        function (err, result) {
          res.json(result);
        }
      );
    } catch (error) {
      console.error("Error in put data /shop/like/:uid:", error);
      res.status(500).send("Internal Server Error");
    }
  }
})

module.exports = shopRouter;
