import React from "react";
import { useNavigate } from "react-router-dom";
import LikedVendorsCard from "./LikedVendorsCard";
import styles from "./MemberLike.module.scss";
import SubTitleYellow from "../../components/SubTitleYellow";

const MemberLike = (props) => {
  const { likedData } = props;

  const navigate = useNavigate();
  const handleNavigation = (vid) => {
    navigate("/shop/" + vid);
  };
  if (!likedData.length) {
    return <h4>目前無按讚的攤位～</h4>;
  }
  return (
    <>
      <SubTitleYellow title="按讚攤位" />
      <div className={`row p-5 ${styles.vendorBorder}`}>
        {likedData.map((vendor, index) => (
          <LikedVendorsCard
            key={vendor.vinfo}
            data={vendor}
            linkTo={handleNavigation}
          />
        ))}
      </div>
    </>
  );
};

export default MemberLike;
