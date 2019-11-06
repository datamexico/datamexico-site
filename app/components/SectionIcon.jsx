import React from "react";
import "./SectionIcon.css";

class SectionIcon extends React.Component {
  render() {
    return <div className="SectionIcon">
      <img className="icon" src="/icons/sections/about.svg" />
      <span className="label">ABOUT</span>
    </div>;
  }
}

export default SectionIcon;
