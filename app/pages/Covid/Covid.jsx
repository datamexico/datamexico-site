import React, {Component} from "react";
import HelmetWrapper from "../HelmetWrapper";
import PropTypes from "prop-types";
import axios from "axios";
import {connect} from "react-redux";
import {formatAbbreviate} from "d3plus-format";
import {mean} from "d3-array";
import {withNamespaces} from "react-i18next";
// import {hot} from "react-hot-loader/root";
// import classnames from "classnames";

import CovidCard from "components/CovidCard";
import CovidTable from "components/CovidTable";
import DMXButtonGroup from "components/DMXButtonGroup";
import DMXCheckbox from "components/DMXCheckbox";
import DMXMethodologicalNote from "components/DMXMethodologicalNote";
import DMXSearchLocation from "components/DMXSearchLocation";
import DMXSelect from "components/DMXSelect";
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
      locationSelected: [],
      progressStatOptions: null,
      progressStatSelected: undefined,
      progressScaleOptions: null,
      progressScaleSelected: undefined,
      progressTimeScaleOptions: null,
      progressTimeScaleSelected: undefined,
      progressBaseSelected: null,
      ageRangesStatOptions: null,
      ageRangesStatSelected: undefined
    };
    this.addNewLocation = this.addNewLocation.bind(this);
    this.resetBaseLocation = this.resetBaseLocation.bind(this);
    this.selectBaseOption = this.selectBaseOption.bind(this);
  }

  shouldComponentUpdate = (nextProp, nextState) => {
    const prevState = this.state;
    return prevState._dataLoaded !== nextState._dataLoaded
      || prevState.locationBase !== nextState.locationBase
      || prevState.locationSelected !== nextState.locationSelected
      || prevState.progressStatSelected !== nextState.progressStatSelected
      || prevState.progressScaleSelected !== nextState.progressScaleSelected
      || prevState.progressTimeScaleSelected !== nextState.progressTimeScaleSelected
      || prevState.progressBaseSelected !== nextState.progressBaseSelected
      || prevState.ageRangesStatSelected !== nextState.ageRangesStatSelected;
  }

  fetchData = () => {
    axios.get("/api/covid/").then(resp => {
      const {t} = this.props;
      const {slug} = this.props.params;
      // Load the data from the database
      const data = resp.data;
      const dates = data.dates;
      const dataDate = data.data_date;
      const dataGobmxLatest = data.covid_gobmx;
      const dataStats = data.covid_stats;
      const dataStatsLatest = dataStats.filter(d => d["Time ID"] === dataDate["Time ID"]);
      const locationArray = data.locations.filter(d => d["Division"] !== "Municipality");
      const locationBase = slug ? locationArray.find(d => d["Location ID"] * 1 === slug * 1) ? locationArray.find(d => d["Location ID"] * 1 === slug * 1) : locationArray[0] : locationArray[0];
      const locationSelected = [locationBase["Location ID"]];

      // Create variables for the visualizations
      const progressStatOptions = [
        {name: t("Daily Cases"), id: "Daily Cases"},
        {name: t("Accum Cases"), id: "Accum Cases"},
        {name: t("Daily Deaths"), id: "Daily Deaths"},
        {name: t("Accum Deaths"), id: "Accum Deaths"}
      ];
      const progressStatSelected = progressStatOptions[0];
      const progressScaleOptions = [
        {name: t("Linear"), id: "linear"},
        {name: t("Logarithmic"), id: "log"}
      ];
      const progressScaleSelected = progressScaleOptions[0];
      const progressTimeScaleOptions = [
        {name: t("Date"), id: "time"},
        {name: t("Days"), id: "days"}
      ];
      const progressTimeScaleSelected = progressTimeScaleOptions[0];
      const ageRangesStatOptions = [
        {name: t("Confirmed"), id: "Confirmed"},
        {name: t("Deceased"), id: "Deceased"},
        {name: t("Hospitalized"), id: "Hospitalized"},
        {name: t("Patient Type"), id: "Patient Type"}
      ];
      const ageRangesStatSelected = ageRangesStatOptions[0];

      this.setState({
        _dataLoaded: true,
        dataDate,
        dataGobmxLatest,
        dataStats,
        dataStatsLatest,
        dates,
        locationArray,
        locationBase,
        locationSelected,
        progressStatOptions,
        progressStatSelected,
        progressScaleOptions,
        progressScaleSelected,
        progressTimeScaleOptions,
        progressTimeScaleSelected,
        ageRangesStatOptions,
        ageRangesStatSelected
      })
    });
  }

  componentDidMount = () => {
    this.fetchData();
  }

  selectBaseOption = (event, value, id) => {
    const nextState = {};
    if (event) {
      nextState[id] = value;
    } else {
      nextState[id] = null;
    }
    this.setState(nextState);
  }

  filterData = (data, selected, division = null) => {
    const filterData = [];
    selected.map(d => {
      const locationData = data.filter(f => f["Location ID"] === d);
      filterData.push(locationData);
    });
    const returnData = division ? filterData.flat().filter(d => d.Division === division) : filterData.flat();
    return returnData;
  }

  resetBaseLocation = (location) => {
    this.setState({
      locationBase: location,
      locationSelected: [location["Location ID"]]
    })
  }

  addNewLocation = (location, event) => {
    const {locationSelected} = this.state;
    const locationsArray = locationSelected.slice();
    if (event === "add") {
      locationsArray.push(location["Location ID"]);
    } else {
      const index = locationsArray.findIndex(d => d === location["Location ID"]);
      locationsArray.splice(index, index > -1 ? 1 : 0);
    }
    this.setState({
      locationSelected: locationsArray
    });
  }

  showDate = (d) => {
    const {t} = this.props;
    const months = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
    const days = ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"];
    const fullDate = new Date(d);
    const day = fullDate.getDay();
    const date = fullDate.getDate() + 1;
    const month = fullDate.getMonth();
    const year = fullDate.getFullYear();
    const hour = fullDate.getHours();
    // return `${t(days[day])} ${date} ${t(months[month])} ${year} ${hour}:00`
    return {day: date, month , year};
  }

  calculateStats = (dataset, divisionArray, stats) => {
    const division = divisionArray.includes("Nation") ? "Nation" : divisionArray.includes("State") ? "State" : "Municipality";
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
          percentage: (count / total) * 100
        };
        result.push(statRow);
      }
    }
    return result;
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
      locationSelected,
      progressStatOptions,
      progressStatSelected,
      progressScaleOptions,
      progressScaleSelected,
      progressTimeScaleOptions,
      progressTimeScaleSelected,
      progressBaseSelected,
      ageRangesStatOptions,
      ageRangesStatSelected
    } = this.state;
    const {t, lng, route, routeParams} = this.props;

    const routePath = !routeParams.slug ? route.path.split("(")[0] : route.path;

    if (!_dataLoaded) return <Loading />;

    // Date of the data
    const showDate = this.showDate(dataDate.Time);
    const securityDate = dates[dates.length - 1];
    const locationSelectedArray = locationArray.filter(d => locationSelected.includes(d["Location ID"]));
    const locationDivisions = [...new Set(locationSelectedArray.map(d => d["Division"]))];

    // Stats showed in the hero
    const locationBaseData = dataStatsLatest.find(d => d["Location ID"] === locationBase["Location ID"]);
    const locationStats = [
      {id: "stat_new_cases", name: t("Covid Profile.Stats.Daily Cases"), subname: t("Covid Profile.Stats.Daily Cases Subtitle"), icon: "nuevo-caso-icon.svg", value: commas(locationBaseData["Last 7 Daily Cases"])},
      {id: "stat_new_dead", name: t("Covid Profile.Stats.Daily Deaths"), subname: t("Covid Profile.Stats.Daily Deaths Subtitle"), icon: "nueva-muerte-icon.svg", value: commas(locationBaseData["Last 7 Daily Deaths"])},
      {id: "stat_lastweek_cases", name: t("Covid Profile.Stats.Accum Suspect"), subname: t("Covid Profile.Stats.Accum Suspect Subtitle"), icon: "casos-ultima-semana-icon.svg", value: commas(locationBaseData["Accum Suspect"])},
      {id: "stat_lastweek_dead", name: t("Covid Profile.Stats.Accum Suspect Hospitalized"), subname: t("Covid Profile.Stats.Accum Suspect Hospitalized Subtitle"), icon: "muertes-ultima-semana-icon.svg", value: percentagenumber(locationBaseData["Accum Hospitalized"] / locationBaseData["Accum Cases"])},
      {id: "stat_accum_cases", name: t("Covid Profile.Stats.Accum Cases"), icon: "casos-confirmados-icon.svg", value: commas(locationBaseData["Accum Cases"])},
      {id: "stat_accum_dead", name: t("Covid Profile.Stats.Accum Deaths"), icon: "muertes-confirmadas-icon.svg", value: commas(locationBaseData["Accum Deaths"])}
    ];

    // Graph #1: LinePlot data for covid new daily cases stats
    // Select the data for the value selected on the stat selector
    const progressStatDataLocations = this.filterData(dataStats, locationSelected);
    let progressStatData = "";
    let progressStatTooltip = {};
    let progressStatTimeScale = {};
    if (progressStatSelected.id === "Daily Cases" || progressStatSelected.id === "Accum Cases") {
      const statsToKeep = ["Time ID", "Time", "Location ID", "Location", "Division", "Daily Cases", "Accum Cases", "AVG 7 Days Daily Cases", "AVG 7 Days Accum Cases", "Rate Daily Cases", "Rate Accum Cases", "Days from 50 Cases"];
      progressStatData = this.keepElementsInData(progressStatDataLocations, statsToKeep);
      progressStatTooltip = {
        Daily: {name: t("Daily Cases"), value: "Daily Cases"},
        Accum: {name: t("Accum Cases"), value: "Accum Cases"},
        RateDaily: {name: t("Rate Daily Cases"), value: "Rate Daily Cases"},
        RateAccum: {name: t("Rate Accum Cases"), value: "Rate Accum Cases"},
      };
      progressStatTimeScale = {name: "Días (eje inicia con al menos 50 contagios)", value: "Days from 50 Cases"};
    } else if (progressStatSelected.id === "Daily Deaths" || progressStatSelected.id === "Accum Deaths") {
      const statsToKeep = ["Time ID", "Time", "Location ID", "Location", "Division", "Daily Deaths", "Accum Deaths", "AVG 7 Days Daily Deaths", "AVG 7 Days Accum Deaths", "Rate Daily Deaths", "Rate Accum Deaths", "Days from 10 Deaths"];
      progressStatData = this.keepElementsInData(progressStatDataLocations, statsToKeep);
      progressStatTooltip = {
        Daily: {name: t("Daily Deaths"), value: "Daily Deaths"},
        Accum: {name: t("Accum Deaths"), value: "Accum Deaths"},
        RateDaily: {name: t("Rate Daily Deaths"), value: "Rate Daily Deaths"},
        RateAccum: {name: t("Rate Accum Deaths"), value: "Rate Accum Deaths"},
      };
      progressStatTimeScale = {name: "Días (eje inicia con al menos 10 fallecidos)", value: "Days from 10 Deaths"};
    }
    // Creates the dashed line for the last week values
    progressStatData.map(d => d["Type"] = d["Time ID"] > securityDate["Time ID"] ? 1 : 0);
    const securityDateData = progressStatData.filter(d => d["Time ID"] === securityDate["Time ID"]).map(d => {
      const h = Object.assign({}, d, {"Type": 1});
      return h;
    });
    progressStatData.push(...securityDateData);
    // Creates the configuration of the vis
    const progressStatVisConfig = {
      data: progressStatData.filter(d => d["Time ID"] > 20200315),
      type: "LinePlot",
      groupBy: ["Location ID", "Type"],
      y: progressBaseSelected ? `${progressBaseSelected} ${progressStatSelected.id}` : progressStatSelected.id,
      yConfig: {
        title: progressScaleSelected.id === "linear" ? progressStatSelected.name : `${progressStatSelected.name} (Log)`,
        scale: progressScaleSelected.id
      },
      label: d => d["Location"],
      lineLabels: true,
      legend: false,
      height: 500,
      tooltipConfig: {
        title: d => {
          const imgUrl = d["Division"] === "Nation"
            ? "/icons/visualizations/Country/country_mex.png"
            : `/icons/visualizations/State/png/white/${d["Location ID"]}.png`;
          const bgColor = colors.State[d["Location ID"]] || "transparent";
          const title = d["Location"];
          let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
          tooltip += `<div class="icon" style="background-color: ${bgColor}"><img src="${imgUrl}" /></div>`;
          tooltip += `<div class="title"><span>${title}</span></div>`;
          tooltip += "</div>";
          return tooltip;
        },
        tbody: d => {
          const tBody = [
            [t("Date"), d["Time"]],
            [progressStatTooltip.Daily.name, commas(d[progressStatTooltip.Daily.value])],
            [progressStatTooltip.Accum.name, commas(d[progressStatTooltip.Accum.value])],
            [progressStatTooltip.RateDaily.name, formatAbbreviate(d[progressStatTooltip.RateDaily.value])],
            [progressStatTooltip.RateAccum.name, formatAbbreviate(d[progressStatTooltip.RateAccum.value])]
          ];
          return tBody;
        },
        footer: d => d["Type"] * 1 === 1 ? t("Data Warning") : ""
      },
      shapeConfig: {
        Line: {
          label: d => d.Type ? d.Location : "",
          stroke: d => colors.State[d["Location ID"]] || "#235B4E",
          strokeDasharray: d => d.Type ? "10" : "0"
        }
      }
    };
    if (progressTimeScaleSelected.id === "time") {
      progressStatVisConfig.time = "Time";
      progressStatVisConfig.timeline = false;
      progressStatVisConfig.x = "Time";
      progressStatVisConfig.xConfig = {};
      progressStatVisConfig.xConfig.tickFormat = undefined;
      progressStatVisConfig.xConfig.title = t("Date");
      delete progressStatVisConfig.discrete;
      delete progressStatVisConfig.xSort;
    } else {
      progressStatVisConfig.discrete = "x";
      progressStatVisConfig.x = progressStatTimeScale.value;
      progressStatVisConfig.xConfig = {};
      progressStatVisConfig.xConfig.tickFormat = (d => d % 12 === 0 ? d : "");
      progressStatVisConfig.xConfig.title = progressStatTimeScale.name;
      progressStatVisConfig.xSort = ((a, b) => a[progressStatTimeScale.value] > b[progressStatTimeScale.value] ? 1 : -1);
      delete progressStatVisConfig.time;
      delete progressStatVisConfig.timeline;
    };

    // Graph #2: Stacked BarChart with the data separated by age ranges
    let ageRangesDataLocations = null;
    let ageRangesStats = null;
    let ageRangesGroupBy = null;
    const ageRangesDivision = locationDivisions.includes("Nation") ? "Nation" : locationDivisions.includes("State") ? "State" : "Municipality";
    if (ageRangesStatSelected.id === "Confirmed") {
      ageRangesDataLocations = this.filterData(dataGobmxLatest.filter(d => d["Covid Result ID"] === 1), locationSelected, ageRangesDivision);
      ageRangesStats = this.calculateStats(ageRangesDataLocations, locationDivisions, ["Sex"]);
      ageRangesGroupBy = "Sex";
    } else if (ageRangesStatSelected.id === "Deceased") {
      ageRangesDataLocations = this.filterData(dataGobmxLatest.filter(d => d["Covid Result ID"] === 1 && d["Is Dead ID"] === 1), locationSelected, ageRangesDivision);
      ageRangesStats = this.calculateStats(ageRangesDataLocations, locationDivisions, ["Sex"]);
      ageRangesGroupBy = "Sex";
    } else if (ageRangesStatSelected.id === "Hospitalized") {
      ageRangesDataLocations = this.filterData(dataGobmxLatest.filter(d => d["Covid Result ID"] === 1 && d["Patient Type ID"] === 2), locationSelected, ageRangesDivision);
      ageRangesStats = this.calculateStats(ageRangesDataLocations, locationDivisions, ["Sex"]);
      ageRangesGroupBy = "Sex";
    } else {
      ageRangesDataLocations = this.filterData(dataGobmxLatest.filter(d => d["Covid Result ID"] === 1), locationSelected, ageRangesDivision);
      ageRangesStats = this.calculateStats(ageRangesDataLocations, locationDivisions, ["Patient Type"]);
      ageRangesGroupBy = "Patient Type";
    }
    const ageRangesVisConfig = {
      data: ageRangesDataLocations,
      type: "BarChart",
      groupBy: ageRangesGroupBy,
      height: 500,
      x: "Age Range",
      xSort: (a, b) => a["Age Range ID"] - b["Age Range ID"],
      xConfig: {
        title: t("Age Range")
      },
      sum: "Cases",
      y: "Cases",
      yConfig: {
        title: t("Cases")
      },
      aggs: {
        "Age Range ID": mean,
        "Covid Result ID": mean,
        "Is Dead ID": mean,
        "Patient Type ID": mean,
        "Sex ID": mean
      },
      label: d => formatAbbreviate(d["Cases"]),
      stacked: true,
      stackOrder: "ascending",
      tooltipConfig: {
        tbody: [
          [t("Cases"), d => commas(d["Cases"])],
          [t("Age Range"), d => d["Age Range"]]
        ]
      },
      legendConfig: {
        label: d => d[ageRangesGroupBy]
      },
    };

    const overlayContent = <div className="covid-overlay-content">
      <div className="covid-overlay-card-header">
        <h3>{t("Covid Profile.Overlay.Title")}</h3>
      </div>
      <div className="covid-overlay-card-body">
        <p dangerouslySetInnerHTML={{__html: t("Covid Profile.Overlay.Subtitle")}} />
        <h4>{t("Covid Profile.Overlay.Positive Cases Title")}</h4>
        <p>{t("Covid Profile.Overlay.Positive Cases Subtitle")}</p>
        <ul>
          <li>{t("Covid Profile.Overlay.Positive Cases 1")}</li>
          <li>{t("Covid Profile.Overlay.Positive Cases 2")}</li>
          <li>{t("Covid Profile.Overlay.Positive Cases 3")}</li>
        </ul>
        <h4>{t("Covid Profile.Overlay.Death Cases Title")}</h4>
        <p>{t("Covid Profile.Overlay.Death Cases Subtitle")}</p>
        <ul>
          <li>{t("Covid Profile.Overlay.Death Cases 1")}</li>
          <li>{t("Covid Profile.Overlay.Death Cases 2")}</li>
          <li>{t("Covid Profile.Overlay.Death Cases 3")}</li>
        </ul>
      </div>
    </div>

    const share = {
      title: t("Share.Coronavirus Title"),
      desc: t("Share.Coronavirus")
    };

    return <div className="covid-wrapper">
      <HelmetWrapper info={share} />

      <Nav
        className={"background"}
        logo={false}
        routePath={routePath}
        routeParams={routeParams}
        title={""}
      />

      <div className="covid-site">
        <div className="covid-header">
          <DMXSearchLocation
            locationOptions={locationArray}
            locationSelected={locationBase}
            resetBaseLocation={this.resetBaseLocation}
          />
          <div className="covid-header-info">
            <h4 className="covid-header-info-date">{t("Data Actualization", {day: showDate.day, month: showDate.month, year: showDate.year})}</h4>
          </div>
          <div className="covid-header-stats">
            {locationStats.map((d, i) => (
              <div className="covid-header-stats-stat" key={`covid_stat_header_${i}`}>
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
          <CovidCard
            cardInformation={{
              title: t("Covid Profile.Card.Daily Cases.Title"),
              description: <p dangerouslySetInnerHTML={{__html: t("Covid Profile.Card.Daily Cases.Description")}}/>,
              source: [{name: "Secretaria de Salud", link: "https://www.gob.mx/salud/documentos/datos-abiertos-152127"}]
            }}
            overlay={
              <DMXMethodologicalNote
                content={overlayContent}
              />
            }
            locationsSelector={
              <DMXSelectLocation
                locationsOptions={locationArray}
                locationsSelected={locationSelected}
                addNewLocation={this.addNewLocation}
              />
            }
            baseSelector={
              <DMXCheckbox
                items={[
                  {name: t("AVG 7 Days"), value: "AVG 7 Days", unique: true, id: "baseUnique"},
                  {name: t("Per Capita"), value: "Rate", unique: true, id: "baseUnique"}
                ]}
                variable={"progressBaseSelected"}
                selected={progressBaseSelected}
                onChange={this.selectBaseOption}
              />
            }
            scaleSelector={
              <DMXButtonGroup
                title={t("Y Axis")}
                items={progressScaleOptions}
                selected={progressScaleSelected}
                callback={progressScaleSelected => this.setState({progressScaleSelected})}
              />
            }
            timeScaleSelector={
              <DMXButtonGroup
                title={t("Time Scale")}
                items={progressTimeScaleOptions}
                selected={progressTimeScaleSelected}
                callback={progressTimeScaleSelected => this.setState({progressTimeScaleSelected})}
              />
            }
            indicatorSelector={
              <DMXSelect
                title={t("Measure")}
                items={progressStatOptions}
                selectedItem={progressStatSelected}
                callback={progressStatSelected => this.setState({progressStatSelected})}
              />
            }
            visualization={progressStatVisConfig}
          />
          <CovidCard
            cardInformation={{
              title: t("Covid Profile.Card.Age Range.Title"),
              description: <div className="card-description">
                <p>{t("Covid Profile.Card.Age Range.Date", {day: showDate.day, month: showDate.month, year: showDate.year})}</p>
                {locationDivisions.includes("Nation")
                  ? <p dangerouslySetInnerHTML={{__html: t("Covid Profile.Card.Age Range.Nation", {lng: lng})}}/>
                  : locationDivisions.includes("State")
                    ? <p dangerouslySetInnerHTML={{__html: t("Covid Profile.Card.Age Range.States")}}/>
                    : <p> </p>
                }
              </div>,
              source: [{name: "Secretaria de Salud", link: "https://www.gob.mx/salud/documentos/datos-abiertos-152127"}]
            }}
            overlay={
              <DMXMethodologicalNote
                content={overlayContent}
              />
            }
            locationsSelector={
              <DMXSelectLocation
                locationsOptions={locationArray}
                locationsSelected={locationSelected}
                addNewLocation={this.addNewLocation}
              />
            }
            indicatorSelector={
              <DMXSelect
                title={t("Measure")}
                items={ageRangesStatOptions}
                selectedItem={ageRangesStatSelected}
                callback={ageRangesStatSelected => this.setState({ageRangesStatSelected})}
              />
            }
            indicatorStats={ageRangesStats}
            visualization={ageRangesVisConfig}
          />
        </div>

        <CovidTable
          data={dataStats}
          date={dataDate}
          locations={locationArray}
        />
      </div>

      <Footer />
    </div>;
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(
  connect(state => ({
    baseUrl: state.env.BASE
  }))(Covid)
);
