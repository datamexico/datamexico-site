import React, {Component} from "react";
import axios from "axios";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import CustomTile from "../components/CustomTile";
import Footer from "../components/Footer";
import HelmetWrapper from "./HelmetWrapper";
import HeroSearch from "../components/HeroSearch";
import Nav from "../components/Nav";
import TileV2 from "../components/TileV2";

import homeTiles from "helpers/homeTiles";
import tilesEN from "../../static/tiles/en.json";
import tilesES from "../../static/tiles/es.json";
import {LOGOS, HOME_NAV} from "helpers/consts.js";
import {backgroundID} from "helpers/utils";

import "../styles/SharePanel.css";
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
              {t("Homepage.Tagline")}
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
            <span className="home-disclaimer-search">{t("Homepage.SearchDisclaimer")}</span>
            <HeroSearch locale={lng} router={router} />
          </div>
        </div>
        <div className="home-description container">
          <div className="home-description-text">
            <h2 className="intro-title">{t("Homepage.Title")}</h2>
            <p className="intro">{t("Homepage.Intro")}</p>
          </div>
          <div className="home-description-buttons">
            {HOME_NAV.map(d => (
              <CustomTile
                icon={d.icon}
                link={`${lng}/${d.link}`}
                title={t(d.title)}
                text={t(d.text)}
              />
            ))}
          </div>
        </div>

        <div className="home-content-profiles container">
          {Object.keys(tiles).map((d, i) => {
            const info = homeTiles[d];
            const items = tiles[d];
            const total = info.levels.reduce((a, b) => a + b.count, 0);
            return <div className="profiles-tile-container" key={`home-tile-title_${i}_${lng}`}>
              <div className="profile-tile-container-title">
                <a className="tile-title-link" href={d ? `/${lng}/explore?profile=${d}` : "#"}>
                  <img className="tile-title-icon" src={`/icons/homepage/png/${d}-icon.png`} alt="" />
                  {t(info.name)}
                </a>
              </div>
              <div className="profile-tile-container-list">
                {items.map((h, ix) =>
                  <TileV2
                    id={h.slug}
                    key={`${h.id}-home-tile-${lng}`}
                    level={t(h.hierarchy)}
                    lng={lng}
                    slug={d}
                    ix={ix}
                    slugColor={info.background}
                    title={h.name}
                  />
                )}
              </div>
              <div className="profile-tile-container-total">
                <a className="profiles-tile-total" href={`/${lng}/explore?profile=${d}`}>
                  <img src="/icons/homepage/png/ver-mas-icon.png" className="profiles-tile-total-icon" />
                  <span className="profiles-tile-total-value">{t("{{total}} more", {total: total})}</span>
                </a>
              </div>
            </div>;
          })}
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(hot(Home));
