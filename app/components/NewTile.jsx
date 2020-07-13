import React, {Component} from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";

import {stringNormalizer} from "helpers/funcs";

import "./NewTile.css";

class NewTile extends Component {
  render() {
    const {
      Element,
      id,             //profile id
      level,          //profile level
      link,           //profile direct link
      lng,            //locale
      slug,           //profile type
      slugColor,      //profile type color
      title           //profile name
    } = this.props;

    return (
      <Element className={classnames("tile-container", level && slugColor ? "explore-tile" : "")}>
        <a className="tile-link" href={link || `/${lng}/profile/${slug}/${id}`}>
          <div className="tile-content">
            <img src={`/icons/explore/${slug}-white.png`} alt="tag" className="tile-content-tag" style={{backgroundColor: `${slugColor}`}} />
            <div className="tile-content-description">
              <h3 className={classnames("tile-content-description-title", title && (stringNormalizer(title).length > 30 || stringNormalizer(title).match(/\w+/).toString().length > 25) ? "u-font-xs" : "u-font-sm")}>{title}</h3>
              <span className="tile-content-description-level">{level}</span>
            </div>
          </div>
          <div className="tile-background" style={{backgroundImage: `url(/api/image?slug=${slug}&id=${id})`}} />
        </a>
      </Element>
    );
  }
}

NewTile.defaultProps = {
  link: undefined,
  title: "",
  Element: "div"
};

export default withNamespaces()(NewTile);
