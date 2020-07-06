import React, {Component} from "react";
import PropTypes from "prop-types";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Background extends Component {
  render() {
    const {t} = this.props;
    return (
      <div className="about-background">
        <h3 className="background-title">{t("About DataMexico")}</h3>
        <p>DataMéxico es un esfuerzo conjunto entre la Secretaría de Economía (SE) y Datawheel, que permite la integración, visualización y análisis de datos para mejorar la toma de decisiones de políticas públicas enfocadas en fomentar la innovación, inclusión y diversicación de la economía mexicana.</p>
        <p>¿Por qué México necesita una plataforma de datos?Para transformar datos en conocimiento y conocimiento en decisiones estratégicas se necesitan herramientas que ayuden a integrar información de diversas fuentes y que conviertan datos en narrativas articuladas.</p>
        <p>Actualmente, el problema principal de los sitios de datos abiertos se encuentra en la dicultad para encontrar y combinar diferentes fuentes de información, visualizarla y procesarla para tomar decisiones acertadas.</p>
        <p>DataMéxico integrará una diversa gama de bases de datos sobre comercio, producción, empleo, educación y demografía (entre otros) para todo el país, con alta resolución espacial a nivel regional y municipal. La plataforma será fundamental para elaborar una política industrial, de innovación y de desarrollo regional que genere riqueza en el país.</p>
        <p>Más allá de la integración de datos, DataMéxico incluirá también un componente de investigación, que generará análisis especializados y propuestas de política pública para la economía del país a n de promover una estructura productiva, diversa y sosticada. Este eje se pretende llevar a cabo en colaboración con instituciones educativas y de investigación nacionales e internacionales.</p>
        <p>La plataforma será pública, gratuita y de código abierto para uso del gobierno y de todos los actores interesados; industrial y empresarial, academia, sociedad civil, gobiernos locales, entre otros.</p>
      </div>
    )
  }
}

Background.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(hot(Background));
