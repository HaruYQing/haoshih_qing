var express = require("express");
const http = require("http");
var cors = require("cors");
const { Server } = require("socket.io");
var app = express();

app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  })
);

// create http server
const server = http.createServer(app);
// create socket server and set cors
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // 允許來自 React 應用的連接
    methods: ["GET", "POST", "PUT", "DELETE"],
  },
});

// set Socket.IO
io.on("connection", (socket) => {
  socket.on("chat message", (msg) => {
    io.emit("chat message", msg);
  });

  socket.on("disconnect", () => {
    // TODO: disconnect
  });
});

// add io instance to app for using router
app.set("io", io);

var cartRouter = require("./cartRouter.js");
app.use("/carts", cartRouter);

var loginRouter = require("./loginRouter.js");
app.use("/login", loginRouter);

var mapRouter = require("./mapRouter.js");
app.use("/map", mapRouter);

var memberRouter = require("./memberRouter.js");
app.use("/member", memberRouter);

var shopRouter = require("./shopRouter.js");
app.use("/shop", shopRouter);

var vendorRouter = require("./vendorRouter.js");
app.use("/vendor", vendorRouter);

var chatroomRouter = require("./chatroomRouter.js");
app.use("/chatroom", chatroomRouter);

var linePayRouter = require("./linePayRouter.js");
app.use("/linePay", linePayRouter);

const PORT = 3200;
server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
