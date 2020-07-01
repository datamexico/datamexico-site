import PropTypes from "prop-types";
import React, {Component} from "react";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import CovidCard from "components/CovidCard";
import CovidTable from "components/CovidTable";
import DMXOverlay from "components/DMXOverlay";
import DMXSearchLocation from "components/DMXSearchLocation";
import DMXSelectLocation from "components/DMXSelectLocation";
import Footer from "components/Footer";
import Loading from "components/Loading";
import Nav from "components/Nav";

import colors from "../../../static/data/colors.json";
import {commas} from "helpers/utils";
import {weekdaysNames, monthsNames} from "helpers/helpers";

import "./Covid.css";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataLoaded: false,
      dataActual: null,
      dataHistorical: null,
      locationArray: null,
      locationBase: undefined,
      locationSelected: []
    };
    this.addNewLocation = this.addNewLocation.bind(this);
  }

  shouldComponentUpdate = (nextProp, nextState) => {
    const prevState = this.state;
    return prevState._dataLoaded !== nextState._dataLoaded
      || prevState.locationBase !== nextState.locationBase
      || prevState.locationSelected !== nextState.locationSelected;
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

  componentDidMount = () => {
    this.fetchData();
  }

  addNewLocation = (location, event) => {
    const {locationBase, locationSelected} = this.state;
    const locationsArray = locationSelected.slice();
    const nextState = {};
    if (event === "base") {
      if (location !== locationBase) {
        if (!locationSelected.includes(location["Location ID"])) locationsArray.push(location["Location ID"]);
        nextState.locationBase = location;
        const index = locationsArray.findIndex(d => d === locationBase["Location ID"]);
        locationsArray.splice(index, 1);
        nextState.locationSelected = locationsArray;
      }
    } else if (event === "add") {
      locationsArray.push(location["Location ID"]);
      nextState.locationSelected = locationsArray;
    } else {
      const index = locationsArray.findIndex(d => d === location["Location ID"]);
      locationsArray.splice(index, index > -1 ? 1 : 0);
      nextState.locationSelected = locationsArray;
    }
    this.setState(nextState);
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
    const overlayContent = <div className="covid-overlay-content">
      <div className="covid-overlay-card-header">
        <h3>Nota Metodológica</h3>
      </div>
      <div className="covid-overlay-card-body">
        <p>Para definir el número de los casos activos y los casos recuperados de COVID-19 en México se utiliza la base de datos abiertos de COVID-19 más reciente.</p>
        <h4>Casos activos:</h4>
        <p>Los casos activos son todos aquellos positivos a SARS-CoV-2 con fecha de inicio de síntomas en los últimos 14 días. Las defunciones de casos activos se consideran parte de los casos activos, porque, desde una perspectiva poblacional, contribuyeron a la transmisión del virus. La forma de calcular los casos activos es la siguiente:</p>
        <ul>
          <li>Se filtran todos los casos positivos (RESULTADO valor “1”) registrados en la base de datos.</li>
          <li>Se cuentan los casos según fecha de inicio de síntomas (FECHA_SINTOMAS) y se consideran solo aquellos con menos de 14 días.</li>
        </ul>
        <h4>Casos recuperados:</h4>
        <p>Los casos recuperados son todos aquellos positivos a SARS-CoV-2 no hospitalizados, con fecha de inicio de síntomas con más de 14 días y sin fecha de defunción. La forma de calcular los casos activos es la siguiente:</p>
        <ul>
          <li>Se filtran todos los casos positivos (RESULTADO valor “1”), ambulatorios (TIPO_PACIENTE valor “1”), sin fecha de defunción (FECHA_DEF valor “99-99-9999”) registrados en la base de datos.</li>
          <li>Se cuentan los casos según fecha de inicio de síntomas (FECHA_SINTOMAS) y según fecha de defunción (FECHA_DEF).</li>
          <li>Al total de casos registrados se restan todos los casos con fecha de inicio de síntomas anterior a los últimos 14 días y los casos con fecha de defunción establecida.</li>
        </ul>
        <h5>Adicionalmente, para la representación de la información, se considera lo siguiente:</h5>
        <ul>
          <li>Las vistas georreferenciadas consideran el lugar de residencia de los pacientes reportados (ENTIDAD_RES y MUNICIPIO_RES).</li>
          <li>Las series temporales consideran la fecha de ingreso (FECHA_INGRESO) para los casos <span className="highlighted">Confirmados</span>, <span className="highlighted">Sospechosos</span> y <span className="highlighted">Negativos</span>.</li>
          <li>Las series temporales consideran la fecha de defunción (FECHA_DEF) para los casos de <span className="highlighted">Defunciones</span>.</li>
        </ul>
      </div>
    </div>

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
            addNewLocation={this.addNewLocation}
          />
          <div className="covid-header-info">
            <h4 className="covid-header-info-date">{`Data actualizada al ${dataUpdateDate.Number + 1} ${dataUpdateDate.Month} ${dataUpdateDate.Year}`}</h4>
            <DMXOverlay
              content={overlayContent}
              icon={"info-sign"}
              tooltip={"Nota Metodológica"}
              buttonToClose={"Entendido"}
            />
          </div>
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
            dataSource={[
              {name: "Secretaria de Salud", link: "https://www.gob.mx/salud/documentos/datos-abiertos-152127"}
            ]}
            dataLimit={60}
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
            baseSelector={[
              {name: "Promedio de 7 Dias", value: "AVG 7 Days", unique: true, id: "baseUnique"},
              {name: "Per Capita", value: "Rate", unique: true, id: "baseUnique"},
              {name: "Cambiar Eje Temporal", value: "true", unique: false, id: "baseAxis"}
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
