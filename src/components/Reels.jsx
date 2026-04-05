import React, { useState, useEffect, useRef } from "react";
import { PlayCircleFilled, SoundOutlined } from "@ant-design/icons";
import { getAllReelsApi } from "../apis/service";

const Reels = () => {
  const [allReels, setAllReels] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [isMuted, setIsMuted] = useState(true);

  const videoRefs = useRef([]);

  useEffect(() => {
    getAllReelsApi().then((res) => {
      setAllReels(res?.data || []);
    });
  }, []);

  // ▶️ Play selected video, pause others
  const handlePlay = (index) => {
    setActiveIndex(index);

    videoRefs.current.forEach((video, i) => {
      if (!video) return;

      if (i === index) {
        video.muted = isMuted;
        video.play().catch(() => {});
      } else {
        video.pause();
        video.currentTime = 0;
      }
    });
  };

  // 🔊 Toggle mute
  const toggleMute = () => {
    setIsMuted((prev) => {
      const newMute = !prev;

      const currentVideo = videoRefs.current[activeIndex];
      if (currentVideo) {
        currentVideo.muted = newMute;
      }

      return newMute;
    });
  };

  return (
    <>
      {allReels.length > 0 && (
        <div className="common-sec">
          <h2 className="title">
            Our <span> Watch and Buy </span>
          </h2>
          <p className="sub">Spot what you like and buy!</p>
        </div>
      )}

      <div className="reels-wrapper">
        <div className="reels-scroll">
          {allReels.map((reel, index) => (
            <div
              key={index}
              className={`reel-card ${
                activeIndex === index ? "active" : ""
              }`}
              onClick={() => handlePlay(index)}
            >
              <video
                ref={(el) => (videoRefs.current[index] = el)}
                src={`${import.meta.env.VITE_IMAGE_BASE_URL}/${reel.videoUrl}`}
                loop
                playsInline
                preload="metadata"
              />

              {/* ▶️ Play icon */}
              {activeIndex !== index && (
                <PlayCircleFilled className="play-icon" />
              )}

              {/* 🔊 Mute toggle */}
              {activeIndex === index && (
                <div className="mute-icon" onClick={toggleMute}>
                  <SoundOutlined />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ✅ STYLES */}
      <style>{`
        .reels-wrapper {
          width: 100%;
          overflow-x: auto;
          display: flex;
          justify-content: center;
        }

        .reels-scroll {
          display: flex;
          gap: 16px;
          padding: 0 20px;
          scroll-behavior: smooth;
          overflow-x: auto;
          scroll-snap-type: x mandatory; /* ✅ snap cards */
        }

        .reels-scroll::-webkit-scrollbar {
          display: none;
        }

        .reel-card {
          flex: 0 0 auto;
          width: 220px;
          aspect-ratio: 9 / 16;
          border-radius: 18px;
          overflow: hidden;
          background: #000;
          position: relative;
          cursor: pointer;
          transform: scale(0.9);
          transition: transform 0.3s ease;
          scroll-snap-align: center; /* ✅ center snapping */
        }

        .reel-card.active {
          transform: scale(1);
        }

        video {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .play-icon {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 50px;
          color: #fff;
          pointer-events: none;
        }

        .mute-icon {
          position: absolute;
          bottom: 10px;
          right: 10px;
          background: rgba(0,0,0,0.6);
          width: 34px;
          height: 34px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          cursor: pointer;
        }

        /* 📱 Mobile */
        @media (max-width: 768px) {
          .reel-card {
            width: 180px;
          }
        }
      `}</style>
    </>
  );
};

export default Reels;