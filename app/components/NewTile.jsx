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
      slugColor,  //profile type color
      title           //profile name
    } = this.props;
    // console.log(this.props);
    console.log(
      "title", title, stringNormalizer(title), "titleMatch", title.match(/\w+/).toString()
    );

    return (
      <Element className={classnames("tile", level && slugColor ? "explore-tile" : "")}>
        <a className="tile-link" href={link || `/${lng}/profile/${slug}/${id}`}>
          <span className={classnames("tile-title", {:})}></span>
        </a>
      </Element>
    );
  }
}

NewTile.defaultProps = {
  link: undefined,
  title: "",
  Element: "li"
};

export default withNamespaces()(NewTile);
