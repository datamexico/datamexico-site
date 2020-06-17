import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Loading from "../../components/Loading";
import CovidHero from "../../components/CovidHero";
import CovidCard from "../../components/CovidCard";

import "./Covid.css";

class Covid extends Component {
  constructor(props) {
    super(props);
    this.state = {
      states: null,
      data_country: null,
      data_state: null,
      data_country_historical: null,
      data_state_historical: null,
      _dataLoaded: false
    };
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      this.setState({
        states: resp.data.states,
        data_country: resp.data.data_country,
        data_state: resp.data.data_state,
        data_country_historical: resp.data.data_country_historical,
        data_state_historical: resp.data.data_state_historical,
        _dataLoaded: true
      })
    });
  }

  render() {
    const {t} = this.props;
    const {
      states,
      data_country,
      data_state,
      data_country_historical,
      data_state_historical,
      _dataLoaded
    } = this.state;

    const exampleData = [
      {id: "alpha", x: 4, y: 7},
      {id: "alpha", x: 5, y: 25},
      {id: "alpha", x: 6, y: 13},
      {id: "beta", x: 4, y: 17},
      {id: "beta", x: 5, y: 8},
      {id: "beta", x: 6, y: 13}
    ];

    if (!_dataLoaded) {
      this.fetchData();
      return <Loading />
    }

    if (_dataLoaded) {
      return <div className="covid">
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
            <CovidHero
              data_country={data_country}
              data_state={data_state}
              timeSelector={[
                {name: t("CovidCard.Today"), id: "Today"},
                {name: t("CovidCard.Week"), id: "Week"},
                {name: t("CovidCard.Historical"), id: "Historical"}
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
              selectOptions={states}
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
                  x: "Reported Date ID",
                  y: "Daily Cases",
                  sum: "Daily Cases",
                  tooltipConfig: {
                    title: d => "test",
                    tbody: [
                      ["Daily Cases", d => d["Daily Cases"]],
                      ["Accum Cases", d => d["Accum Cases"]],
                      ["Date", d => d["Reported Date"]]
                    ],
                    width: "200px"
                  },
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
