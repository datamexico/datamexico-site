import React from "react";
import ReactTable from "react-table";
import {withNamespaces} from "react-i18next";
import {hot} from "react-hot-loader/root";
import axios from "axios";
import {Geomap, Plot, Treemap} from "d3plus-react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import DMXSelect from "../../components/DMXSelect";
import DMXButtonGroup from "../../components/DMXButtonGroup";
import {Slider} from "@blueprintjs/core";

import {saveAs} from "file-saver";
import {strip} from "d3plus-text";

import "react-table/react-table.css";
import "./ECIExplorer.css";

const filename = str => strip(str.replace(/<[^>]+>/g, ""))
  .replace(/^\-/g, "")
  .replace(/\-$/g, "");

const geoLevels = (lng = "en") => [
  {
    id: "State",
    name: lng === "en" ? "State" : "Entidad Federativa",
    topojson: "/topojson/Entities.json",
    topojsonId: d => d.properties.ent_id,
    tiles: false
  },
  {
    id: "Municipality",
    name: lng === "en" ? "Municipality" : "Municipio",
    topojson: "/topojson/Municipalities.json",
    topojsonId: d => d.properties.mun_id,
    tiles: false
  },
  {
    id: "Metro Area",
    name: lng === "en" ? "Metropolitan Area" : "Zona Metropolitana",
    topojson: "/topojson/MetroAreas.json",
    topojsonId: d => d.properties.zm_id,
    tiles: true
  }
];

const cubes = {
  denue: {
    name: "DENUE",
    cube: "inegi_denue",
    measures: [
      {title: "Companies", id: "Companies"},
      {title: "Employees", id: "Number of Employees Midpoint"}
    ],
    levels: [
      {name: "Industry Group (4-digit)", id: "Industry Group"},
      {name: "NAICS Industry (5-digit)", id: "NAICS Industry"},
      {name: "National Industry (6-digit)", id: "National Industry"}
    ],
    timeDrilldown: "Month",
    time: [
      {name: "2020-S1", id: 20200417},
      {name: "2019-S2", id: 20191114},
      {name: "2019-S1", id: 20190410},
      {name: "2018-S2", id: 20181130},
      {name: "2018-S1", id: 20180327},
      {name: "2017-S2", id: 20171115},
      {name: "2017-S1", id: 20170331},
      {name: "2016-S2", id: 20161031},
      {name: "2016-S1", id: 20160115},
      {name: "2015-S1", id: 20150225}
    ]
  }
};


class ECIExplorer extends React.Component {
  constructor(props) {
    super(props);
    const cubeSelected = cubes.denue;
    const tempStates = {
      geoSelected: geoLevels(props.lng)[0],
      measureSelected: cubeSelected.measures[0],
      timeSelected: cubeSelected.time[0],
      levelSelected: cubeSelected.levels[0]
    };

    const newTempStates = Object.entries(tempStates).reduce((obj, d) => {
      obj[`${d[0]}Temp`] = d[1];
      return obj;
    }, {});

    this.state = {
      data: [],
      dataPCI: [],
      dataRCA: [],
      loading: true,
      cubeSelected,
      thresholdGeo: 100,
      thresholdIndustry: 100,
      ...tempStates,
      ...newTempStates
    };
  }

  onCSV = (data, title) => {
    const rowDelim = "\r\n";
    const colDelim = ",";

    const columns = data && data[0] ? Object.keys(data[0]) : [];
    let csv = columns.map(val => `\"${val}\"`).join(colDelim);

    for (let i = 0; i < data.length; i++) {
      const results = data[i];
      csv += rowDelim;
      csv += columns.map(key => {
        const val = results[key];
        return typeof val === "number" ? val
          : val ? `\"${val}\"` : "";
      }).join(colDelim);
    }

    const blob = new Blob([csv], {type: "text/csv;charset=utf-8"});
    saveAs(blob, `${filename(title)}.csv`);
  }

  getChangeHandler = key => value => this.setState({[key]: value});

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({data: [], loading: true});
    const {cubeSelected, levelSelectedTemp, geoSelectedTemp, measureSelectedTemp, thresholdGeo, thresholdIndustry, timeSelectedTemp} = this.state;

    const time = timeSelectedTemp.id;
    const timeIndex = cubeSelected.time.findIndex(d => d.id === time);

    const timeList = cubeSelected.time.slice(timeIndex, timeIndex + 3).map(d => d.id);
    const n = timeList.length;
    const timeIds = timeList.join();
    const timeDrilldown = cubeSelected.timeDrilldown || "Year";

    const industryLevel = levelSelectedTemp.id;
    const geoLevel = geoSelectedTemp.id;
    const measure = measureSelectedTemp.id;
    const geoThreshold = thresholdGeo * n;
    const industryThreshold = thresholdIndustry * n;

    const params = {
      cube: "inegi_denue",
      [timeDrilldown]: timeIds,
      rca: [geoLevel, industryLevel, measure].join(),
      threshold: [`${industryLevel}:${industryThreshold}`, `${geoLevel}:${geoThreshold}`].join(),
      debug: true,
      locale: this.props.lng
    };

