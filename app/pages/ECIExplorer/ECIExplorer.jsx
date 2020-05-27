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

import "react-table/react-table.css";
import "./ECIExplorer.css";

const geoLevels = [
  {
    id: "State",
    name: "State",
    topojson: "/topojson/Entities.json",
    topojsonId: d => d.properties.ent_id,
    tiles: false
  },
  {
    id: "Municipality",
    name: "Municipalities",
    topojson: "/topojson/Municipalities.json",
    topojsonId: d => d.properties.mun_id,
    tiles: false
  },
  {
    id: "Metro Area",
    name: "Metropolitan Zones",
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
      {title: "Companies", value: "Companies"},
      {title: "Employees", value: "Number of Employees Midpoint"}
    ]
  }
};


class ECIExplorer extends React.Component {
  constructor(props) {
    super(props);
    const cubeSelected = cubes.denue;
    const tempStates = {
      geoSelected: geoLevels[0],
      measureSelected: cubeSelected.measures[0]
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

  getChangeHandler = key => value => this.setState({[key]: value});

  componentDidMount() {
    this.fetchData();
  }

  fetchData = () => {
    this.setState({data: [], loading: true});
    const year = 2019;
    const yearList = [year];
    const years = yearList.join();
    const {geoSelectedTemp, measureSelectedTemp, thresholdGeo, thresholdIndustry} = this.state;

    const industryLevel = "Industry Group"; // "Industry Group", "NAICS Industry", "National Industry"
    const geoLevel = geoSelectedTemp.id; // "State", "Municipality", "Metro Area"
    const measure = measureSelectedTemp.value; // "Number of Employees Midpoint", "Number of Employees LCI", "Number of Employees UCI", "Companies"
    const geoThreshold = thresholdGeo;
    const industryThreshold = thresholdIndustry;

    const params = {
      cube: "inegi_denue",
      Year: years,
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
    const measure = measureSelectedTemp.value; // "Number of Employees Midpoint", "Number of Employees LCI", "Number of Employees UCI", "Companies"
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
      measureSelectedTemp
    } = this.state;

    const eciMeasure = `${measureSelected.value} ECI`;
    const pciMeasure = `${measureSelected.value} PCI`;
    const rcaMeasure = `${measureSelected.value} RCA`;
    const geoId = `${geoSelected.id} ID`;
    const geoName = geoSelected.id;
    const industryId = "Industry Group ID";
    const columns = [
      {id: geoId, accessor: geoId, Header: geoId},
      {id: geoName, accessor: d => <a href="" onClick={() => this.fetchRCAData(d[geoId], geoName)}>{d[geoName]}</a>, Header: geoName},
      {id: eciMeasure, accessor: eciMeasure, Header: "ECI"}
    ];
    const columnsPCI = [
      {id: industryId, accessor: "Industry Group ID", Header: "Industry Group ID"},
      {id: "Industry Group", accessor: "Industry Group", Header: "Industry Group"},
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
            <h1 className="title">ECI Ranking</h1>
            <p className="eci-explore">
              Explora la complejidad económica de Entidades Federativas, Municipios y Zonas Metropolitanas en México.
            </p>
            <DMXSelect
              items={this.state.cubeSelected.measures}
              selectedItem={measureSelectedTemp}
              callback={measureSelectedTemp => this.setState({measureSelectedTemp})}
            />
            <DMXButtonGroup
              items={geoLevels}
              selected={geoSelectedTemp}
              callback={geoSelectedTemp => this.setState({geoSelectedTemp})}
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
              <h4 className="title">Industry Group con al menos {this.state.thresholdIndustry} {measureSelectedTemp.title}</h4>
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
              Build ECI Ranking
            </button>
          </div>
          <div className="column">
            {!loading ? <Geomap
              config={{
                data,
                height: 500,
                groupBy: [geoId],
                colorScale: eciMeasure,
                tooltipConfig: {
                  tbody: d => [
                    ["ECI", d[eciMeasure]]
                  ]
                },
                tiles: geoSelected.tiles,
                topojson: geoSelected.topojson,
                topojsonId: geoSelected.topojsonId
              }}
            /> : <Loading />}
          </div>
        </div>

        {/* Table section */}
        <div className="columns">
          <div className="column">
            {!loading ? <ReactTable
              data={data}
              columns={columns}
              showPagination={false}
              defaultPageSize={data.length}
              minRows={1}
              resizable={false}
              defaultSorted={[{id: eciMeasure, desc: true}]}
              defaultSortDesc={true}
            /> : <Loading />}
          </div>
          <div className="column">
            {!loading ? <ReactTable
              data={this.state.dataPCI}
              columns={columnsPCI}
              showPagination={false}
              defaultPageSize={this.state.dataPCI.length}
              minRows={1}
              resizable={false}
              defaultSorted={[{id: pciMeasure, desc: true}]}
              defaultSortDesc={true}
            /> : <Loading />}
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h2 className="title">
              Complejidad Económica de X
            </h2>
          </div>
        </div>

        <div className="columns">
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
        </div>

      </div> {/** End of .eci-container */}
      <Footer />
    </div>;
  }
}

export default withNamespaces()(hot(ECIExplorer));
