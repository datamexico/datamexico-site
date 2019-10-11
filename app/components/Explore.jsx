import React from "react";
import {Helmet} from "react-helmet";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import axios from "axios";

import Footer from "./Footer";
import Nav from "./Nav";
import {InputGroup} from "@blueprintjs/core";

import "./Explore.css";
import ExploreProfile from "./ExploreProfile";
import ExploreHeader from "./ExploreHeader";

const CancelToken = axios.CancelToken;
let cancel;

class Explore extends React.Component {

  state = {
    query: "",
    selected: "filter",
    results: []
  };

  componentDidMount = () => {
    this.requestApi(this.props.location.query.q);
  }

  handleSearch = async e => {

    const query = e.target.value;
    const searchParams = new URLSearchParams();
    searchParams.set("q", query);
    this.context.router.replace(`${this.props.location.pathname}?${searchParams.toString()}`);

    this.requestApi(query);

  }

  requestApi = query => {
    this.setState({query});
    if (cancel !== undefined) {
      cancel();
    }
    if (query && query.length > 0) {
      return axios.get("/api/search", {
        cancelToken: new CancelToken(c => {
        // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
        params: {
          q: query,
          limit: 50,
          locale: this.props.lng
        }
      })
        .then(resp => {
          const data = resp.data.results;
          const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
          this.setState({results});
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
    else {

      return axios.all([
        axios.get("/api/search?q=&dimension=Geography&limit=10"),
        axios.get("/api/search?q=&dimension=Product&limit=10"),
        axios.get("/api/search?q=&dimension=Occupation Actual Job&limit=10"),
        axios.get("/api/search?q=&dimension=Industry&limit=10"),
        axios.get("/api/search?q=&dimension=Campus&limit=10")
      ])
        .then(axios.spread((geoResp, univResp, occupResp, sectorResp, prodResp) => {
          const data = geoResp.data.results
            .concat(univResp.data.results)
            .concat(occupResp.data.results)
            .concat(sectorResp.data.results)
            .concat(prodResp.data.results);
          console.log(data);
          const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
          this.setState({results});
        }));
    }

  }

  render() {
    const {query, selected} = this.state;

    return <div id="explore">
      <Helmet title="Explore">
        <meta property="og:title" content={"Explore"} />
      </Helmet>
      <Nav
        className={"background"}
        logo={false}
        routeParams={this.props.router.params}
        routePath={"/:lang"}
        title={""}
      />
      <div className="ep-container">
        <div className="ep-search">
          <InputGroup
            leftIcon="search"
            placeholder={"Search profiles..."}
            onChange={this.handleSearch}
            value={query}
          />
        </div>
        <div className="ep-headers">
          <ExploreHeader
            title="No filter"
            selected={selected}
            slug="filter"
            handleTabSelected={selected => this.setState({selected})}
          />
          <ExploreHeader
            title="Locations"
            selected={selected}
            slug="geo"
            handleTabSelected={selected => this.setState({selected})}
          />
          <ExploreHeader
            title="Products"
            selected={selected}
            slug="product"
            handleTabSelected={selected => this.setState({selected})}
          />
          <ExploreHeader
            title="Industries"
            selected={selected}
            slug="industry"
            handleTabSelected={selected => this.setState({selected})}
          />
          <ExploreHeader
            title="Universities"
            selected={selected}
            slug="university"
            handleTabSelected={selected => this.setState({selected})}
          />
          <ExploreHeader
            title="Occupations"
            selected={selected}
            slug="occupation"
            handleTabSelected={selected => this.setState({selected})}
          />
        </div>
        <div className="ep-profiles">
          <ExploreProfile
            title="Locations"
            background="#8b9f65"
            results={this.state.results.filter(d => d.slug === "geo")}
          />
          <ExploreProfile
            title="Products"
            background="#ea8db2"
            results={this.state.results.filter(d => d.slug === "product")}
          />
          <ExploreProfile
            title="Industries"
            background="#f5c094"
            results={this.state.results.filter(d => d.slug === "industry")}
          />
          <ExploreProfile
            title="Universities"
            background="#e7d98c"
            results={this.state.results.filter(d => d.slug === "university")}
          />
          <ExploreProfile
            title="Occupations"
            background="#68adcd"
            results={this.state.results.filter(d => d.slug === "occupation")}
          />
        </div>
      </div>
      <Footer />
    </div>;
  }
}

Explore.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Explore);
