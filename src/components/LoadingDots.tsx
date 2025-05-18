import React, { useState, useEffect } from "react";

export function LoadingDots() {
  const [dotCount, setDotCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDotCount((prev) => (prev < 3 ? prev + 1 : 0));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  const dots = ".".repeat(dotCount);

  return (
    <span style={{ whiteSpace: "pre" }}>
      Loading
      <span
        style={{
          display: "inline-block",
          width: "2ch",
          fontFamily: "monospace",
          textAlign: "left",
          verticalAlign: "bottom",
        }}
      >
        {dots}
      </span>
    </span>
  );
}
