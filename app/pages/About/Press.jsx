import React, {Component} from 'react'
import PropTypes from "prop-types";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Press extends Component {
  render() {
    const {t, press} = this.props;
    return (
      <div className="about-press">
        <h3>{t("AboutSite.press")}</h3>
        {press.map((d, i) => (
          <div className="press-news" key={i}>
            <img src={d.Picture} alt="Picture" className="news-picture" />
            <h4>{d.Title}</h4>
            <p>{d.Text}</p>
          </div>
        ))}
      </div>
    )
  }
}

Press.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(hot(Press));
