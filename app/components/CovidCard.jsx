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
      selectValue: this.props.selectOptions[0],
      groupValue: this.props.groupOptions[0]
    };
  }

  shouldComponentUpdate = (nextProp, nextState) => {
    return nextState.selectValue !== this.state.selectValue;
  }

  render() {
    const {t, description, selectOptions, groupOptions, countryData, statesData, limitData, statID, graph, data_date} = this.props;
    const {selectValue, groupValue} = this.state;

    const selectedData = selectValue["ID"] === 0 ? countryData.slice(-limitData) : statesData.filter(d => d["State ID"] === selectValue["ID"]).slice(-limitData);
    const selectedStat = {value: selectedData.slice(-1)[0][statID], place: selectValue["Label"]};

    let viz = null;
    graph.config["data"] = selectedData;
    if (graph.type === "LinePlot") {
      viz =
        <LinePlot
          config={graph.config}
          forceUpdate={true}
        />
    }

    return (
      <div className="covid-card covid-columns">

        <div className="covid-card-description covid-column-30">
          <h4 className="covid-card-description-headline">{description.headline}</h4>
          <h3 className="covid-card-description-title">{description.title}</h3>
          <div className="covid-card-description-buttons">
            <DMXButtonGroup
              callback={groupValue => this.setState({groupValue})}
              items={groupOptions}
              selectedItem={groupValue}
            />
          </div>
          <div className="covid-card-description-stat covid-stat">
            <img src="/icons/visualizations/covid/reportados-icon.png" alt="stat-icon" />
            <div className="stat-text">
              <span className="stat">{selectedStat.value}</span>
              <h5>{t("CovidCard.Stat ID")} <span className="id">{selectedStat.place}</span></h5>
            </div>
          </div>
          <div className="covid-card-description-text">{description.text}</div>
          <div className="covid-data-source">
            <span>{t("CovidCard.Source")}</span>
            <h6>{description.source}</h6>
          </div>
        </div>

        <div className="covid-card-graph covid-column-70">
          <div className="covid-card-graph-box">
            <div className="covid-card-graph-box-header">
              <div className="covid-card-graph-box-header-text">
                <h4>{graph.title}</h4>
                <h3>{t("CovidCard.Graph Date")} {`${t(data_date.dateDay)}, ${t(data_date.dateMonth)} ${data_date.dateNumber} ${data_date.dateYear}`}</h3>
              </div>
            </div>
            <div className="covid-card-graph-box-viz">
              {viz}
            </div>
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
