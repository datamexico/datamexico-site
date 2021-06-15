import React, {Component} from 'react';
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Methodology extends Component {
  render() {
    const {t, press} = this.props;
    return (
      <div className="about-methodology">
        <h3>{t("About.methodology")}</h3>

      </div>
    )
  }
}

Methodology.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Methodology);
