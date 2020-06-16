import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {Geomap} from "d3plus-react";

import DMXButtonGroup from "./DMXButtonGroup";

import "./CovidHero.css";

class CovidHero extends Component {
  constructor(props) {
    super(props);
    this.state = {
      timeSelected: this.props.timeSelector[0]
    };
  }

  render() {
    const {data_country, data_state, timeSelector, t} = this.props;
    const {timeSelected} = this.state;

    const overviewStats = timeSelected.id === "Today"
      ? [
        {name: "CovidCard.Stats.Daily Cases", value: data_country[0]["Daily Cases"], icon: "/icons/visualizations/covid/nuevos-casos-icon.png"},
        {name: "CovidCard.Stats.Daily Deaths", value: data_country[0]["Daily Deaths"], icon: "/icons/visualizations/covid/muertos-icon.png"},
        {name: "CovidCard.Stats.Accum Cases", value: data_country[0]["Accum Cases"], icon: "/icons/visualizations/covid/casos-confirmados-icon.png"}
      ]
      : timeSelected.id === "Week"
        ? [
          {name: "CovidCard.Stats.Cases last 7 Days", value: data_country[0]["Cases last 7 Days"], icon: "/icons/visualizations/covid/nuevos-casos-icon.png"},
          {name: "CovidCard.Stats.Deaths last 7 Days", value: data_country[0]["Deaths last 7 Days"], icon: "/icons/visualizations/covid/muertos-icon.png"},
          {name: "CovidCard.Stats.Accum Cases", value: data_country[0]["Accum Cases"], icon: "/icons/visualizations/covid/casos-confirmados-icon.png"}
        ]
        : [
          {name: "CovidCard.Stats.Accum Deaths", value: data_country[0]["Accum Deaths"], icon: "/icons/visualizations/covid/muertos-icon.png"},
          {name: "CovidCard.Stats.Accum Cases", value: data_country[0]["Accum Cases"], icon: "/icons/visualizations/covid/casos-confirmados-icon.png"},
        ];

    const geomapTooltipBody =
      timeSelected.id === "Today"
        ? [
          ["Daily Cases", d => d["Daily Cases"]],
          ["Daily Deaths", d => d["Daily Deaths"]]
        ]
        : timeSelected.id === "Week"
          ? [
            ["Cases last 7 Days", d => d["Cases last 7 Days"]],
            ["Deaths last 7 Days", d => d["Deaths last 7 Days"]]
          ]
          : [
            ["Accum Cases", d => d["Accum Cases"]],
            ["Accum Deaths", d => d["Accum Deaths"]]
          ];

    return (
      <div className="covid-hero-wrapper">
        <div className="covid-hero-header">
          <div className="covid-hero-header-flag">
            <img src="/icons/visualizations/Country/country_mex.png" alt="mexican-flag" />
          </div>
          <div className="covid-hero-header-text">
            <h4>CORONAVIRUS (COVID-19) EN MÉXICO</h4>
            <h3>Última actualización de datos: {data_country[0]["Reported Date"]}</h3>
          </div>
        </div>
        <div className="covid-hero-stats covid-columns">
          <div className="covid-hero-stats-overview covid-column-30">
            <h3>{t("CovidCard.Overview")}</h3>
            {overviewStats.map(d => (
              <div className="covid-hero-stats-stat covid-stat">
                <img src={d.icon} alt="stat-icon" />
                <div className="stat-text">
                  <span className="stat">{d.value}</span>
                  <h5>{t(d.name)}</h5>
                </div>
              </div>
            ))}
          </div>
          <div className="covid-hero-stats-map covid-column-70">
            <div className="covid-hero-stats-map-buttons">
              <DMXButtonGroup
                callback={timeSelected => this.setState({timeSelected})}
                items={timeSelector}
                selectedItem={timeSelected}
              />
            </div>
            <div className="covid-hero-stats-map-viz">
              <Geomap
                config={{
                  data: data_state,
                  groupBy: "State ID",
                  height: 500,
                  legend: false,
                  total: false,
                  ocean: "transparent",
                  tooltipConfig: {
                    tbody: geomapTooltipBody
                  },
                  shapeConfig: {
                    Path: {
                      fill: "#cad9ddff",
                      stroke: "#eff2f2ff",
                      strokeWidth: 1.5
                    }
                  },
                  topojson: "/topojson/Entities.json",
                  topojsonId: d => d.properties.ent_id
                }}
              />
            </div>
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
