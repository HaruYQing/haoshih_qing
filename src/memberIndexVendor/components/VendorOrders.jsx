import React from "react";
import { Container, Tab, Tabs } from "react-bootstrap";
// import styles from "./VendorOrders.module.scss";
import SubTitleYellow from "../../components/SubTitleYellow";
import VendorOrderCard from "./VendorOrderCard";

const VendorOrders = (props) => {
  // 這裡拿到的是訂單陣列
  const { orderData } = props;
  const orderFilter = (status) => (order) => order.status === status;

  return (
    <>
      <SubTitleYellow title="訂單管理" />
      <br />
      <Tabs
        defaultActiveKey="allStatus"
        id="justify-tab-example"
        className="mb-3"
        justify
      >
        <Tab
          eventKey="allStatus"
          title="全部"
          // className={`${styles["custom-tab"]} custom-tab`}
        >
          <Container className="px-5">
            {orderData
              ? orderData.map((order) => (
                  <VendorOrderCard key={order.oid} orderData={order} />
                ))
              : "尚無訂單"}
          </Container>
        </Tab>

        {/* 只過濾一次的方式 ==> 效能會比較好 */}
        {/* <Tab eventKey="status0" title="待付款">
          {(() => {
            const filteredOrders = orderData
              ? orderData.filter(orderFilter("待付款"))
              : [];
            return filteredOrders.length > 0
              ? filteredOrders.map((order) => (
                  <VendorOrderCard key={order.oid} orderData={order} />
                ))
              : "目前沒有待付款訂單";
          })()}
        </Tab> */}

        <Tab eventKey="status0" title="待付款">
          {orderData && orderData.length > 0
            ? (() => {
                const filteredOrders = orderData.filter(orderFilter("待付款"));
                return filteredOrders.length > 0
                  ? filteredOrders.map((order) => (
                      <VendorOrderCard key={order.oid} orderData={order} />
                    ))
                  : "目前沒有待付款訂單";
              })()
            : "正在加載訂單..."}
        </Tab>
        {/* 以下文字顯示邏輯須修正，不能以是否有orderData作為判斷 */}
        <Tab eventKey="status1" title="待出貨">
          {orderData && orderData.length > 0
            ? (() => {
                const filteredOrders = orderData.filter(orderFilter("待出貨"));
                return filteredOrders.length > 0
                  ? filteredOrders.map((order) => (
                      <VendorOrderCard key={order.oid} orderData={order} />
                    ))
                  : "目前沒有待出貨訂單";
              })()
            : "正在加載訂單..."}
        </Tab>
        <Tab eventKey="status2" title="已出貨">
          {orderData && orderData.length > 0
            ? (() => {
                const filteredOrders = orderData.filter(orderFilter("已出貨"));
                return filteredOrders.length > 0
                  ? filteredOrders.map((order) => (
                      <VendorOrderCard key={order.oid} orderData={order} />
                    ))
                  : "目前沒有已出貨訂單";
              })()
            : "正在加載訂單..."}
        </Tab>
        <Tab eventKey="status3" title="待收貨">
          {orderData && orderData.length > 0
            ? (() => {
                const filteredOrders = orderData.filter(orderFilter("待收貨"));
                return filteredOrders.length > 0
                  ? filteredOrders.map((order) => (
                      <VendorOrderCard key={order.oid} orderData={order} />
                    ))
                  : "目前沒有待收貨訂單";
              })()
            : "正在加載訂單..."}
        </Tab>
        <Tab eventKey="status4" title="已完成">
          {orderData && orderData.length > 0
            ? (() => {
                const filteredOrders = orderData.filter(orderFilter("已完成"));
                return filteredOrders.length > 0
                  ? filteredOrders.map((order) => (
                      <VendorOrderCard key={order.oid} orderData={order} />
                    ))
                  : "尚無已完成訂單";
              })()
            : "正在加載訂單..."}
        </Tab>
      </Tabs>
    </>
  );
};

export default VendorOrders;
