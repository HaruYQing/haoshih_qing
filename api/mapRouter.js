var express = require("express")
var mapRouter = express.Router()
mapRouter.use(express.urlencoded({ extended: false }));
mapRouter.use(express.json());
var config = require("./databaseConfig.js")
var conn = config.connection

// --------測試路由用----------
// mapRouter.get('/', function(req,res){res.send('OK')})

// mapRouter.get('/test', function(req,res){
//     // const conn = req.app.get('connection')
//     conn.query("SELECT brand_name FROM vendor_info WHERE vinfo = 1",function(err,result){res.json(result)})
// })
// --------測試路由用----------

//渲染市集地圖頁面，預設抓vinfo=1的資料
mapRouter.get('/getdata', function(request, response) {
    const vinfo = request.query.vinfo; 
        conn.query(
            "SELECT * FROM vendor_info WHERE vinfo = ?",
            [vinfo || '1'],  
            function(err, result) {
                if(err) {
                    return response.status(500).send('Database query failed.');
                }
                response.json({data_from_server: result});
            }
        )
}) 
//取得季度資料
mapRouter.get('/seasondata/:season', function(request, response) {
    const season = request.params.season;
        conn.query(
            "SELECT postion, number FROM map WHERE season = ?",    
            [season || '1'],  
            function(err, result) {
                if(err) {
                    return response.status(500).send('Database query failed.');
                }
                response.json({season_data: result});
            }
        )
})
//租用攤位
mapRouter.post('/rentvendor', function (request, response) {
    const {postion, number, season, vinfo} = req.body;
    if(!postion || !number || !season || !vinfo) {
        return response.status(400).json({error: "All fields are required"});
    }
    const sql = "INSERT INTO map (postion,number,season,vinfo) VALUES (?,?,?,?)";
    
})
module.exports = mapRouter
