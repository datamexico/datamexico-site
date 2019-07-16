import React, {Component} from "react";
import axios from "axios";

import "./Home.css";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";
import Tile from "../components/Tile";
import TileTitle from "../components/TileTitle";
import Nav from "../components/Nav";
import SearchResult from "../components/SearchResult";

export default class Home extends Component {

  state = {
    scrolled: false,
    isOpenSearchResults: false,
    results: [],
    resultsFilter: []
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


  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
    // eslint-disable-next-line no-undef
  }

  componentWillUnmount() {
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
    const {resultsFilter, scrolled, isOpenSearchResults} = this.state;
    return (
      <div id="Home">
        <Nav
          className={scrolled ? "background" : ""}
          title={""}
          logo={false}
        />
        <div className="hero">
          <div className="">
            <img src="/icons/logo.svg" width="300px" />
          </div>
          <h2 className="tagline">
            EXPLORA, VISUALIZA, COMPARA, Y DESCARGA DATOS MEXICANOS
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
                title="Cities & Places"
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
                title="Coming soon..."
              />
              <Tile />
              <Tile />
              <Tile />
              <Tile />
              <Tile />
            </div>
            <div className="column">
              <TileTitle
                title="Coming soon..."
              />
              <Tile />
              <Tile />
              <Tile />
              <Tile />
              <Tile />
            </div>
            <div className="column">
              <TileTitle
                title="Coming soon..."
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
        <footer id="Footer" className="footer">
          <div className="container">
            <div className="columns">
              <div className="column">

                <div className="footer-links">
                  <div className="explore-columns">
                    <div className="explore-column">
                      <h4>Explore</h4>
                      <ul>
                        <li>Profiles</li>
                      </ul>
                    </div>
                    <div className="explore-column">
                      <h4>Sources</h4>
                      <ul>
                        <li>Data Sources</li>
                        <li>API</li>
                        <li>Classifications</li>
                        <li>Contact us</li>
                      </ul>
                    </div>
                    <div className="explore-column">
                      <h4>About</h4>
                      <ul>
                        <li>Background</li>
                        <li>In the press</li>
                        <li>Team</li>
                        <li>Glossary</li>
                        <li>Terms of use</li>
                      </ul>
                    </div>
                  </div>
                </div>

              </div>
              <div className="column footer-contact">
                <InputGroup
                  leftIcon="envelope"
                  className="footer-email"
                  placeholder="Your email address"
                  rightElement={<span>Sign In<Icon icon="arrow-right" /></span>}
                />
                <div className="sponsors">
                  <img className="brand" src="/icons/SE.svg" alt="" />
                  <img className="brand" src="/icons/matt-white.svg" alt="" />
                  <img className="brand" src="/icons/datawheel-white.svg" alt="" />
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    );
  }

}
