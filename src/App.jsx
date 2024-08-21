import Layout from "./Layout";
import React from "react";
import { BrowserRouter } from "react-router-dom";

import "./style.scss";
import "./font/ChenYuluoyan-Thin-Monospaced.ttf";

function App() {
  return (
    <BrowserRouter>
      <Layout></Layout>
    </BrowserRouter>
  );
}

export default App;
