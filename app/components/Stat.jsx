import React from "react";
import "./Stat.css";

class Stat extends React.Component {
  render() {
    const {subtitle, title, value} = this.props;

    return <div className="stat">
      <span className="title">{title}</span>
      <span className="value">{value}</span>
      <span className="subtitle">{subtitle}</span>
    </div>;
  }
}

export default Stat;
