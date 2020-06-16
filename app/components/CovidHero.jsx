import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {Geomap} from "d3plus-react";

import "./CovidHero.css";

class CovidHero extends Component {
  render() {
    const {stats, geomapData, t} = this.props;

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
            <Geomap
              config={{
                data: geomapData,
                groupBy: ["State ID", "Positive SARS-CoV-2"],
                height: 400,
                legend: false,
                total: false,
                ocean: "transparent",
                topojson: "/topojson/Entities.json",
                topojsonId: d => d.ent_id,
                topojsonFill: d => !d["Country ID"] && "#ffffff",
                zoom: false
              }}
            />
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
