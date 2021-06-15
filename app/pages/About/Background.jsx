import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Background extends Component {
  render() {
    const {t, lng, background} = this.props;
    const sub = {
      es: "Está permitida la reproducción total o parcial de este video, por cualquier medio electrónico, para la difusión de DataMéxico",
      en: "The total or partial reproduction of this video is allowed, by any electronic means, for the dissemination of DataMéxico"
    }
    return (
      <div className="about-background">
        <h3>{t("About.Background")}</h3>
        <iframe className="about-video" src="https://www.youtube.com/embed/12N7aBzzGDc" frameBorder="0" allowFullScreen></iframe>
        <sub>{sub[lng]}</sub>
        {background.map((d, i) =>
          <p key={i}>{d.Text}</p>
        )}
      </div>
    )
  }
}

Background.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Background);
