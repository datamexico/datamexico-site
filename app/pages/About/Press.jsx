import React, {Component} from 'react'
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Press extends Component {
  render() {
    const {t, lng, press} = this.props;
    const connector = {
      es: "sobre",
      en: "about"
    }
    press.sort((a, b) => b["Date ID"] - a["Date ID"]);
    return (
      <div className="about-press">
        <h3>{t("About.In the press")}</h3>
        {press.map((d, i) => (
          <div className="press-news" key={i}>
            <h4>{d.Date}</h4>
            {d.Picture && (<img src={d.Picture} alt="Picture" className="news-picture" />)}
            <div className="press-media">
              <a href={d.URL} target="_blank" rel="noopener noreferrer">{d.Media}</a>
              <h6>{`${connector[lng]} ${d.Platform}`}</h6>
            </div>
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

export default withNamespaces()(Press);
