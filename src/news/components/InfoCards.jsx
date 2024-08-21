import InfoCard from "./InfoCard";

const InfoCards = () => {
  return (
    <>
      <div className="container my-5">
        <div className="row  row-cols-4 justify-content-around overflow-y-hidden">
          <InfoCard /> <InfoCard />
          <InfoCard /> <InfoCard />
          <InfoCard /> <InfoCard />
        </div>

        <div className="text-secondary" role="button">
          <div className="text-center fs-5 m-5">
            查看更多
            <i className="bi bi-chevron-double-down"></i>
          </div>
        </div>
      </div>
    </>
  );
};

export default InfoCards;
