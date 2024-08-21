import NavBar from "../components/NavBar";
import Main from "./components/Main";
import About from "./components/About";
import Menu from "./components/Menu";
import Footer from "../components/Footer";
import RainAnimation from "../weather/RainAnimation";
import React, { useState, useEffect, useCallback } from "react";
import WeatherApp from "../weather/WeatherApp";

const Home = () => {
  const [isRaining, setIsRaining] = useState(false);

  // 接收WeatherApp的值，判斷有無下雨
  // 強制下雨需要到RainAnimation.jsx裡將if那行註解
  const handleRainStatusChange = useCallback((rainStatus) => {
    setIsRaining(rainStatus);
  }, []);

  return (
    <>
      <RainAnimation isRaining={isRaining} />
      <NavBar></NavBar>
      <Main></Main>
      <About></About>
      <Menu></Menu>
      <WeatherApp 
        className="ms-auto sticky-bottom" 
        onRainStatusChange={handleRainStatusChange} 
      />
      <Footer></Footer>
    </>
  );
};

export default Home;