    axios.all([
      axios.get("/api/stats/eci", {params}),
      axios.get("/api/stats/pci", {params})
    ]).then(axios.spread((...resp) => {
      const data = resp[0].data.data;
      const dataPCI = resp[1].data.data;
      this.fetchRCAData();
      this.setState({
        data,
        dataPCI,
        loading: false,
        geoSelected: geoSelectedTemp,
        timeSelected: timeSelectedTemp,
        levelSelected: levelSelectedTemp,
        measureSelected: measureSelectedTemp
      });
    }));
  }

  fetchRCAData = (geoId = 1, level = undefined) => {
    const year = 2019;
    const yearList = [year];
    const years = yearList.join();
    const {geoSelectedTemp, measureSelectedTemp, thresholdGeo, thresholdIndustry} = this.state;

    const industryLevel = "Industry Group"; // "Industry Group", "NAICS Industry", "National Industry"
    const geoLevel = level || geoSelectedTemp.id; // "State", "Municipality", "Metro Area"
    const measure = measureSelectedTemp.id; // "Number of Employees Midpoint", "Number of Employees LCI", "Number of Employees UCI", "Companies"
    const geoThreshold = thresholdGeo;
    const industryThreshold = thresholdIndustry;

    const params = {
      cube: "inegi_denue",
      Year: years,
      rca: [geoLevel, industryLevel, measure].join(),
      threshold: [`${industryLevel}:${industryThreshold}`, `${geoLevel}:${geoThreshold}`].join(),
      parents: true,
      [`filter_${geoLevel}`]: geoId,
      locale: this.props.lng
    };
    axios.get("/api/stats/rca", {params}).then(resp => {
      const dataRCA = resp.data.data;
      this.setState({dataRCA});
    });
  }

  render() {
    const {
      data,
      dataPCI,
      dataRCA,
      loading,
      geoSelectedTemp,
      geoSelected,
      measureSelected,
      measureSelectedTemp,
      levelSelectedTemp,
      levelSelected,
      timeSelectedTemp,
      timeSelected
    } = this.state;

    const {lng, t} = this.props;

    const eciMeasure = `${measureSelected.id} ECI`;
    const pciMeasure = `${measureSelected.id} PCI`;
    const rcaMeasure = `${measureSelected.id} RCA`;
    const geoId = `${geoSelected.id} ID`;
    const geoName = geoSelected.id;
    const industryId = `${levelSelected.id} ID`;
    const columns = [
      {id: geoId, accessor: geoId, Header: geoId},
      {id: geoName, accessor: d => <a href="" onClick={() => this.fetchRCAData(d[geoId], geoName)}>{d[geoName]}</a>, Header: geoName},
      {id: eciMeasure, accessor: eciMeasure, Header: "ECI"}
    ];
    const columnsPCI = [
      {id: industryId, accessor: industryId, Header: "id"},
      {id: levelSelected.id, accessor: levelSelected.id, Header: levelSelected.name},
      {id: pciMeasure, accessor: pciMeasure, Header: "PCI"}
    ];

    const dataScatter = dataPCI.map(d => {
      const item = dataRCA.find(h => h[industryId] === d[industryId]) || {};
      return {...d, ...item};
    }).filter(d => d[rcaMeasure] && d[pciMeasure]);

    const pciValues = dataScatter.map(d => d[pciMeasure]);
    const rcaValues = dataScatter.map(d => d[rcaMeasure]);
    const maxPCI = Math.max(...pciValues),
          maxRCA = Math.max(...rcaValues),
          minPCI = Math.min(...pciValues);

    return <div>
      <Nav
        className={"background"}
        logo={false}
        routeParams={this.props.router.params}
        routePath={"/:lang"}
        title={""}
      />
      <div className="container eci-container">
        <div className="columns">
          <div className="column is-300">
            <h1 className="title">{t("ECI Explorer.Title")}</h1>
            <p className="eci-explore">
              {t("ECI Explorer.Description")}
            </p>
            <DMXSelect
              callback={measureSelectedTemp => this.setState({measureSelectedTemp})}
              items={this.state.cubeSelected.measures}
              selectedItem={measureSelectedTemp}
              title={t("Measure")}
            />
            <DMXButtonGroup
              items={geoLevels(lng)}
              selected={geoSelectedTemp}
              title="Geo"
              callback={geoSelectedTemp => this.setState({geoSelectedTemp})}
            />
            <DMXSelect
              items={this.state.cubeSelected.levels}
              selectedItem={levelSelectedTemp}
              callback={levelSelectedTemp => this.setState({levelSelectedTemp})}
              title={t("Industry Level")}
            />
            <DMXSelect
              items={this.state.cubeSelected.time}
              selectedItem={timeSelectedTemp}
              callback={timeSelectedTemp => this.setState({timeSelectedTemp})}
              title={t("Time")}
            />
            <div className="dmx-slider">
              <h4 className="title">{geoSelectedTemp.name} con al menos {this.state.thresholdGeo} {measureSelectedTemp.title}</h4>
              <Slider
                min={100}
                max={1000}
                stepSize={10}
                labelStepSize={100}
                onChange={this.getChangeHandler("thresholdGeo")}
                value={this.state.thresholdGeo}
              />
            </div>
            <div className="dmx-slider">
              <h4 className="title">{levelSelectedTemp.name} con al menos {this.state.thresholdIndustry} {measureSelectedTemp.title}</h4>
              <Slider
                min={100}
                max={1000}
                stepSize={10}
                labelStepSize={100}
                onChange={this.getChangeHandler("thresholdIndustry")}
                value={this.state.thresholdIndustry}
              />
            </div>
            <button
              onClick={() => this.fetchData()}
              className="dmx-button"
            >
              {t("ECI Explorer.Build ECI / PCI")}
            </button>
          </div>
          <div className="column">
            {!loading ? <div className="eci-geo-viz">
              <h2 className="title">
                {t("Economic Complexity Index (ECI) ({{time}})", {
                  time: timeSelected.name,
                  geo: geoSelected.name,
                  level: levelSelected.name
                })}
              </h2>
              <h4 className="subtitle">
                {t("{{geo}}, {{level}}", {
                  time: timeSelected.name,
                  geo: geoSelected.name,
                  level: levelSelected.name
                })}
              </h4>
              <Geomap
                config={{
                  data,
                  groupBy: [geoId],
                  colorScale: eciMeasure,
                  colorScaleConfig: {
                    color: ["#00E9BC", "#00C8E4", "#00A4FF", "#007EFF", "#0052EC", "#0000B1"]
                  },
                  tooltipConfig: {
                    tbody: d => [
                      ["ECI", d[eciMeasure]]
                    ]
                  },
                  tiles: true,
                  topojson: geoSelected.topojson,
                  topojsonId: geoSelected.topojsonId
                }}
              />
            </div> : <Loading />}
          </div>
        </div>

        {/* Table section */}
        <div className="columns">
          <div className="column">
            {!loading ? <div>
              <ReactTable
                data={data}
                columns={columns}
                showPagination={false}
                defaultPageSize={data.length}
                minRows={1}
                resizable={false}
                defaultSorted={[{id: eciMeasure, desc: true}]}
                defaultSortDesc={true}
              />
              <button
                className="dmx-button"
                onClick={() => this.onCSV(data, "ECI")}
              >
                {t("ECI Explorer.Download ECI dataset")}
              </button>
            </div> : <Loading />}
          </div>
          <div className="column">
            {!loading ? <div><ReactTable
              data={this.state.dataPCI}
              columns={columnsPCI}
              showPagination={false}
              defaultPageSize={this.state.dataPCI.length}
              minRows={1}
              resizable={false}
              defaultSorted={[{id: pciMeasure, desc: true}]}
              defaultSortDesc={true}
            />
            <button
              onClick={() => this.onCSV(this.state.dataPCI, "PCI")}
              className="dmx-button"
            >
              {t("ECI Explorer.Download PCI dataset")}
            </button>
            </div> : <Loading />}
          </div>
        </div>
        {/* <div className="columns">
          <div className="column">
            <h2 className="title">
              Complejidad Económica de X
            </h2>
          </div>
        </div> */}

        {/* <div className="columns">
          <div className="column">
            <Treemap
              config={{
                data: dataScatter,
                height: 500,
                sum: "Companies",
                groupBy: ["Sector", "Industry Group"]
              }}
            />
          </div>
          <div className="column">
            <Plot
              config={{
                data: dataScatter,
                height: 500,
                x: rcaMeasure,
                annotations: [
                  {
                    data: [
                      {"Sector": null, "Industry Group": null, "x": 1, "y": maxPCI},
                      {"Sector": null, "Industry Group": null, "x": 1, "y": minPCI},
                      {"Sector": null, "Industry Group": null, "x": 0, "y": 0},
                      {"Sector": null, "Industry Group": null, "x": maxRCA, "y": 0}
                    ],
                    shape: "Line",
                    stroke(d) {
                      return d["Industry Group"] === "A" ? "green" : "blue";
                    },
                    strokeDasharray: "10",
                    strokeWidth: 2
                  }
                  // {
                  //   data: [
                  //     {"Industry Group": "B", "x": 1, "y": maxPCI},
                  //     {"Industry Group": "B", "x": 1, "y": minPCI}
                  //   ],
                  //   shape: "Line",
                  //   stroke(d) {
                  //     return "blue";
                  //   },
                  //   strokeDasharray: "10",
                  //   strokeWidth: 2
                  // }
                ],
                size: "Companies",
                xConfig: {
                  scale: "linear",
                  title: "RCA"
                },
                y: pciMeasure,
                yConfig: {
                  scale: "linear",
                  title: "PCI"
                },
                groupBy: ["Sector", "Industry Group"]
              }}
            />
          </div>
        </div> */}

      </div> {/** End of .eci-container */}
      <Footer />
    </div>;
  }
}

export default withNamespaces()(hot(ECIExplorer));
