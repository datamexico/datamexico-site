import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import axios from "axios";

import "./Home.css";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";
import Tile from "../components/Tile";
import TileTitle from "../components/TileTitle";
import Footer from "../components/Footer";
import Nav from "../components/Nav";
import SearchResult from "../components/SearchResult";

import "../styles/SharePanel.css";

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

    axios.get(`/api/search?q=${query}`).then(resp => {
      const data = resp.data.results;
      const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
      this.setState({results, resultsFilter: results});
    });

    const resultsFilter = results.filter(d => d.name.toLowerCase().indexOf(query.toLowerCase()) >= 0);

    const isOpen = query.length > 2;
    this.setState({resultsFilter, isOpenSearchResults: isOpen});
  }


  render() {
    const {resultsFilter, scrolled, isOpenSearchResults} = this.state;
    const {t} = this.props;

    return <div id="Home">
      <Nav
        className={scrolled ? "background" : ""}
        title={""}
        logo={false}
      />
      <div className="hero">
        <div className="hero-logo">
          <img src="/icons/logo.svg" width="300px" />
        </div>
        <h2 className="tagline">
          {t("EXPLORA, VISUALIZA, COMPARA, Y DESCARGA DATOS MEXICANOS")}
        </h2>
        <div>
          <Popover
            className="search-popover"
            content={<ul className="search-results">
              {resultsFilter.map((d, i) => <SearchResult
                key={`search_result_${d.id}_${i}`}
                id={d.id}
                slug={d.slug}
                title={d.name}
                level={d.level}
              />)}
            </ul>}
            position="bottom"
            minimal={true}
            isOpen={isOpenSearchResults}
          >
            <InputGroup
              leftIcon="search"
              className="home-input"
              placeholder={"Ej. Ciudad de México, Monterrey"}
              onChange={this.handleSearch}
              rightElement={<Button className="home-search">Search</Button>}
            />
          </Popover>
        </div>
        <div className="sponsors">
          <img className="brand" src="/icons/SE.svg" alt="" />
          <img className="brand" src="/icons/matt-white.svg" alt="" />
          <img className="brand" src="/icons/datawheel-white.svg" alt="" />
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
            <Tile />
            <Tile />
            <Tile />
            <Tile />
            <Tile />
          </div>
          <div className="column">
            <TileTitle
              icon="occupations"
              title={t("Occupations")}
            />
            <Tile />
            <Tile />
            <Tile />
            <Tile />
            <Tile />
          </div>
          <div className="column">
            <TileTitle
              title={t("Products")}
            />
            <Tile />
            <Tile />
            <Tile />
            <Tile />
            <Tile />
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
