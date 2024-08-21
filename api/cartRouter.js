var express = require("express")
var cartRouter = express.Router()
cartRouter.use(express.urlencoded({ extended: false }));
cartRouter.use(express.json());
var config = require("./databaseConfig.js")
var conn = config.connection

// --------測試路由用----------
// cartRouter.get('/', function(req,res){res.send('OK')})

// cartRouter.get('/test', function(req,res){
//     conn.query("SELECT * FROM member WHERE uid = 1",function(err,result){res.json(result)})
// })
// --------測試路由用----------

//加入購物車
// cartRouter.post('/', async (req, res) => {
//     conn.query("SELECT * FROM carts WHERE uid = ? AND pid = ?", 
//         [req.body.uid, req.body.pid], function(err, results) {
//             // console.log(err,"20",results);
//             // console.log(results);
//             const amount =  results[0].amount;
            
//         if (results.length > 0) {
//             const newAmount = amount + req.body.amount;
//             if (newAmount <= req.body.quantity) {
//                 conn.query("UPDATE carts SET amount = ? WHERE uid = ? AND pid = ?", 
//                     [newAmount, req.body.uid, req.body.pid], function(err, result) {
//                     if (err) {
//                         return res.status(500).send('Update error');
//                     }
//                     // res.send('Update OK!');
//                     console.log('Update OK!');
//                 });
//             } else {
//                 res.status(400).send('添加數量超過庫存!');
//             }
//         } else {
//             // 如果紀錄不存在，插入新紀錄
//             conn.query("INSERT INTO carts (uid, pid, amount) VALUES (?, ?, ?)", 
//                 [req.body.uid, req.body.pid, req.body.amount], function(err, result) {
//                 if (err) {
//                     console.log("insert error", err);
                    
//                     return res.status(500).send('Insert error 36');
//                 }
//                 // res.send('INSERT INTO!');
//                 console.log('INSERT INTO!');
                
//             });
//         }
//         // res.redirect('/index/carts');
//     });
// });

// 加入購物車post async版本
cartRouter.post('/', async (req, res) => {
    try {
        // 使用 Promise 來包裝資料庫查詢
        const query = (sql, params) => {
            return new Promise((resolve, reject) => {
                conn.query(sql, params, (err, results) => {
                    if (err) return reject(err);
                    resolve(results);
                });
            });
        };

        // 查詢是否已經存在
        const results = await query("SELECT * FROM carts WHERE uid = ? AND pid = ?", [req.body.uid, req.body.pid]);

        // 檢查查詢結果是否有資料
        if (results.length > 0) {
            const amount = results[0].amount;
            var newAmount = amount + req.body.amount;

            if (newAmount <= req.body.quantity) {
                // 更新資料
                await query("UPDATE carts SET amount = ? WHERE uid = ? AND pid = ?", [newAmount, req.body.uid, req.body.pid]);
                console.log('Update OK!');
                res.send('Update OK!');
            } else {
                await query("UPDATE carts SET amount = ? WHERE uid = ? AND pid = ?", [req.body.quantity, req.body.uid, req.body.pid]);
                console.log('Set to quantity OK!');
                res.status(400).send('添加數量超過庫存!');
            }
        } else {
            // 插入新紀錄
            await query("INSERT INTO carts (uid, pid, amount) VALUES (?, ?, ?)", [req.body.uid, req.body.pid, req.body.amount]);
            console.log('INSERT INTO!');
            res.send('Insert OK!');
        }
    } catch (err) {
        console.log('Error:', err);
        res.status(500).send('Server error');
    }
});

cartRouter.get('/:uid', function(req, res) {
    // const conn = req.app.get('connection') ???????????????????????????????????
    conn.query(
        "SELECT carts.uid, carts.pid, product.name, quantity, price, img01, amount, vendor_info.vinfo, brand_name FROM carts JOIN product ON carts.pid = product.pid JOIN vendor ON product.vid = vendor.vid JOIN vendor_info ON vendor.vinfo = vendor_info.vinfo WHERE uid = ?",
        [req.params.uid],
        function(err, result) {
            // console.log(result);
            res.json(result);
            // res.render('indexcartdetail.ejs',{products: result, turnPrice: turnPrice, total:total});
        }
    )
})

// 購物車刪除功能
cartRouter.delete('/:uid/:pid', function(req, res) {
    const { uid, pid } = req.params;
    conn.query("DELETE FROM carts WHERE uid = ? AND pid = ?",
        [uid, pid],
        function(err, result) {
    if (err) {
        return res.status(500).send('Delete error');
        }
        res.send('Delete OK!');
    });
});

// 從購物車頁面按下結帳後跳轉到結帳頁面Step1，獲取剛剛勾選的商品
cartRouter.get('/products/:pid/:uid', function(req, res) {
    conn.query(
        "SELECT product.name, quantity, price, img01, vendor_info.vinfo, brand_name FROM product JOIN vendor ON product.vid = vendor.vid JOIN vendor_info ON vendor.vinfo = vendor_info.vinfo WHERE pid = ? ",
        [req.params.pid],
        function(err, result) {
            res.json(result);
        }
    )
})

module.exports = cartRouter