import React from "react";
import "./TileTitle.css";

class TileTitle extends React.Component {
  render() {
    const {icon, locale, title} = this.props;

    return <h3 className="tile-title">
      {icon && <img className="tile-title-icon" src={`/icons/explore/${icon}.png`} alt=""/>}
      <a className="tile-title-link" href={icon ? `/${locale}/explore?profile=${icon}` : "#"}>
        {title}
      </a>
    </h3>;
  }
}

TileTitle.defaultProps = {
  icon: undefined,
  locale: "es",
  title: ""
};

export default TileTitle;
