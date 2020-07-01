import PropTypes from "prop-types";
import React, {Component} from "react";
import {LinePlot} from "d3plus-react";
import {withNamespaces} from "react-i18next";

import DMXButtonGroup from "./DMXButtonGroup";
import DMXCheckbox from "components/DMXCheckbox";
import DMXSelect from "./DMXSelect";
import LoadingChart from "./LoadingChart";

import colors from "../../static/data/colors.json";
import {commas} from "helpers/utils";

import "./CovidCard.css";

class CovidCard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      baseAxis: false,
      baseUnique: null,
      indicatorSelected: null,
      ready: false,
      scaleSelected: null
    };
    this.baseSelector = this.baseSelector.bind(this);
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

  componentDidMount = () => {
    const indicatorSelected = this.props.indicatorSelector[0];
    const scaleSelected = this.props.scaleSelector[0];
    this.setState({
      indicatorSelected,
      ready: true,
      scaleSelected
    });
  }

  scaleSelector = (selected) => {
    this.setState({scaleSelected: selected})
  }

  /**
   * This function takes the value of the checkbox component
   * @param {Check or not the checkbox} event
   * @param {Name of the variable in state} id
   * @param {Value of the variable in state} value
   */
  baseSelector = (event, id, value) => {
    const nextState = {};
    nextState[id] = event ? value : null;
    this.setState(nextState);
  }

  filterData = (data, selected, limit) => {
    console.log("filterData", data, selected, limit);
    const filterData = [];
    selected.map(d => {
      filterData.push(data.filter(f => f["Location ID"] === d).slice(-limit));
    });
    return filterData.flat();
  }

  createVisualization = (type, config, data) => {
    const {
      baseAxis,
      baseUnique,
      indicatorSelected,
      scaleSelected
    } = this.state;
    const statId = baseUnique ? `${baseUnique} ${indicatorSelected.id}` : indicatorSelected.id;
    let viz = null;
    config["data"] = data;
    config["y"] = statId;
    config["yConfig"] = {
      scale: scaleSelected.id
    };
    config["tooltipConfig"] = {
      tbody: [
        [indicatorSelected.name, d => commas(d[statId])],
        ["Date", d => d["Time"]]
      ],
      width: "200px"
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
    const {
      t,
      baseSelector,
      cardDescription,
      cardTitle,
      data,
      dataLimit,
      dataSource,
      indicatorSelector,
      locationsSelected,
      locationsSelector,
      scaleSelector,
      visualization
    } = this.props;
    const {
      baseUnique,
      indicatorSelected,
      ready,
      scaleSelected
    } = this.state;
    if (!ready) return <LoadingChart />;

    const selectedData = this.filterData(data, locationsSelected, dataLimit);
    const viz = this.createVisualization(visualization.type, visualization.config, selectedData);
    return (
      <div className="covid-card covid-columns">

        <div className="covid-card-information covid-column-30">
          <h3 className="covid-card-information-title">{cardTitle}</h3>
          {scaleSelector && (
            <div className="covid-card-information-scale-selector">
              <DMXButtonGroup
                title={"Escala Eje-Y"}
                items={scaleSelector}
                selected={scaleSelected}
                callback={groupValue => this.setState({scaleSelected: groupValue})}
              />
            </div>
          )}
          {indicatorSelector && (
            <div className="covid-card-information-stat-selector">
              <DMXSelect
                title={"Indicador"}
                items={indicatorSelector}
                selectedItem={indicatorSelected}
                callback={indicatorSelected => this.setState({indicatorSelected})}
              />
            </div>
          )}
          {baseSelector && (
            <div className="covid-card-information-base-selector">
              <DMXCheckbox
                items={baseSelector}
                unique={baseUnique}
                onChange={this.baseSelector}
              />
            </div>
          )}
          {cardDescription && (<div className="covid-card-information-description">{cardDescription}</div>)}
          {dataSource && (
            <div className="covid-card-information-sources">
              <span className="covid-card-information-sources-title">{"Fuente:"}</span>
              <span className="covid-card-information-sources-text">{"Datos generados por"}</span>
              {dataSource.map((d, k, {length}) => {
                return <div className="covid-card-information-sources-source">
                  <a href={d.link} target="_blank" rel="noopener noreferrer">{d.name}</a>
                  <span>{k + 1 < length ? ", " : "."}</span>
                </div>
              })}
            </div>
          )}
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
