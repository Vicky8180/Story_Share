import React, { useEffect, useState, useRef } from "react";
import "./Slider.css";
import { useDispatch, useSelector } from "react-redux";
import { addItem } from "../../../redux_tool_kit/slices/TraversedSlice";

export default function Slider({
  each_slides,
  currentSlideIndex,
  onSlideComplete,
  traversed,
  pushInTraversed,
  isLoading,
}) {
  const [progress, setProgress] = useState(0);

  const duration = each_slides[currentSlideIndex]?.duration
    ? each_slides[currentSlideIndex].duration * 1000
    : 5000;

  const dispatch = useDispatch();
  const intervalRef = useRef(null);

  const data2 = useSelector((store) => store.traversed.traversed);

  useEffect(() => {
    if (isLoading) {
      return;
    }

    setProgress(0);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + 100 / (duration / 100);

        if (Math.round(nextProgress) >= 100) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;

          setTimeout(() => {
            dispatch(addItem(currentSlideIndex));
          }, 0);

          return 100;
        }

        return nextProgress;
      });
    }, 100);

    return () => {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    };
  }, [currentSlideIndex, duration, isLoading, dispatch]);

  return (
    <div className="slider_container">
      {each_slides.map((_, index) => (
        <div
          key={index}
          className="slides"
          style={{
            flex: `1 1 calc(${100 / each_slides.length}% - 10px)`,
            backgroundColor:
              data2 && data2.includes(index)
                ? "green"
                : "rgba(217, 217, 217, 0.5)",
            position: "relative",
          }}
        >
          <div
            style={{
              width: index === currentSlideIndex ? `${progress}%` : "0%",
              height: "100%",
              backgroundColor: "green",
              position: "absolute",
              top: 0,
              left: 0,
            }}
          ></div>
        </div>
      ))}
    </div>
  );
}
