import React from "react";
import {withNamespaces} from "react-i18next";
import {hot} from "react-hot-loader/root";
import axios from "axios";
import {Geomap} from "d3plus-react";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import DMXSelect from "../../components/DMXSelect";
import DMXButtonGroup from "../../components/DMXButtonGroup";
import {Slider} from "@blueprintjs/core";

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
      debug: true
    };
    axios.get("/api/stats/eci", {params}).then(resp => {
      const data = resp.data.data;
      this.setState({
        data,
        loading: false,
        geoSelected: geoSelectedTemp,
        measureSelected: measureSelectedTemp
      });
    });
  }

  render() {
    const {data, loading, geoSelectedTemp, geoSelected, measureSelected, measureSelectedTemp} = this.state;

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
                groupBy: [`${geoSelected.id} ID`],
                colorScale: `${measureSelected.value} ECI`,
                tooltipConfig: {
                  tbody: d => [
                    ["ECI", d[`${measureSelected.value} ECI`]]
                  ]
                },
                tiles: geoSelected.tiles,
                topojson: geoSelected.topojson,
                topojsonId: geoSelected.topojsonId
              }}
            /> : <Loading />}
          </div>
        </div>
      </div>
      <Footer />
    </div>;
  }
}

export default withNamespaces()(hot(ECIExplorer));
