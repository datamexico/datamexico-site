import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import axios from "axios";
import {Helmet} from "react-helmet";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";

import {LOGOS} from "helpers/consts.js";
import Tile from "../components/Tile";
import TileTitle from "../components/TileTitle";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SearchResult from "../components/SearchResult";

import "./Home.css";
import "../styles/SharePanel.css";

const CancelToken = axios.CancelToken;
let cancel;

class Home extends Component {

  state = {
    isOpenSearchResults: false,
    results: [],
    query: "",
    resultsFilter: [],
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

  handleSearch = e => {
    const {results} = this.state;
    const query = e.target.value;

    if (cancel !== undefined) {
      cancel();
    }

    if (query.length > 1) {
      return axios.get("/api/search", {
        cancelToken: new CancelToken(c => {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
        params: {
          q: query,
          locale: this.props.lng
        }
      })
        .then(resp => {
          const data = resp.data.results;
          const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
          this.setState({results, resultsFilter: results, isOpenSearchResults: true, query});
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }

    return true;
  }


  render() {
    const {resultsFilter, scrolled, isOpenSearchResults} = this.state;
    const {t} = this.props;

    return <div className="home">
      <Helmet title="">
        <meta property="og:title" content={""} />
      </Helmet>
      <Nav
        className={scrolled ? "background" : ""}
        logo={false}
        routeParams={this.props.router.params}
        routePath={"/:lang"}
        title={""}
      />
      <div className="hero container">
        <h1 className="hero-logo">
          <img src="/icons/datamx-logo.gif" alt="DataMexico" />
        </h1>
        <p className="tagline u-font-md">
          {t("EXPLORE, VISUALIZE, COMPARE, Y DOWNLOAD MEXICAN DATA")}
        </p>

        <InputGroup
          leftIcon="search"
          className="home-input"
          placeholder={"Ej. Ciudad de México, Monterrey"}
          onChange={this.handleSearch}
          rightElement={<Button className="home-search" onClick={() => {
            const searchParams = new URLSearchParams();
            searchParams.set("q", this.state.query);
            this.context.router.replace(`${this.props.location.pathname}/es/${this.props.lng}/explore?${searchParams.toString()}`);
          }}>Search</Button>}
        />
        {isOpenSearchResults && <ul className="search-results">
          {resultsFilter.map((d, i) => <SearchResult
            key={`search_result_${d.id}_${i}`}
            id={d.id}
            slug={d.slug}
            title={d.name}
            level={d.level}
          />)}
        </ul>}

        {/* _gotta_ have them logos, again */}
        <div className="home-logo-list">
          {LOGOS.map(logo =>
            <a className="home-logo-link" href={logo.url} key={logo.title} aria-hidden tabIndex="-1">
              <img className="home-logo-img" src={`/icons/${logo.src}`} alt={logo.title} />
            </a>
          )}
        </div>
      </div>

      <div className="container tiles">
        <div className="columns">
          <div className="column">
            <TileTitle
              icon="geo"
              title={t("Cities & Places")}
            />
            <ul className="tile-list">
              <Tile
                slug="geo"
                id="1"
                title="Aguascalientes"
              />
              <Tile
                slug="geo"
                id="9"
                title="Ciudad de México"
              />
              <Tile
                slug="geo"
                id="13"
                title="Hidalgo"
              />
              <Tile
                slug="geo"
                id="15"
                title="México"
              />
              <Tile
                slug="geo"
                id="17"
                title="Morelos"
              />
            </ul>
          </div>

          <div className="column">
            <TileTitle
              icon="industry"
              title={t("Industries")}
            />
            <ul className="tile-list">
              <Tile
                slug="industry"
                id="6221"
                title="General Hospital"
              />
              <Tile
                slug="industry"
                id="5611"
                title="Business Administration Services"
              />
              <Tile
                slug="industry"
                id="6111"
                title="Elementary and Secondary Schools"
              />
              <Tile
                slug="industry"
                id="2122"
                title="Metal Ore Mining"
              />
              <Tile
                slug="industry"
                id="8111"
                title="Automotive Repair and Maintenance"
              />
            </ul>
          </div>

          <div className="column">
            <TileTitle
              icon="occupation"
              title={t("Occupations")}
            />
            <ul className="tile-list">
              <Tile
                slug="occupation"
                id="2332"
                title="Primary School Teachers"
              />
              <Tile
                slug="occupation"
                id="2253"
                title="Industrial Engineers"
              />
              <Tile
                slug="occupation"
                id="4211"
                title="Sales Employees"
              />
              <Tile
                slug="occupation"
                id="9111"
                title="Support Workers in Agriculture"
              />
              <Tile
                slug="occupation"
                id="2412"
                title="Specialist Doctors"
              />
            </ul>
          </div>

          <div className="column">
            <TileTitle
              title={t("Products")}
              icon="product"
            />
            <ul className="tile-list">
              <Tile
                slug="product"
                id="17870323"
                title="Cars"
              />
              <Tile
                slug="product"
                id="2080440"
                title="Avocados"
              />
              <Tile
                slug="product"
                id="5260300"
                title="Copper Ores and Concentrates"
              />
              <Tile
                slug="product"
                id="16850440"
                title="Power Electronics"
              />
              <Tile
                slug="product"
                id="20940190"
                title="Parts of Seats"
              />
            </ul>
          </div>

          <div className="column">
            <TileTitle
              icon="institution"
              title={t("Universities")}
            />
            <ul className="tile-list">
              <Tile
                slug="institution"
                id="317"
                title="Universidad Nacional Autónoma de México"
              />
              <Tile
                slug="institution"
                id="248"
                title="Instituto Tecnológico y de Estudios Superiores de Monterrey"
              />
              <Tile
                slug="institution"
                id="683"
                title="Universidad Autónoma del Estado de Hidalgo"
              />
              <Tile
                slug="institution"
                id="725"
                title="Universidad de Guadalajara"
              />
              <Tile
                slug="institution"
                id="82"
                title="Instituto Politécnico Nacional"
              />
            </ul>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

    </div>
    ;
  }
}

Home.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Home);
