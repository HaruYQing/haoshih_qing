import React, { useState, useEffect } from "react";

const Test = () => {
  const [count, setCount] = useState(1);

  useEffect(() => {
    console.log("effect func");

    let timer;
    timer = setInterval(() => {
      console.log(count);
    }, count * 1000);

    return () => {
      console.log("clear func");
      clearInterval(timer);
    };
  }, [count]);

  return (
    <>
      <button
        onClick={() => {
          setCount((prev) => --prev);
        }}
      >
        -
      </button>
      <div>{count}</div>
      <button
        onClick={() => {
          setCount((prev) => ++prev);
        }}
      >
        +
      </button>
    </>
  );
};

export default Test;
