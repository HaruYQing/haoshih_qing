var express = require("express");
var chatroomRouter = express.Router();
var config = require("./databaseConfig.js");
var conn = config.connection;

let io;

chatroomRouter.setIo = function (socketio) {
  io = socketio;

  io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("chat message", (msg) => {
      saveMessage(msg);
      io.emit("chat message", msg);
    });

    socket.on("disconnect", () => {
      console.log("User disconnected");
    });
  });
};

chatroomRouter.get("/", function (req, res) {
  res.send("Welcome to the chatroom!");
});

chatroomRouter.get("/messages", function (req, res) {
  conn.query(
    "SELECT * FROM chat_messages ORDER BY timestamp DESC LIMIT 50",
    function (err, result) {
      if (err) {
        res.status(500).json({ error: "Database error" });
      } else {
        res.json(result.reverse());
      }
    }
  );
});

function saveMessage(message) {
  const { type, content, username, timestamp, color } = message;

  // turn timestamp into MySQL DATETIME
  const mysqlTimestamp = new Date()
    .toISOString()
    .slice(0, 19)
    .replace("T", " ");

  const query =
    "INSERT INTO chat_messages (type, content, username, timestamp, color) VALUES (?, ?, ?, ?, ?)";
  conn.query(
    query,
    [type, content, username, mysqlTimestamp, color],
    function (err, result) {
      if (err) {
        console.error("Error saving message:", err);
      } else {
        console.log("Message saved successfully");
      }
    }
  );
}

module.exports = chatroomRouter;
