import React, { useState, useEffect, useRef } from "react";
import { PlayCircleFilled, SoundOutlined } from "@ant-design/icons";
import { getAllReelsApi } from "../apis/service";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

import "swiper/css";

const Reels = () => {
  const [allReels, setAllReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(0);

  const videoRefs = useRef([]);
  const swiperRef = useRef(null);

  useEffect(() => {
    getAllReelsApi().then((res) => {
      setAllReels(res?.data || []);
    });
  }, []);

   useEffect(() => {
    videoRefs.current.forEach((video, index) => {
      if (!video) return;

      if (index === activeIndex) {
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  }, [activeIndex]);

  return (

<>

{allReels.length>0 && (
<div class="common-sec">
    <h2 class="title">Our <span> Watch and Buy </span></h2>
    <p class="sub">Discover the magic of exquisite jewels that celebrate your special day with our endless love! </p>
</div>
)
}
    <div className="reels-wrapper">
      <div className="container">
        {allReels.length > 0 && (
          <Swiper
            modules={[Autoplay]}
            loop={allReels.length > 1}
            centeredSlides
            slidesPerView="auto"
            spaceBetween={20}
            speed={800}
            autoplay={{
              delay: 2500,
              disableOnInteraction: false,
            }}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            onSlideChange={(swiper) => {
              setActiveIndex(swiper.realIndex);
            }}
            onTransitionEnd={(swiper) => {
              // ✅ wait until slide is visually centered
              swiper.autoplay.start();
            }}
            className="reels-swiper"
          >
            {allReels.map((reel, index) => (
              <SwiperSlide key={index} className="reel-slide">
                <div
                  className={`reel-card ${
                    activeIndex === index ? "active" : ""
                  }`}
                >
                  <video
                    ref={(el) => (videoRefs.current[index] = el)}
                    src={reel.videoUrl}
                    muted
                    loop
                    playsInline
                    preload="metadata"
                  />

                  {activeIndex !== index && (
                    <PlayCircleFilled className="play-icon" />
                  )}

                  <div className="mute-icon">
                    <SoundOutlined />
                  </div>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>

      {/* ✅ STYLES (CENTERED & STABLE) */}
      <style>{`
        .reels-swiper {
          padding: 0 60px;
        }

        .reel-slide {
          width: 240px !important;
          display: flex;
          justify-content: center;
        }

        .reel-card {
          position: relative;
          width: 100%;
          aspect-ratio: 9 / 16;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          transform: scale(0.9);
          transition: transform 0.3s ease;
        }

        .reel-card.active {
          transform: scale(1);
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center center; /* 🔥 true centering */
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 54px;
          color: #fff;
          pointer-events: none;
        }

        .mute-icon {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
        }

        /* 📱 Mobile */
        @media (max-width: 768px) {
          .reels-swiper {
            padding: 0 20px;
          }

          .reel-slide {
            width: 200px !important;
          }
        }
      `}</style>
    </div>

    </>
  );
};

export default Reels;
