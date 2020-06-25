import PropTypes from "prop-types";
import React, {Component} from "react";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import colors from "../../../static/data/colors.json";
import {commas} from "helpers/utils";
import {weekdaysNames, monthsNames} from "helpers/helpers";

import CovidCard from "components/CovidCard";
import CovidTable from "components/CovidTable";
import DMXPreviewStats from "components/DMXPreviewStats";
import DMXSearchLocation from "components/DMXSearchLocation";
import DMXSelectLocation from "components/DMXSelectLocation";
import Footer from "components/Footer";
import Loading from "components/Loading";
import Nav from "components/Nav";

import "./Covid.css";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataLoaded: false,
      dataActual: null,
      dataHistorical: null,
      locationArray: null,
      locationBase: null,
      locationSelected: []
    };
    this.selectNewLocation = this.selectNewLocation.bind(this);
    this.addNewLocation = this.addNewLocation.bind(this);
  }

  /*
  shouldComponentUpdate = (nextProp, nextState) => {
    const prevState = this.state;
    return prevState._dataLoaded !== nextState._dataLoaded
      || prevState.locationBase !== nextState.locationBase
      || prevState.locationSelected !== nextState.locationSelected;
  }
  */

  componentDidMount = () => {
    this.fetchData();
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      const data = resp.data;
      const dataActual = data.data_actual;
      const dataHistorical = data.data_historical;
      const locationArray = data.locations;
      const locationBase = locationArray[0];
      const locationSelected = [locationBase["Location ID"]];
      this.setState({
        _dataLoaded: true,
        dataActual,
        dataHistorical,
        locationArray,
        locationBase,
        locationSelected
      })
    });
  }

  // add these two in to one function
  selectNewLocation = (location) => {
    const {locationBase, locationSelected} = this.state;
    if (!locationSelected.includes(location["Location ID"])) {
      locationSelected.push(location["Location ID"]);
      const index = locationSelected.indexOf(locationBase["Location ID"]);
      locationSelected.splice(index, 1);
      this.setState({
        locationBase: location,
        locationSelected: locationSelected
      });
    } else {
      this.setState({
        locationBase: location
      });
    }
  }

  addNewLocation = (location, event) => {
    const {locationSelected} = this.state;
    if (event) {
      locationSelected.push(location["Location ID"]);
    } else {
      const index = locationSelected.indexOf(location["Location ID"]);
      locationSelected.splice(index, 1);
    }
    this.setState({
      locationSelected: locationSelected
    });
  }

  render() {
    const {
      _dataLoaded,
      dataActual,
      dataHistorical,
      locationArray,
      locationBase,
      locationSelected
    } = this.state;
    const {t} = this.props;

    if (!_dataLoaded) return <Loading />;

    const locationData = dataActual.find(d => d["Location ID"] === locationBase["Location ID"]);
    const locationStats = [
      {id: "stat_new_cases", name: "Nuevos Casos", icon: "nuevo-caso-icon.svg", value: commas(locationData["Daily Cases"])},
      {id: "stat_new_dead", name: "Nuevas Muertes", icon: "nueva-muerte-icon.svg", value: commas(locationData["Daily Deaths"])},
      {id: "stat_lastweek_cases", name: "Casos Última Semana", icon: "casos-ultima-semana-icon.svg", value: commas(locationData["Cases last 7 Days"])},
      {id: "stat_lastweek_dead", name: "Muertes Última Semana", icon: "muertes-ultima-semana-icon.svg", value: commas(locationData["Deaths last 7 Days"])},
      {id: "stat_accum_cases", name: "Casos Confirmados", icon: "casos-confirmados-icon.svg", value: commas(locationData["Accum Cases"])},
      {id: "stat_accum_dead", name: "Muertes Confirmadas", icon: "muertes-confirmadas-icon.svg", value: commas(locationData["Accum Deaths"])}
    ];
    const updateDate = new Date(dataActual[0].Time);
    const dataUpdateDate = {
      Day: weekdaysNames[updateDate.getDay()],
      Number: updateDate.getDate(),
      Month: monthsNames[updateDate.getMonth()],
      Year: updateDate.getFullYear()
    };

    return <div className="covid-wrapper">
      <Helmet title="Coronavirus">
        <meta property="og:title" content={"Coronavirus"} />
      </Helmet>
      <Nav
        className={"background"}
        logo={false}
        routeParams={this.props.router.params}
        routePath={"/:lang"}
        title={""}
      />
      <div className="covid-site">
        <div className="covid-header">
          <DMXSearchLocation
            locationOptions={locationArray}
            locationSelected={locationBase}
            selectNewLocation={this.selectNewLocation}
          />
          <h4 className="covid-header-date">{`Data actualizada al ${dataUpdateDate.Number + 1} ${dataUpdateDate.Month} ${dataUpdateDate.Year}`}</h4>
          <div className="covid-header-stats">
            {locationStats.map(d => (
              <div className="covid-header-stats-stat">
                <img src={`/icons/visualizations/covid/${d.icon}`} alt="" className="covid-header-stats-stat-icon" />
                <div className="covid-header-stats-stat-text">
                  <span className="covid-header-stats-stat-value">{d.value}</span>
                  <span className="covid-header-stats-stat-name">{d.name}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="covid-body container">
          <CovidCard
            cardTitle={"Nuevos casos diarios"}
            cardDescription={<p>
              Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
              </p>}
            data={dataHistorical}
            dataSource={"Datos proveídos por el Gobierno de México."}
            dataLimit={14}
            locationsSelected={locationSelected}
            locationsSelector={
              <DMXSelectLocation
                locationBase={locationBase}
                locationsOptions={locationArray}
                locationsSelected={locationSelected}
                addNewLocation={this.addNewLocation}
              />
            }
            scaleSelector={[
              {name: t("Lineal"), id: "linear"},
              {name: t("Logarítmica"), id: "log"}
            ]}
            indicatorSelector={[
              {name: "Casos Diarios", id: "Daily Cases"},
              {name: "Casos Confirmados", id: "Accum Cases"},
              {name: "Muertes", id: "Accum Deaths"}
            ]}
            visualization={{
              type: "LinePlot",
              config: {
                groupBy: "Location ID",
                height: 400,
                lineLabels: true,
                x: "Time",
                time: "Time",
                timeline: false,
                shapeConfig: {
                  Line: {
                    stroke: d => colors.State[d["Location ID"]] || "#235B4E"
                  }
                }
              }
            }}
          />
        </div>
        <CovidTable />
      </div>
      <Footer />
    </div>;
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
