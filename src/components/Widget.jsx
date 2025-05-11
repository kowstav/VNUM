import React, { useRef, useState, useEffect } from "react";
import styles from "./Widget.module.css";
import Transcription from "./Transcription";
import WidgetButtons from "./WidgetButtons";

const Widget = () => {
  const widgetRef = useRef(null);
  const [drag, setDrag] = useState(false);
  const [offset, setOffset] = useState({ x: 20, y: 20 });
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const [fullscreen, setFullscreen] = useState(false);
  const [vertical, setVertical] = useState(false);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!drag) return;
      const x = e.clientX - mouseOffset.x;
      const y = e.clientY - mouseOffset.y;
      setOffset({ x, y });
    };

    const handleMouseUp = () => {
      if (drag) setDrag(false);
      adjustOrientation();
    };

    if (drag) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
    }
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [drag, mouseOffset]);

  const adjustOrientation = () => {
    if (!widgetRef.current) return;
    const rect = widgetRef.current.getBoundingClientRect();
    const midX = window.innerWidth / 2;
    if (
      rect.left + rect.width / 2 < midX * 0.8 &&
      rect.left + rect.width / 2 > midX * 0.2
    ) {
      setVertical(false);
    } else {
      setVertical(true);
    }
  };

  useEffect(() => {
    adjustOrientation();
    window.addEventListener("resize", adjustOrientation);
    return () => window.removeEventListener("resize", adjustOrientation);
  }, []);

  const handleFullscreen = () => setFullscreen((f) => !f);

  const onMouseDown = (e) => {
    if (e.target.closest(`.${styles.buttons}`)) return;
    setDrag(true);
    setMouseOffset({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const style = fullscreen
    ? {
        width: "80vw",
        height: "80vh",
        top: "10vh",
        left: "10vw",
        boxShadow: "0 8px 40px 8px rgba(0,0,0,0.2)",
      }
    : {
        width: "340px",
        height: "220px",
        top: offset.y,
        left: offset.x,
        boxShadow: "0 4px 20px 4px rgba(0,0,0,0.16)",
      };

return (
    <div
      ref={widgetRef}
      className={`${styles.widget} ${fullscreen ? styles.fullscreen : ""} ${
        vertical ? styles.vertical : ""
      }`}
      style={style}
      onMouseDown={onMouseDown}
    >
      <Transcription />
      <WidgetButtons
        onFullscreen={handleFullscreen}
        isFullscreen={fullscreen}
      />
    </div>
  );
};

export default Widget;