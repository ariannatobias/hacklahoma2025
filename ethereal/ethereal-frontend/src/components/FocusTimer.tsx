import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css"; // Ensure styles are imported

interface FocusTimerProps {
  progress: number;
  timeRemaining: string;
}

export const FocusTimer = ({ progress, timeRemaining }: FocusTimerProps) => {
  return (
    <div className="w-64 h-64 mx-auto">
      <CircularProgressbar
        value={progress}
        text={timeRemaining}
        styles={buildStyles({
          pathColor: "#8B5CF6",
          textColor: "#F5F3FF",
          trailColor: "rgba(255, 255, 255, 0.2)",
          pathTransitionDuration: 0.5,
        })}
      />
    </div>
  );
};
