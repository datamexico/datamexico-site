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
      data_actual: null,
      data_historical: null,
      defaultLocation: null,
      selectedLocation: null,
      addedLocations: [],
      _dataLoaded: false
    };
    this.selectNewLocation = this.selectNewLocation.bind(this);
    this.addNewLocation = this.addNewLocation.bind(this);
  }

  shouldComponentUpdate = (nextProp, nextState) => {
    const prevState = this.state;
    return nextState._dataLoaded !== prevState._dataLoaded || nextState.selectedLocation !== prevState.selectedLocation;
  }

  componentDidMount = () => {
    this.fetchData();
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      this.setState({
        locations: resp.data.locations,
        data_actual: resp.data.data_actual,
        data_historical: resp.data.data_historical,
        defaultLocation: resp.data.locations[0],
        _dataLoaded: true
      })
    });
  }

  selectNewLocation = (location) => {
    this.setState({selectedLocation: location});
  }

  addNewLocation = (location, event) => {
    const {addedLocations} = this.state;
    event ? this.setState({addedLocations: addedLocations.push(location.ID)}) : console.log(`Remove location ${location.Label} from array of objects`);
  }

  render() {
    const {t} = this.props;
    const {
      locations,
      data_actual,
      data_historical,
      defaultLocation,
      selectedLocation,
      addedLocations,
      _dataLoaded
    } = this.state;

    if (!_dataLoaded) {
      return <Loading />
    }

    if (_dataLoaded) {
      const baseLocation = selectedLocation ? selectedLocation : defaultLocation;
      const baseData = data_actual.find(d => d["Location ID"] === baseLocation["Location ID"]);
      const locationsInVisualizations = [baseLocation["Location ID"]];
      addedLocations.map(d => console.log("here", d));

      // -------------------- Check Later ------------------------
      const updateDate = new Date(data_actual[0]["Time"]);
      const dataUpdateDate = {
        dateDay: weekdaysNames[updateDate.getDay()],
        dateNumber: updateDate.getDate(),
        dateMonth: monthsNames[updateDate.getMonth()],
        dateYear: updateDate.getFullYear()
      };
      // ---------------------------------------------------------

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
              locationSelected={baseLocation}
              selectNewLocation={this.selectNewLocation}
            />
            <DMXPreviewStats
              data={baseData}
              stats={[
                {ID: "Daily Cases", Name: "New Cases"},
                {ID: "Daily Deaths", Name: "New Deaths"},
                {ID: "Cases last 7 Days", Name: "Last Week Cases"},
                {ID: "Deaths last 7 Days", Name: "Last Week Deaths"},
                {ID: "Accum Cases", Name: "Confirmed Cases"},
                {ID: "Accum Deaths", Name: "Confirmed Deaths"}
              ]}
            />
          </div>
          {/*
          <DMXSelectLocation
            locationsArray={locations}
            locationsInVisualizations={locationsInVisualizations}
            addNewLocation={this.addNewLocation}
          />
          */}
          <div className="covid-body container">
            <CovidCard
              baseLocation={baseLocation}
              cardTitle={"Daily New Cases"}
              cardDescription={<p>
                Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
              </p>}
              data={data_historical}
              dataSource={"Datos proveídos por el Gobierno de México."}
              dataLimit={14}
              scaleSelector={[{name: t("CovidCard.Linear"), id: "linear"}, {name: t("CovidCard.Logarithmic"), id: "log"}]}
              indicatorSelector={[]}
              indicatorBase={[]}
              visualization={{
                type: "LinePlot",
                config: {
                  groupBy: "State ID",
                  height: 400,
                  x: "Time ID",
                  y: "Daily Cases",
                  sum: "Daily Cases",
                  tooltipConfig: {
                    title: d => "Coronavirus",
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
    }
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
