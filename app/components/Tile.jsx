import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import "./Tile.css";

class Tile extends Component {
  render() {
    const {
      El,           // the element used as the container (it's an li by default)
      link,         // direct link
      slug,         // profile type
      id,           // profile id
      title,        // profile name
      level,        // displayed in a tag
      background,   // tag color
      lng           // locale
    } = this.props;

    return (
      <El className={`tile${level && background ? " explore-tile" : ""}`}>
        <a className="tile-link" href={link || `/${lng}/profile/${slug}/${id}`}>
          <span className={`tile-title heading ${
            title.length > 30 || title.match(/\w+/).toString().length > 25
              ? "u-font-xs"
              : "u-font-sm"
          }`} title={title}>
            {title}
          </span>
          {level && background
            ? <div className="tile-tag" style={{backgroundColor: background}}>
              <img className="tile-tag-img" src={`/icons/explore/${slug}-white.png`} alt=""/>
              <span className="tile-tag-text display u-font-xxs">{level}</span>
            </div> : ""
          }
          <div className="tile-cover-img" style={{backgroundImage: `url(/api/image?slug=${slug}&id=${id})`}} />
        </a>
      </El>
    );
  }
}

Tile.defaultProps = {
  link: undefined,
  title: "",
  El: "li"
};

export default withNamespaces()(Tile);
