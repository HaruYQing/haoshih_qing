import React from 'react';
import './RainAnimation.css'; // 我們將在這個文件中定義動畫樣式

const RainAnimation = ({ isRaining }) => {
  if (!isRaining) return null;

  return (
    <div className="rain-container">
      {/* array的數字可以決定雨滴的密集度 建議不要超過1000 */}
      {[...Array(100)].map((_, index) => (
        <div key={index} className="raindrop" style={{
          left: `${Math.random() * 100}%`,
          // 秒數為調整下雨的速度
          animationDuration: `${0.5 + Math.random() * 0.5}s`,
          // 別動
          animationDelay: "0s"
        }}></div>
      ))}
    </div>
  );
};

export default RainAnimation;