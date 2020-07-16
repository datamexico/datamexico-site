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

import SearchResult from "../components/SearchResult";

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
              <img src="/icons/logo-horizontal.png" alt="DataMexico" />
            </h1>
            <p className="hero-info-tagline u-font-md">
              {t("EXPLORE, VISUALIZE, COMPARE, Y DOWNLOAD MEXICAN DATA")}
            </p>
            <div className="hero-info-logo-list">
              {LOGOS.map(logo =>
                <a className="hero-info-logo-link" href={logo.url} key={logo.title} aria-hidden tabIndex="-1">
                  <img className="hero-info-logo-img" src={`/icons/${logo.src}`} alt={logo.title} />
                </a>
              )}
            </div>
          </div>
          <div className="home-hero-search">
            <HeroSearch locale={lng} router={router} />
          </div>
        </div>
        <div className="home-content container">
          <div className="home-content-profiles">
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
                />
                <div className="profile-tile-container-list">
                  {items.map(h => <TileV2
                    id={h.id}
                    key={`${h.id}-home-tile-${lng}`}
                    level={t(h.hierarchy)}
                    lng={lng}
                    slug={d}
                    slugColor={info.background}
                    title={h.name}
                  />)}
                </div>
              </div>;
            })}
          </div>
        </div>
        <Footer />
      </div>
    );
  }
}

export default withNamespaces()(hot(Home));
