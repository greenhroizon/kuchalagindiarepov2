import React, { useEffect, useState } from "react";
import { aboutUsApi } from "../apis/service";
import Loader from "./common/Loader";
import { image_url } from "../apis/env";

const AboutUs = () => {
  const [topImage, setTopImage] = useState("");
  const [bottomImage, setBottomImage] = useState("");
  const [backgroundImage, setBackgroundImage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      const result = await aboutUsApi();

      if (result?.success && Array.isArray(result.data)) {
        const top = result.data.find((item) => item.type === "top");
        const bottom = result.data.find((item) => item.type === "bottom");
        const background = result.data.find(
          (item) => item.type === "background",
        );

        setTopImage(top?.image || "");
        setBottomImage(bottom?.image || "");
        setBackgroundImage(background?.image || "");
      }
    } catch (error) {
      console.error("Failed to fetch About Us data", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return <Loader />;
  }

  const imageUrl = backgroundImage ? `${image_url}/${backgroundImage}` : "none";

  return (
    <div
      className="about-page pt-100 bg-index"
      style={{ paddingBottom: "120px" }}
    >
      <div className="container">
        <div className="common-sec">
          <h2 className="title">
            <span>About us</span>
          </h2>
          <p className="sub">
            A curated rich heritage treasure box for you to dig deep into.</p>
            <p className="sub"> KUCH ALAG pioneers design-led innovations that simplify and elevate
            traditional wear.
          </p>
        </div>

        {/* Background Image Applied Dynamically */}
        <div
          className="about-image-bg"
          style={{
            backgroundImage: image_url ? `url(${imageUrl})` : "none",
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        >
          <div className="about-img-2">
            {/* TOP IMAGE */}
            {topImage && (
              <img src={`${image_url}/${topImage}`} alt="Top About Us" />
            )}

            {/* BOTTOM IMAGE */}
            {bottomImage && (
              <img src={`${image_url}/${bottomImage}`} alt="Bottom About Us" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
