import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {hot} from "react-hot-loader/root";
import axios from "axios";

import {LOGOS} from "helpers/consts.js";
import homeTiles from "helpers/homeTiles";
import {backgroundID} from "helpers/utils";
import TileV2 from "../components/TileV2";
import TileTitle from "../components/TileTitle";
import HeroSearch from "../components/HeroSearch";
import CustomTile from "../components/CustomTile";

import "../styles/SharePanel.css";
import tilesES from "../../static/tiles/es.json";
import tilesEN from "../../static/tiles/es.json";

// NewHome Used Things

import Footer from "../components/Footer";
import Nav from "../components/Nav";

import HelmetWrapper from "./HelmetWrapper";

import "./Home.css";

const CancelToken = axios.CancelToken;
let cancel;

class Home extends Component {
  state = {
    scrolled: false
  };

  componentDidMount = () => {
    window.addEventListener("scroll", this.handleScroll);
  }

  componentWillUnmount = () => {
    window.removeEventListener("scroll", this.handleScroll);
  }

  handleScroll = () => {
    if (window.scrollY > 5) {
      this.setState({scrolled: true});
    }
    else {
      this.setState({scrolled: false});
    }
  };

  render() {
    const {scrolled} = this.state;
    const {t, lng, router} = this.props;
    const tiles = lng === "es" ? tilesES : tilesEN;

    const share = {
      //default values, see: HelmetWrapper.jsx
    }

    return (
      <div className="home">
        <HelmetWrapper info={share} />
        <Nav
          className={scrolled ? "background" : ""}
          logo={false}
          routeParams={router.params}
          routePath={"/:lang"}
          title={""}
        />
        <div className="home-hero" style={{backgroundImage: `url(/images/backgroundmx-${backgroundID}.jpg)`}}>
          <div className="home-hero-info">
            <h1 className="hero-info-logo">
              <img src="/icons/homepage/png/logo-dmx-beta-horizontal.png" alt="DataMexico" />
            </h1>
            <p className="hero-info-tagline u-font-md">
              {t("EXPLORE, VISUALIZE, COMPARE, Y DOWNLOAD MEXICAN DATA")}
            </p>
            <div className="hero-info-logo-list">
              {LOGOS.map(logo =>
                <a className="hero-info-logo-link" href={logo.url} key={logo.title} aria-hidden tabIndex="-1" target="_blank" rel="noopener noreferrer">
                  <img className="hero-info-logo-img" src={`/icons/${logo.src}`} alt={logo.title} />
                </a>
              )}
            </div>
          </div>
          <div className="home-hero-search">
            <span className="home-disclaimer-search">¡Más de 9.000 perfiles para descubrir!</span>
            <HeroSearch locale={lng} router={router} />
          </div>
        </div>
        <div className="home-description container">
          <div className="home-description-text">
            <h2 className="intro-title">¿Qué es DataMéxico?</h2>
            <p className="intro">
              DataMÉXICO es un esfuerzo conjunto entre la Secretaria de Economía (SE) y Datawheel,
              que permite la integración, visualización y análisis de datos para mejorar la toma
              de decisiones de políticas públicas enfocadas en fomentar la innovación, inclusión y
              diversificación de la economía mexicana.
            </p>
          </div>
          <div className="home-description-buttons">
            <CustomTile
              icon={"/icons/homepage/svg/explore-profiles-icon.svg"}
              link={`${lng}/explore`}
              title={"Perfiles"}
              text={"Explore México mediante datos económicos, sociales y ocupacionales a través de visualizaciones interactivas personalizables."}
            />
            <CustomTile
              icon={"/icons/homepage/svg/coronavirus-icon.svg"}
              link={`/${lng}/coronavirus`}
              title={"Coronavirus"}
              text={"Una mirada en profundidad a la propagación del COVID-19 en México a través de datos y visualizaciones actualizadas diariamente."}
            />
            <CustomTile
              icon={"/icons/homepage/svg/complejidad-economica-icon.svg"}
              link={`/${lng}/eci/explore`}
              title={"Complejidad Económica"}
              text={"Conozca el nivel de desarrollo industrial y económico en México, a múltiples niveles geográficos, mediante parámetros personalizables."}
            />
          </div>
        </div>

        <div className="home-content-profiles container">
          {Object.keys(tiles).map((d, i) => {
            const items = tiles[d];
            const info = homeTiles[d];
            return <div
              className="profiles-tile-container"
              key={`home-tile-title_${i}_${lng}`}
            >
              <TileTitle
                icon={d}
                title={t(info.name)}
                subtitle={t(info.subtitle)}
              />
              <div className="profile-tile-container-list">
                {items.map((h,ix) => <TileV2
                  id={h.slug}
                  key={`${h.id}-home-tile-${lng}`}
                  level={t(h.hierarchy)}
                  lng={lng}
                  slug={d}
                  ix={ix}
                  slugColor={info.background}
                  title={h.name}
                />)}
              </div>
              <a className="profiles-tile-total" href={`/${lng}/explore?profile=${d}`}>
                <img src="/icons/homepage/png/ver-mas-icon.png" className="profiles-tile-total-icon" />
                <span className="profiles-tile-total-value">{info.levels.reduce((a, b) => a + b.count, 0)} más</span>
              </a>
            </div>;
          })}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(hot(Home));
