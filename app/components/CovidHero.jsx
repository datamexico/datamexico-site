import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {LinePlot} from "d3plus-react";

import "./CovidHero.css";

class CovidHero extends Component {
  render() {
    const {stats, t} = this.props;

    return (
      <div className="covid-hero-wrapper">
        <div className="covid-hero-country-stats covid-columns">
          <div className="covid-hero-country-stats-overview covid-column-30">
            <h3>{t("CovidCard.Overview")}</h3>
            {stats.map(d => (
              <div className="covid-hero-country-stats-stat covid-stat">
                <img src={d.icon} alt="stat-icon" />
                <div className="stat-text">
                  <span className="stat">{d.value}</span>
                  <h5>{t(d.name)}</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="covid-hero-country-stats-map covid-column-70">
            Country Stats Map
          </div>
        </div>
      </div >
    )
  }
}

CovidHero.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(CovidHero);
