import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import axios from "axios";
import {Helmet} from "react-helmet";

import "./Home.css";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";
import Tile from "../components/Tile";
import TileTitle from "../components/TileTitle";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SearchResult from "../components/SearchResult";

import "../styles/SharePanel.css";

const CancelToken = axios.CancelToken;
let cancel;

class Home extends Component {

  state = {
    isOpenSearchResults: false,
    results: [],
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
          this.setState({results, resultsFilter: results, isOpenSearchResults: true});
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

    return <div id="Home">
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
      <div className="hero">
        <div className="hero-logo">
          <img src="/icons/logo.svg" width="300px" />
        </div>
        <h2 className="tagline">
          {t("EXPLORE, VISUALIZE, COMPARE, Y DOWNLOAD MEXICAN DATA")}
        </h2>

        <div>
          <InputGroup
            leftIcon="search"
            className="home-input"
            placeholder={"Ej. Ciudad de México, Monterrey"}
            onChange={this.handleSearch}
            rightElement={<Button className="home-search">Search</Button>}
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
        </div>
        <div className="sponsors">
          <img className="brand se-logo" src="/icons/SE.png" alt="" />
          <img className="brand matt-logo" src="/icons/matt-white.svg" alt="" />
          <img className="brand datawheel-logo" src="/icons/datawheel-white.svg" alt="" />
        </div>
      </div>

      <div className="container tiles">
        <div className="columns">
          <div className="column">
            <TileTitle
              icon="geo"
              title={t("Cities & Places")}
            />

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
          </div>
          <div className="column">
            <TileTitle
              icon="industry"
              title={t("Industries")}
            />
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
          </div>
          <div className="column">
            <TileTitle
              icon="occupations"
              title={t("Occupations")}
            />
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
          </div>
          <div className="column">
            <TileTitle
              title={t("Products")}
            />
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
          </div>
          <div className="column">
            <TileTitle
              icon="university"
              title={t("Universities")}
            />
            <Tile
              slug="university"
              id="1127"
              title="Universidad Nacional Autónoma de México"
            />
            <Tile
              slug="university"
              id="2386"
              title="Instituto Tecnológico y de Estudios Superiores de Monterrey"
            />
            <Tile
              slug="university"
              id="47"
              title="Universidad Autónoma del Estado de Hidalgo"
            />
            <Tile
              slug="university"
              id="566"
              title="Universidad de Guadalajara"
            />
            <Tile
              slug="university"
              id="118"
              title="Instituto Politécnico Nacional"
            />
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />

    </div>
    ;
  }
}

export default withNamespaces()(Home);
