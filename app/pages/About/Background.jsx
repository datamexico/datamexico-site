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
        <h3>{t("About DataMexico")}</h3>
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
