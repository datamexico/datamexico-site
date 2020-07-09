import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {hot} from "react-hot-loader/root";
import PropTypes from "prop-types";
import axios from "axios";
import {Helmet} from "react-helmet";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";

import {LOGOS} from "helpers/consts.js";
import homeTiles from "helpers/homeTiles";
import {backgroundID} from "helpers/utils";
import Tile from "../components/Tile";
import NewTile from "../components/NewTile";
import TileTitle from "../components/TileTitle";
import HeroSearch from "../components/HeroSearch";

import SearchResult from "../components/SearchResult";

import "../styles/SharePanel.css";
import tilesES from "../../static/tiles/es.json";
import tilesEN from "../../static/tiles/es.json";

// NewHome Used Things

import Footer from "../components/Footer";
import Nav from "../components/Nav";

import "./NewHome.css";

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
    console.log(tiles);

    return (
      <div className="home">
        <Helmet title="">
          <meta property="og:title" content={""} />
        </Helmet>
        <Nav
          className={scrolled ? "background" : ""}
          logo={false}
          routeParams={router.params}
          routePath={"/:lang"}
          title={""}
        />
        <div className="home-hero" style={{background: `url(/images/backgroundmx-${backgroundID}.jpg)`}}>
          <div className="home-hero-info">
            <h1 className="hero-info-logo">
              <img src="/icons/datamx-logo.gif" alt="DataMexico" />
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
                className="column"
                key={`home-tile-title_${i}_${lng}`}
              >
                <TileTitle
                  icon={d}
                  title={t(info.name)}
                />
                <ul className="tile-list">
                  {items.map(h => <Tile
                    background={info.background}
                    id={h.id}
                    key={`${h.id}-home-tile-${lng}`}
                    level={t(h.hierarchy)}
                    lng={lng}
                    slug={d}
                    title={h.name}
                  />)}
                </ul>
                <ul className="tile-list">
                  {items.map(h => <NewTile
                    id={h.id}
                    key={`${h.id}-home-tile-${lng}`}
                    level={t(h.hierarchy)}
                    lng={lng}
                    slug={d}
                    slugColor={info.background}
                    title={h.name}
                  />)}
                </ul>
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
