import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";
import {arrayLengthCompare} from "@blueprintjs/core/lib/esm/common/utils";

import "./Covid.css";

import {weekdaysNames, monthsNames} from "../../helpers/helpers";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import CovidCard from "../../components/CovidCard";
import DMXSearchLocation from "../../components/DMXSearchLocation";
import DMXSelectLocation from "../../components/DMXSelectLocation";
import DMXPreviewStats from "../../components/DMXPreviewStats";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      locations: null,
      dataActual: null,
      dataHistorical: null,
      locationBase: null,
      locationsSelected: [],
      _dataLoaded: false
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
      this.setState({
        locations: resp.data.locations,
        dataActual: resp.data.data_actual,
        dataHistorical: resp.data.data_historical,
        locationBase: resp.data.locations[0],
        locationsSelected: [resp.data.locations[0]["Location ID"]],
        _dataLoaded: true
      })
    });
  }

  selectNewLocation = (location) => {
    const {locationBase, locationsSelected} = this.state;
    if (!locationsSelected.includes(location["Location ID"])) {
      locationsSelected.push(location["Location ID"]);
      const index = locationsSelected.indexOf(locationBase["Location ID"]);
      locationsSelected.splice(index, 1);
      this.setState({
        locationBase: location,
        locationsSelected: locationsSelected
      });
    } else {
      this.setState({
        locationBase: location
      });
    }
  }

  addNewLocation = (location, event) => {
    const {locationsSelected} = this.state;
    if (event) {
      locationsSelected.push(location["Location ID"]);
    } else {
      const index = locationsSelected.indexOf(location["Location ID"]);
      locationsSelected.splice(index, 1);
    }
    this.setState({
      locationsSelected: locationsSelected
    });
  }

  render() {
    const {t} = this.props;
    const {locations, dataActual, dataHistorical, locationBase, locationsSelected, _dataLoaded} = this.state;

    if (_dataLoaded) {
      const baseData = dataActual.find(d => d["Location ID"] === locationBase["Location ID"]);
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
              locationOptions={locations}
              locationSelected={locationBase}
              selectNewLocation={this.selectNewLocation}
            />
            <h4 className="covid-header-date">{`Data actualizada al ${dataUpdateDate.Number + 1} ${dataUpdateDate.Month} ${dataUpdateDate.Year}`}</h4>
            <DMXPreviewStats
              data={baseData}
              stats={[
                {ID: "Daily Cases", Name: "Nuevos Casos", IconName: "nuevo-caso-icon.svg"},
                {ID: "Daily Deaths", Name: "Nuevas Muertes", IconName: "nueva-muerte-icon.svg"},
                {ID: "Cases last 7 Days", Name: "Casos Última Semana", IconName: "casos-ultima-semana-icon.svg"},
                {ID: "Deaths last 7 Days", Name: "Muertes Última Semana", IconName: "muertes-ultima-semana-icon.svg"},
                {ID: "Accum Cases", Name: "Casos Confirmados", IconName: "casos-confirmados-icon.png"},
                {ID: "Accum Deaths", Name: "Muertes Confirmadas", IconName: "muertes-confirmadas-icon.svg"}
              ]}
            />
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
              locationsSelected={locationsSelected}
              locationsSelector={
                <DMXSelectLocation
                  locationsOptions={locations}
                  locationsSelected={locationsSelected}
                  addNewLocation={this.addNewLocation}
                />
              }
              scaleSelector={[{name: t("Lineal"), id: "linear"}, {name: t("Logarítmica"), id: "log"}]}
              indicatorSelector={[]}
              indicatorBase={[]}
              visualization={{
                type: "LinePlot",
                config: {
                  groupBy: "Location ID",
                  height: 400,
                  x: "Time ID",
                  y: "Daily Cases",
                  tooltipConfig: {
                    title: d => d["Location"],
                    tbody: [
                      ["Daily Cases", d => d["Daily Cases"]],
                      ["Accum Cases", d => d["Accum Cases"]],
                      ["Date", d => d["Time"]]
                    ],
                    width: "200px"
                  }
                }
              }}
            />
          </div>
        </div>
        <Footer />
      </div>;
    } else {
      return <Loading />
    }
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
