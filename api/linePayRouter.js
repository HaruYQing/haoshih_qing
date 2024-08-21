var express = require("express");
var linePayRouter = express.Router();
linePayRouter.use(express.urlencoded({ extended: false }));
linePayRouter.use(express.json());
const axios = require("axios");
const { v4: uuid } = require("uuid");
const { HmacSHA256 } = require("crypto-js");
const Base64 = require("crypto-js/enc-base64");
var config = require("./databaseConfig.js");
var conn = config.connection;

const linePayConst = {
  VERSION: "v3",
  PROD_SITE: "https://api-pay.line.me/",
  DEV_SITE: "https://sandbox-api-pay.line.me/",
  CHANNEL_ID: "2006017983",
  CHANNEL_SECRET_KEY: "d175ad3e0db191ef3204dc28968f9ffb",
  HOST: "http://localhost:3000",
  CONFIRM_PATH: "/Step4?status=success",
  CANCEL_PATH: "/Step4?status=failed",
};

let orders = {};

linePayRouter
  .post("/", async function (req, res) {
    try {
      const { products, total } = req.body;

      const linePayReqBody = {
        amount: total,
        currency: "TWD",
        orderId: uuid(),
        packages: [
          {
            id: "order_1",
            amount: total,
            products,
          },
        ],
        redirectUrls: {
          confirmUrl: linePayConst.HOST + linePayConst.CONFIRM_PATH,
          cancelUrl: linePayConst.HOST + linePayConst.CANCEL_PATH,
        },
      };

      orders = { orderId: { amount: total, currency: "TWD" } };

      const uri = "/payments/request";
      const headers = createHeaders(uri, linePayReqBody);
      const url = createUrl(uri);

      const linePayRes = await axios.post(url, linePayReqBody, { headers });

      if (linePayRes?.data.returnCode === "0000") {
        res.json(linePayRes?.data?.info.paymentUrl.web);
      }
    } catch (error) {
      console.error("createOrder" + error);
      res.end();
    }
  })
  .get("/Step4", async (req, res) => {
    console.log(123);

    try {
      const { transactionId, orderId } = req.query;

      const linePayReqBody = orders[orderId];

      const uri = `/payments/${transactionId}/confirm`;
      const headers = createHeaders(uri, linePayReqBody);
      const url = createUrl(uri);

      const linePayRes = await axios.post(url, linePayReqBody, { headers });

      if (linePayRes?.data.returnCode === "0000") {
        console.log("payment success");
      }

      res.end();
    } catch (error) {
      console.error("confirmOrder" + error);
      res.end();
    }
  });

const createHeaders = (uri, reqBody) => {
  const nonce = uuid();
  const signature = Base64.stringify(
    HmacSHA256(
      linePayConst.CHANNEL_SECRET_KEY +
        "/" +
        linePayConst.VERSION +
        uri +
        JSON.stringify(reqBody) +
        nonce,
      linePayConst.CHANNEL_SECRET_KEY
    )
  );

  const headers = {
    "Content-Type": "application/json",
    "X-LINE-ChannelId": linePayConst.CHANNEL_ID,
    "X-LINE-Authorization-Nonce": nonce,
    "X-LINE-Authorization": signature,
  };

  return headers;
};

const createUrl = (uri) => linePayConst.DEV_SITE + linePayConst.VERSION + uri;

module.exports = linePayRouter;
