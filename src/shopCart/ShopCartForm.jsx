import React, { useState, useEffect } from "react";
import { Container, Table, Form, Card } from "react-bootstrap";
import ShopList from "./ShopList";

const ShopCartForm = ({ productsData, selectedProducts, onProductCheckChange, onProductAmountChange, onProductDelete }) => {
  const [groupedProducts, setGroupedProducts] = useState({});
  const [allChecked, setAllChecked] = useState({});
  useEffect(() => {
    // 按 vinfo 分組商品
    const grouped = productsData.reduce((acc, product) => {
      if (!acc[product.vinfo]) {
        acc[product.vinfo] = [];
      }
      acc[product.vinfo].push(product);
      return acc;
    }, {});
    setGroupedProducts(grouped);

    // 初始化每個攤販的全選狀態
    const initialAllChecked = Object.keys(grouped).reduce((acc, vinfo) => {
      acc[vinfo] = false;
      return acc;
    }, {});
    setAllChecked(initialAllChecked);
  }, [productsData]);

  const handleAllCheckChange = (vinfo) => {
    const newAllChecked = !allChecked[vinfo];
    setAllChecked(prev => ({ ...prev, [vinfo]: newAllChecked }));
    groupedProducts[vinfo].forEach(product => {
      onProductCheckChange(product.pid, newAllChecked);
    });
  };

  useEffect(() => {
    // 更新每個攤販的全選狀態
    const newAllChecked = Object.keys(groupedProducts).reduce((acc, vinfo) => {
      acc[vinfo] = groupedProducts[vinfo].every(product => selectedProducts.has(product.pid));
      return acc;
    }, {});
    setAllChecked(newAllChecked);
  }, [selectedProducts, groupedProducts]);

  return (
    <>
      {Object.entries(groupedProducts).map(([vinfo, products]) => (
        <Container key={vinfo}>
          <Card className="my-5">
            <Card.Body>
              <Form.Check
                type="checkbox"
                label={products[0].brand_name}  // 使用該組的第一個商品的 brand_name
                className="mb-3 fw-bold"
                checked={allChecked[vinfo]}
                onChange={() => handleAllCheckChange(vinfo)}
              />
              <Table borderless>
                <thead>
                  <tr className="border-bottom">
                    <th></th>
                    <th>商品</th>
                    <th>單價</th>
                    <th>數量</th>
                    <th>小計</th>
                  </tr>
                </thead>
                <tbody>
                  <ShopList
                    productsData={products}
                    selectedProducts={selectedProducts}
                    onProductCheckChange={onProductCheckChange}
                    onProductAmountChange={onProductAmountChange}
                    onProductDelete={onProductDelete}
                  />
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Container>
      ))}
    </>
  );
};

export default ShopCartForm;