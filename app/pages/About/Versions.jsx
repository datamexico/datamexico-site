import React, {Component} from 'react'
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Versions extends Component {
  render() {
    const {t, versions} = this.props;
    return (
      <div className="about-versions">
        <h3>{t("About.Versions")}</h3>
        {versions.length > 0 && versions.map(d => (
          <div>
            {d.Version && <h5>{d.Version}</h5>}
            <h4>{d.Features}</h4>
            <p>{d.Description}</p>
          </div>
        ))}
      </div>
    )
  }
}

Versions.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Versions);
