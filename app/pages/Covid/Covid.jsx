import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import "./Covid.css";

import {weekdaysNames, monthsNames} from "../../helpers/helpers";

import DMXSearchLocation from "../../components/DMXSearchLocation";
import DMXSelectLocation from "../../components/DMXSelectLocation";
import DMXPreviewStats from "../../components/DMXPreviewStats";
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import CovidCard from "../../components/CovidCard";
import {arrayLengthCompare} from "@blueprintjs/core/lib/esm/common/utils";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // New way
      defaultLocation: null,
      selectedLocation: null,
      addedLocations: [],
      // Old way
      locations: null,
      data_country: null,
      data_state: null,
      data_country_historical: null,
      data_state_historical: null,
      _dataLoaded: false
    };
    this.selectNewLocation = this.selectNewLocation.bind(this);
    this.addNewLocation = this.addNewLocation.bind(this);
  }

  componentDidMount = () => {
    this.fetchData();
  }

  shouldComponentUpdate = (nextProp, nextState) => {
    const prevState = this.state;
    // console.log("here", prevState, nextState);
    return nextState._dataLoaded !== prevState._dataLoaded || nextState.selectedLocation !== prevState.selectedLocation;
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      this.setState({
        locations: resp.data.locations,
        data_country: resp.data.data_country,
        data_state: resp.data.data_state,
        data_country_historical: resp.data.data_country_historical,
        data_state_historical: resp.data.data_state_historical,
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
      defaultLocation,
      selectedLocation,
      addedLocations,
      locations,
      data_country,
      data_state,
      data_country_historical,
      data_state_historical,
      _dataLoaded
    } = this.state;

    if (!_dataLoaded) {
      return <Loading />
    }

    if (_dataLoaded) {
      const statsLocation = selectedLocation ? selectedLocation : defaultLocation;
      const statsData = statsLocation.Division === "State" ? data_state.find(d => d["State ID"] === statsLocation.ID) : data_country;
      const locationsInVisualizations = [statsLocation.ID];
      addedLocations.map(d => console.log("here", d));

      // -- Check Later ----------------------------------
      const updateDate = new Date(data_country["Time"]);
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
              locationsArray={locations}
              selectNewLocation={this.selectNewLocation}
            />
            <div className="location-info">
              <h2 className="location-name">{statsLocation.Label}</h2>
              <h3 className="location-division">{statsLocation.Division}</h3>
            </div>
            <DMXPreviewStats
              data={statsData}
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
              description={{
                headline: "Casos Reportados",
                title: "¿Cómo crece el número de casos positivos en México?",
                stat: {
                  value: 28500,
                  id: "Ciudad de México"
                },
                text: <p>
                  Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
              </p>,
                source: "Datos proveídos por el Gobierno de México."
              }}
              selectValue={statsLocation}
              groupOptions={[{name: t("CovidCard.Linear"), id: "linear"}, {name: t("CovidCard.Logarithmic"), id: "log"}]}
              countryData={data_country_historical}
              statesData={data_state_historical}
              limitData={14}
              statID={"Accum Cases"}
              graph={{
                title: "Casos totales confirmados por día",
                date: "08 Junio 2020, 4pm CEST",
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
                  },
                }
              }}
              data_date={dataUpdateDate}
              buttonSelectLocation={
                <DMXSelectLocation
                  locationsArray={locations}
                  locationsInVisualizations={locationsInVisualizations}
                  addNewLocation={this.addNewLocation}
                />
              }
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
