import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {LinePlot} from "d3plus-react";

import LoadingChart from "./LoadingChart";
import DMXButtonGroup from "./DMXButtonGroup";
import DMXSelect from "./DMXSelect";

import "./CovidCard.css";

class CovidCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleSelected: this.props.scaleSelector[1]
    };
  }

  /*
  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    const prevState = this.state;
    console.log(prevProps.locationsSelected, nextProps.locationsSelected);
    return prevProps.locationsSelected !== nextProps.locationsSelected
    || prevState.scaleSelected !== nextState.scaleSelected;
  }
  */

  scaleSelector = (selected) => {
    this.setState({scaleSelected: selected})
  }

  filterData = (data, selected, limit) => {
    const filterData = [];
    selected.map(d => {
      filterData.push(data.filter(f => f["Location ID"] === d).slice(-limit));
    });
    return filterData.flat();
  }

  createVisualization = (type, config, data) => {
    const {scaleSelected} = this.state;
    let viz = null;
    config["data"] = data;
    config["yConfig"] = {
      scale: scaleSelected.id
    };
    if (type === "LinePlot") {
      viz = <LinePlot
        config={config}
        forceUpdate={true}
      />
    }
    return viz;
  }

  render() {
    const {t, cardTitle, cardDescription, data, dataSource, dataLimit, locationsSelected, locationsSelector, scaleSelector, indicatorSelector, indicatorBase, visualization} = this.props;
    const {scaleSelected} = this.state;
    const selectedData = this.filterData(data, locationsSelected, dataLimit);
    const viz = this.createVisualization(visualization.type, visualization.config, selectedData);

    return (
      <div className="covid-card covid-columns">

        <div className="covid-card-information covid-column-30">
          <h3 className="covid-card-information-title">{cardTitle}</h3>
          <div className="covid-card-information-scale-selector">
            <DMXButtonGroup
              title={"Y-Axis Scale"}
              items={scaleSelector}
              selected={scaleSelected}
              callback={groupValue => this.setState({scaleSelected: groupValue})}
            />
          </div>
          <div className="covid-card-information-description">{cardDescription}</div>
        </div>
        <div className="covid-card-visualization covid-column-70">
          <div className="covid-card-visualization-header">
            {locationsSelector}
          </div>
          <div className="covid-card-visualization-viz">
            {viz}
          </div>
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
