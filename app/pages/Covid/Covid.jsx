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
    return prevState.locationBase !== nextState.locationBase || prevState._dataLoaded !== nextState._dataLoaded;
  }
  */

  componentDidMount = () => {
    this.fetchData();
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      this.setState({
        locations: resp.data.locations,
        data_actual: resp.data.data_actual,
        data_historical: resp.data.data_historical,
        locationBase: resp.data.locations[0],
        locationsSelected: [resp.data.locations[0]["Location ID"]],
        _dataLoaded: true
      })
    });
  }

  selectNewLocation = (location) => {this.setState({locationBase: location});}

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
    const {locations, data_actual, data_historical, locationBase, locationsSelected, _dataLoaded} = this.state;
    console.log("Locations Selected in Covid Component:", locationsSelected);

    if (_dataLoaded) {
      const baseData = data_actual.find(d => d["Location ID"] === locationBase["Location ID"]);

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
          <div className="covid-body container">
            <CovidCard
              cardTitle={"Daily New Cases"}
              cardDescription={<p>
                Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
              </p>}
              data={data_historical}
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
              scaleSelector={[{name: t("CovidCard.Linear"), id: "linear"}, {name: t("CovidCard.Logarithmic"), id: "log"}]}
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
    } else {
      return <Loading />
    }
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
