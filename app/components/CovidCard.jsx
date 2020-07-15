import PropTypes from "prop-types";
import React, {Component} from "react";
import * as d3plus from "d3plus-react";
import {withNamespaces} from "react-i18next";

import DMXButtonGroup from "./DMXButtonGroup";
import DMXCheckbox from "components/DMXCheckbox";
import DMXSelect from "./DMXSelect";
import LoadingChart from "./LoadingChart";

import colors from "../../static/data/colors.json";
import {commas} from "helpers/utils";

import "./CovidCard.css";

/*
Props that CovidCard component accept (* if you don't wanna use it, just give a null value):
cardInformation* => type: dictionary / properties: title, description and source
locationsSelector => type: component / uses the locationsSelector component
baseOptions* => type: array of dictionaries / properties: name, value, unique, id
                 unique: true or false if
*/

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
      cardInformation,
      indicatorOptions,
      indicatorStats,
      indicatorSelector,
      locationsSelector,
      baseSelector,
      scaleSelector,
      visualization
    } = this.props;

    const viz = this.createViz(visualization);
    return (
      <div className="covid-card covid-columns">
        <div className="covid-card-information covid-column-30">
          {cardInformation.title && (
            <h3 className="covid-card-information-title">{cardInformation.title}</h3>
          )}
          {scaleSelector && (
            <div className="covid-card-information-scale-selector">
              {scaleSelector}
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
        <div className="covid-card-visualization covid-column-70">
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

/*
   )
           Source:
   <div className="covid-data-source">
           <span>{t("CovidCard.Source")}</span>
           <h6>{description.source}</h6>
         </div>
   visTitle
   <div className="covid-card-graph-box-header-text">
             <h4>{graph.title}</h4>
             <h3>{t("CovidCard.Graph Date")} {`${t(data_date.dateDay)}, ${t(data_date.dateMonth)} ${data_date.dateNumber} ${data_date.dateYear}`}</h3>
           </div>

           // callback={groupValue => this.setState({groupValue})}
   */
