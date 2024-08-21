var mysql = require("mysql"); 

config = {
    user: "root",
    password: "",
    host: "localhost",
    port: 3306,
    database: "haoshih"
}
var conn = mysql.createConnection(config);

conn.connect((err) => {
    if (err) {
      console.log("MySQL連線失敗");
      
      return;
    } else {
      console.log("MySQL連線成功");
    }
  });
  

module.exports = {
    connection: mysql.createConnection(config)
} 