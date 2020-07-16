import React from "react";
import "./TileTitle.css";

class TileTitle extends React.Component {
  render() {
    const {icon, locale, title, subtitle} = this.props;

    return <h3 className="tile-title">
      <a className="tile-title-link" href={icon ? `/${locale}/explore?profile=${icon}` : "#"}>
        {icon && <img className="tile-title-icon" src={`/icons/homepage/png/${icon}-icon.png`} alt="" />}
        {title}
      </a>
      <span className="subtitle-title-link">{subtitle}</span>
    </h3>;
  }
}

TileTitle.defaultProps = {
  icon: undefined,
  locale: "es",
  title: ""
};

export default TileTitle;
