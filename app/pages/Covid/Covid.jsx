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
      _dataLoaded: false,
      summary: null,
      geodata: null
    };
  }

  fetchData = () => {
    axios.get("/api/covid").then(resp => {
      this.setState({
        summary: resp.data.summary,
        geodata: resp.data.geodata,
        _dataLoaded: true
      })
    });
  }

  render() {
    const {t} = this.props;
    const {_dataLoaded, summary, geodata} = this.state;
    console.log(summary, geodata);

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
      return <div>
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
        <Loading />
        <Footer />
      </div>;
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
              stats={[
                {name: "CovidCard.Stat1", value: summary["New Positive"], icon: "/"},
                {name: "CovidCard.Stat2", value: summary["Total Dead"], icon: "/"},
                {name: "CovidCard.Stat3", value: summary["Total Positive"], icon: "/"}
              ]}
              geomapData={geodata}
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
              selectOptions={[{name: "Option 1", id: "option_1"}, {name: "Option 2", id: "option_2"}]}
              groupOptions={[{name: t("CovidCard.Linear"), id: "option_1"}, {name: t("CovidCard.Logarithmic"), id: "option_2"}]}
              graph={{
                title: "Casos totales confirmados por día",
                date: "08 Junio 2020, 4pm CEST",
                type: "LinePlot",
                config: {
                  data: exampleData,
                  groupBy: "id",
                  height: 400
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
