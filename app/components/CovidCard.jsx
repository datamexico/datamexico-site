import PropTypes from "prop-types";
import React, {Component} from "react";
import * as d3plus from "d3plus-react";
import {withNamespaces} from "react-i18next";
import {formatAbbreviate} from "d3plus-format";

import "./CovidCard.css";

class CovidCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    const prevState = this.state;
    return prevProps.visualization !== nextProps.visualization;
  }

  createViz = (vizData) => {
    const d3VizTypes = {...d3plus};
    const vizConfig = Object.assign({}, vizData);
    const type = vizConfig.type;
    delete vizConfig.type;
    const Visualization = d3VizTypes[type];
    const viz = <Visualization
      config={vizConfig}
      forceUpdate={true}
    />;
    return viz;
  }

  render() {
    const {
      baseSelector,
      cardInformation,
      indicatorSelector,
      indicatorStats,
      locationsSelector,
      overlay,
      scaleSelector,
      timeScaleSelector,
      visualization
    } = this.props;

    const viz = this.createViz(visualization);
    return (
      <div className="covid-card covid-columns">
        <div className="covid-card-information covid-column-left">
          {cardInformation.title && (
            <div className="covid-card-information-title">
              <h3>{cardInformation.title}</h3>
              {overlay && (
                <div className="covid-card-information-title-overlay">
                  {overlay}
                </div>
              )}
            </div>
          )}
          {scaleSelector && (
            <div className="covid-card-information-scale-selector">
              {scaleSelector}
            </div>
          )}
          {timeScaleSelector && (
            <div className="covid-card-information-scale-selector">
              {timeScaleSelector}
            </div>
          )}
          {indicatorSelector && (
            <div className="covid-card-information-stat-selector">
              {indicatorSelector}
            </div>
          )}
          {baseSelector && (
            <div className="covid-card-information-base-selector">
              {baseSelector}
            </div>
          )}
          {indicatorStats && (
            <div className="covid-card-information-stats">
              {indicatorStats.map(d => (
                <div className="covid-card-information-stats-stat">
                  <span className="stat-value">{d.value}</span>
                  <span className="stat-percentage">{`${formatAbbreviate(d.percentage) * 100}%`}</span>
                </div>
              ))}
            </div>
          )}
          {cardInformation.description && (
            <div className="covid-card-information-description">{cardInformation.description}</div>
          )}
          {cardInformation.source && (
            <div className="covid-card-information-sources">
              <span className="covid-card-information-sources-title">{"Fuente:"}</span>
              <span className="covid-card-information-sources-text">{"Datos generados por"}</span>
              {cardInformation.source.map((d, k, {length}) => {
                return <div className="covid-card-information-sources-source">
                  <a href={d.link} target="_blank" rel="noopener noreferrer">{d.name}</a>
                  <span>{k + 1 < length ? ", " : "."}</span>
                </div>
              })}
            </div>
          )}
        </div>
        <div className="covid-card-visualization covid-column-right">
          {locationsSelector && (
            <div className="covid-card-visualization-header">
              {locationsSelector}
            </div>
          )}
          {visualization && (
            <div className="covid-card-visualization-viz">
              {viz}
            </div>
          )}
        </div>
      </div>
    )
  }
}

CovidCard.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(CovidCard);
