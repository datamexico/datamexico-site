import React, {Component} from "react";
import PropTypes from "prop-types";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Infoapi extends Component {
  render() {
    const {t, lng, infoapi} = this.props;
    const intro1 = {
      es: "Para acceder de forma rápida y dinámica a los datos disponibles en dataMéxico se utiliza Tesseract UI, un explorador dinámico de API’s disponible en el siguiente enlace: ",
      en: "To quickly and dynamically access the data available in dataMéxico, Tesseract UI is used, a dynamic API's explorer available al the following link: "
    }
    const intro2 = {
      es: "Tesseract UI le permite visualizar los datos consultados en su interfaz y le otoga la posibilidad de descargar los datos para sus propios análisis en formato CSV, JSON Tidy y JSON Arrays.",
      en: "Tesseract UI allows you to view the queried data in its interface and gives you the possibility to download the data for your own analysis in CSV, JSON Tidy and JSON Arrays formats."
    }

    return (
      <div className="about-infoapi">
        <h3>{t("About.Access to data")}</h3>
        <p>{intro1[lng]} <a href="https://api.datamexico.org/ui" target="_blank" rel="noopener noreferrer">api.datamexico.org/ui</a></p>
        <p>{intro2[lng]} </p>

          {infoapi.length > 0 && infoapi.map(d => (
            <div className="press-news">
              <p>{d.Text}</p>
              <ul>
                <li><a href={d.Link} target="_blank" rel="noopener noreferrer">{d.Concept}</a></li>
                <p>{d.Description}</p>
              </ul>
            </div>
          ))}
      </div>
    )
  }
}

Infoapi.contextTypes = {
          router: PropTypes.object
};

export default withNamespaces()(hot(Infoapi));
