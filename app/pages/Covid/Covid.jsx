import PropTypes from "prop-types";
import React, {Component} from "react";
import axios from "axios";
// import classnames from "classnames";
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
import {commas, percentagenumber} from "helpers/utils";

import "./Covid.css";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      _dataLoaded: false,
      dataDate: null,
      dataGobmxLatest: null,
      dataStats: null,
      dataStatsLatest: null,
      dates: null,
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
    axios.get("/api/covid/").then(resp => {
      const data = resp.data;
      const dates = data.dates;
      const dataDate = data.data_date;
      const dataGobmxLatest = data.covid_gobmx;
      const dataStats = data.covid_stats;
      const dataStatsLatest = dataStats.filter(d => d["Time ID"] === dataDate["Time ID"]);
      const locationArray = data.locations.filter(d => d["Division"] !== "Municipality");
      const locationBase = locationArray[0];
      const locationSelected = [locationBase["Location ID"]];
      this.setState({
        _dataLoaded: true,
        dataDate,
        dataGobmxLatest,
        dataStats,
        dataStatsLatest,
        dates,
        locationArray,
        locationBase,
        locationSelected
      })
    });
  }

  componentDidMount = () => {
    this.fetchData();
  }

  filterData = (data, selected) => {
    const filterData = [];
    selected.map(d => {
      const locationData = data.filter(f => f["Location ID"] === d);
      filterData.push(locationData);
    });
    return filterData.flat();
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

  showDate = (d) => {
    const {t} = this.props;
    const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    const fullDate = new Date(d);
    const day = fullDate.getDay();
    const date = fullDate.getDate() + 1;
    const month = fullDate.getMonth();
    const year = fullDate.getFullYear();
    const hour = fullDate.getHours();
    // console.log("Date:", d, "Fulldate:", fullDate);
    // return `${t(days[day])} ${date} ${t(months[month])} ${year} ${hour}:00`
    return `${d}`
  }

  keepElementsInData = (dataset, keepElements) => {
    const filteredData = dataset.map(d => {
      const row = {};
      for (const index in keepElements) {
        row[keepElements[index]] = d[keepElements[index]];
      }
      return row;
    });
    return filteredData;
  }

  calculateStats = (dataset, division, stats) => {
    const data = dataset.filter(d => d.Division === division);
    const total = data.reduce((acc, element) => (acc + element.Cases), 0);
    const result = [];
    for (const statID in stats) {
      const statValues = [...new Set(data.map(d => d[stats[statID]]))];
      for (const statValueID in statValues) {
        const count = data.reduce((acc, element) => (element[stats[statID]] === statValues[statValueID] ? acc + element.Cases : acc), 0);
        const statRow = {
          stat: stats[statID],
          value: statValues[statValueID],
          count: count,
          percentage: count / total
        };
        console.log(statRow);
        result.push(statRow);
      }
    }
    return result;
  }

  render() {
    const {
      _dataLoaded,
      dataDate,
      dataGobmxLatest,
      dataStats,
      dataStatsLatest,
      dates,
      locationArray,
      locationBase,
      locationSelected
    } = this.state;
    const {t} = this.props;

    if (!_dataLoaded) return <Loading />;

    const lastWeekDates = dates.map(d => d["Time ID"]);
    const minLastDayDate = Math.min(...lastWeekDates);

    // Date of the data
    const showDate = this.showDate(dataDate.Time);

    // Stats showed in the hero
    const locationBaseData = dataStatsLatest.find(d => d["Location ID"] === locationBase["Location ID"]);
    // console.log(locationBaseData);
    const locationSelectedData = this.filterData(dataStats, locationSelected);
    locationSelectedData.map(d => d["Type"] = lastWeekDates.includes(d["Time ID"]) ? 1 : 0);

    const lastWeekData = locationSelectedData.filter(d => lastWeekDates.includes(d["Time ID"]));

    const _lastWeekData = lastWeekData.map(d => {
      const h = Object.assign({}, d, {"Type": 2, "Daily Cases": d["Time ID"] !== minLastDayDate ? d["Daily Suspect"] : d["Daily Cases"]});
      return h;
    });
    locationSelectedData.push(..._lastWeekData);

    const minLastDayData = Object.assign({}, locationSelectedData.find(d => d["Time ID"] === minLastDayDate), {"Type": 0});
    locationSelectedData.push(minLastDayData);

    const locationStats = [
      {id: "stat_new_cases", name: "Contagios", subname: "En los últimos 7 días", icon: "nuevo-caso-icon.svg", value: commas(locationBaseData["Last 7 Daily Cases"])},
      {id: "stat_new_dead", name: "Fallecidos", subname: "En los últimos 7 días", icon: "nueva-muerte-icon.svg", value: commas(locationBaseData["Last 7 Daily Deaths"])},
      {id: "stat_lastweek_cases", name: "Casos Sospechosos", subname: "A la fecha", icon: "casos-ultima-semana-icon.svg", value: commas(locationBaseData["Accum Suspect"])},
      {id: "stat_lastweek_dead", name: "Hospitalizados", subname: "Sobre el total de contagiados", icon: "muertes-ultima-semana-icon.svg", value: percentagenumber(locationBaseData["Accum Hospitalized"] / locationBaseData["Accum Cases"])},
      {id: "stat_accum_cases", name: "Total Contagios Confirmados", icon: "casos-confirmados-icon.svg", value: commas(locationBaseData["Accum Cases"])},
      {id: "stat_accum_dead", name: "Total Fallecidos Confirmados", icon: "muertes-confirmadas-icon.svg", value: commas(locationBaseData["Accum Deaths"])}
    ];

    // Data loader for the barchart of agerange
    const ageRangeDataLocations = this.filterData(dataGobmxLatest.filter(d => d["Covid Result ID"] === 1), locationSelected);
    const barChartStats = this.calculateStats(ageRangeDataLocations, locationBase.Division, ["Is Dead", "Patient Type", "Sex"]);
    // console.log(barChartStats);
    const ageRangeDictionary = [...new Set(ageRangeDataLocations.sort((a, b) => a["Age Range ID"] - b["Age Range ID"]).map(d => d["Age Range"]))];
    // console.log("ageRangeDataLocations", ageRangeDataLocations);

    // filter data elements in array by key
    const confirmedData = this.keepElementsInData(dataStats, ["Time ID", "Time", "Daily Cases", "Location ID", "Location"]);
    // console.log("Confirmed Data", confirmedData);

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
            <h4 className="covid-header-info-date">{`Data actualizada al ${showDate}`}</h4>
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
                  {d.subname && (<span className="covid-header-stats-stat-subname">{d.subname}</span>)}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="covid-body container">
          {/*
          <CovidCard
            cardInformation={{
              title: "Testing"
            }}
            locationsSelector={null}
            baseSelector={null}
            scaleOptions={[
              {name: t("Lineal"), id: "linear"},
              {name: t("Logarítmica"), id: "log"}
            ]}
            indicatorVariable={"y"}
            indicatorOptions={[
              {name: "Casos Diarios", id: "Daily Cases"},
              {name: "Casos Confirmados", id: "Accum Cases"},
              {name: "Muertes Diarias", id: "Daily Deaths"},
              {name: "Muertes Confirmadas", id: "Accum Deaths"}
            ]}
            visualization={{
              data: locationSelectedData,
              type: "LinePlot",
              groupBy: "Location ID",
              height: 400,
              lineLabels: true,
              x: "Time",
              time: "Time",
              timeline: false,
              tooltipConfig: {
                tbody: [
                  ["Casos Diarios", d => d["Daily Cases"]],
                  ["Casos Acumulados", d => d["Accum Cases"]],
                  ["Muertes Diarias", d => d["Daily Deaths"]],
                  ["Muertes Acumuladas", d => d["Accum Deaths"]],
                  ["Date", d => d["Time"]]
                ]
              },
              shapeConfig: {
                Line: {
                  stroke: d => colors.State[d["Location ID"]] || "#235B4E"
                }
              }
            }}
          />
          */}
          <CovidCard
            cardInformation={{
              title: "Nuevos casos diarios",
              description: <div className="card-description">
                <p>
                  Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
                </p>
                <p className="italic">La data posee un desfase de 7 días.</p>
              </div>,
              source: [{name: "Secretaria de Salud", link: "https://www.gob.mx/salud/documentos/datos-abiertos-152127"}]
            }}
            locationsSelector={
              <DMXSelectLocation
                locationBase={locationBase}
                locationsOptions={locationArray}
                locationsSelected={locationSelected}
                addNewLocation={this.addNewLocation}
              />
            }
            baseSelector={[
              {name: "Promedio de 7 Dias", value: "AVG 7 Days", unique: true, id: "baseUnique"},
              {name: "Per Capita", value: "Rate", unique: true, id: "baseUnique"},
              {name: "Cambiar Eje Temporal", value: "true", unique: false, id: "baseAxis"}
            ]}
            scaleOptions={[
              {name: t("Lineal"), id: "linear"},
              {name: t("Logarítmica"), id: "log"}
            ]}
            indicatorVariable={"y"}
            indicatorOptions={[
              {name: "Casos Diarios", id: "Daily Cases"},
              {name: "Casos Confirmados", id: "Accum Cases"},
              {name: "Muertes Diarias", id: "Daily Deaths"},
              {name: "Muertes Confirmadas", id: "Accum Deaths"}
            ]}
            visualization={{
              data: locationSelectedData,
              type: "LinePlot",
              groupBy: ["Location", "Type"],
              height: 400,
              lineLabels: true,
              x: "Time",
              time: "Time",
              timeline: false,
              tooltipConfig: {
                title: d => d["Location"],
                tbody: d => {
                  const tBody = [
                    [d["Type"] === 2 ? "Sospechas Diarias" : "Casos Diarios", d["Daily Cases"]],
                    ["Casos Acumulados", d["Accum Cases"]],
                    ["Muertes Diarias", d["Daily Deaths"]],
                    ["Muertes Acumuladas", d["Accum Deaths"]],
                    ["Date", d["Time"]]
                  ];

                  return tBody;
                }
              },
              shapeConfig: {
                label: d => d.Type ? d.Location : "",
                Line: {
                  stroke: d => colors.State[d["Location ID"]] || "#235B4E",
                  strokeDasharray: d => d.Type ? "10" : "0"
                }
              }
            }}
          />
          <CovidCard
            cardInformation={{
              title: "Rangos de edad",
              description: <div className="card-description">
                <p>
                  Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
                </p>
                <p className="italic">La data posee un desfase de 7 días.</p>
              </div>,
              source: [{name: "Secretaria de Salud", link: "https://www.gob.mx/salud/documentos/datos-abiertos-152127"}]
            }}
            locationsSelector={null}
            baseSelector={null}
            scaleOptions={[
              {name: t("Lineal"), id: "linear"}
            ]}
            indicatorVariable={"groupBy"}
            indicatorOptions={[
              {name: "Muertos", id: "Is Dead"},
              {name: "Tipo de Paciente", id: "Patient Type"},
              {name: "Sexo", id: "Sex"}
            ]}
            indicatorStats={barChartStats}
            visualization={{
              data: ageRangeDataLocations,
              type: "BarChart",
              height: 500,
              x: "Age Range ID",
              xConfig: {
                title: "Age Range",
                tickFormat: d => ageRangeDictionary[d - 1]
              },
              y: "Cases",
              yConfig: {
                title: "Cases"
              },
              stacked: true,
              tooltipConfig: {
                tbody: [
                  ["Age Range", d => d["Age Range"]],
                  ["Cases", d => commas(d["Cases"])]
                ]
              }
            }}
          />
        </div>
        {/* <CovidTable /> */}
      </div>
      <Footer />
    </div>;
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
