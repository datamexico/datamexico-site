import React, {Component} from "react";
import PropTypes from "prop-types";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Background extends Component {
  render() {
    const {t, background} = this.props;
    return (
      <div className="about-background">
        <h3>{t("About.Background")}</h3>
        <iframe className="about-video" src="https://www.youtube.com/embed/12N7aBzzGDc" frameBorder="0" allowFullScreen></iframe>
        <sub>
          Está permitida la reproducción total o parcial de este video, por cualquier medio electrónico, para la difusión de DataMéxico
        </sub>
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

export default withNamespaces()(hot(Background));
