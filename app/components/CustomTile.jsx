import React, {Component} from "react";
import classnames from "classnames";
import {withNamespaces} from "react-i18next";
import {stringNormalizer} from "helpers/funcs";

import "./CustomTile.css";

class CustomTile extends Component {
  render() {
    const {
      color,
      icon,
      link,
      title,
      text
    } = this.props;

    return (
      <div className="custom-tile-container">
        <a className="custom-tile-link" href={link}>
          <div className="custom-tile-box">
            <div className="custom-tile-header">
              <img src={icon} alt="tag" className="custom-tile-content-tag" />
              <span className="custom-tile-title">
                {title}
              </span>
            </div>
            <div className="custom-tile-content">
              <p className="custom-tile-text">
                {text}
              </p>
            </div>
          </div>
        </a>
      </div>
    );
  }
}

CustomTile.defaultProps = {
  color: false,
  icon: false,
  link: undefined,
  title: ""
};

export default withNamespaces()(CustomTile);
