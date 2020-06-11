import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import CovidHero from "../../components/CovidHero";
import CovidCard from "../../components/CovidCard";

import "./Covid.css";

class Covid extends Component {
  render() {
    const exampleData = [
      {id: "alpha", x: 4, y: 7},
      {id: "alpha", x: 5, y: 25},
      {id: "alpha", x: 6, y: 13},
      {id: "beta", x: 4, y: 17},
      {id: "beta", x: 5, y: 8},
      {id: "beta", x: 6, y: 13}
    ];

    return <div className="covid-page">
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
      <div className="covid-header">
        <CovidHero
          stats={[
            {name: "CovidCard.Stat1", value: "3593", icon: "/"},
            {name: "CovidCard.Stat2", value: "13699", icon: "/"},
            {name: "CovidCard.Stat3", value: "117103", icon:"/"}
          ]}
        />
      </div>
      <div className="covid-body container">
        <CovidCard
          headline={"Casos Reportados"}
          title={"¿Cómo crece el número de casos positivos en México?"}
          stat={{
            value: 28500,
            id: "Ciudad de México"
          }}
          text={<p>
            Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
          </p>}
          source={"Datos proveídos por el Gobierno de México."}
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
        <CovidCard
          headline={"Casos Reportados"}
          title={"¿Cómo crece el número de casos positivos en México?"}
          stat={{
            value: 28500,
            id: "Ciudad de México"
          }}
          text={<p>
            Las pruebas y los desafíos limitados en la atribución de la causa de la muerte signifca que el número de muertes confrmadas puede no ser un recuento exacto del número verdadero de muertes por COVID-19.
          </p>}
          source={"Datos proveídos por el Gobierno de México."}
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
      <Footer />
    </div>;
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
