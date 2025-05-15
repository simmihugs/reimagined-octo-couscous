import { PiCopyright } from "react-icons/pi";

export default function Footer() {
  return (
    <div
      style={{
        height: "auto",
        backgroundColor: "#c4f2a7",
        fontFamily: "sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "1rem",
      }}
    >
      <div
        style={{
          display: "flex", // Add flex to this div
          alignItems: "center", // Vertically align items in the center
        }}
      >
        <PiCopyright style={{ marginRight: "0.5rem" }} />{" "}
        {/* Add some spacing */}
        <p style={{ margin: 0 }}> All rights reserved</p>{" "}
        {/* Remove default paragraph margin */}
      </div>
    </div>
  );
}
