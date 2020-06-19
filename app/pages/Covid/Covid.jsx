import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import "./Covid.css";

import {weekdaysNames, monthsNames} from "../../helpers/helpers";

import DMXSearchLocation from "../../components/DMXSearchLocation"
import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import CovidCard from "../../components/CovidCard";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // New way
      defaultLocation: null,
      // Old way
      locations: null,
      data_country: null,
      data_state: null,
      data_country_historical: null,
      data_state_historical: null,
      _dataLoaded: false
    };
    this.selectDefaultLocation = this.selectDefaultLocation.bind(this);
  }

  componentDidMount = () => {
    this.fetchData();
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      this.setState({
        locations: resp.data.locations,
        data_country: resp.data.data_country,
        data_state: resp.data.data_state,
        data_country_historical: resp.data.data_country_historical,
        data_state_historical: resp.data.data_state_historical,
        _dataLoaded: true
      })
    });
  }

  selectDefaultLocation = (location) => {
    this.setState({defaultLocation: location});
  }

  render() {
    const {t} = this.props;
    const {
      defaultLocation,
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
      const timeSelector = [
        {name: t("CovidCard.Today"), id: "Today"},
        {name: t("CovidCard.Week"), id: "Week"},
        {name: t("CovidCard.Historical"), id: "Historical"}
      ];

      const updateDate = new Date(data_country["Time"]);
      const dataUpdateDate = {
        dateDay: weekdaysNames[updateDate.getDay()],
        dateNumber: updateDate.getDate(),
        dateMonth: monthsNames[updateDate.getMonth()],
        dateYear: updateDate.getFullYear()
      };
      console.log(defaultLocation);

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
          <div className="testing">
            <DMXSearchLocation
              locationsArray={locations}
              selectDefaultLocation={this.selectDefaultLocation}
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
              selectOptions={locations}
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
