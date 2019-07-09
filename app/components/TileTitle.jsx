import React from "react";
import "./TileTitle.css";

class TileTitle extends React.Component {
  render() {
    const {icon, title} = this.props;

    return <h3 className="tile-title">
      {icon && <img className="icon" src={`/icons/sections/${icon}.svg`} alt=""/>}
      {title}
    </h3>;
  }
}

TileTitle.defaultProps = {
  icon: undefined,
  title: ""
};

export default TileTitle;
