import React from "react";
import {Helmet} from "react-helmet";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import axios from "axios";

import Nav from "./Nav";
import {InputGroup} from "@blueprintjs/core";

import "./Explore.css";
import ExploreProfile from "./ExploreProfile";

const CancelToken = axios.CancelToken;
let cancel;

class Explore extends React.Component {

  state = {
    query: "",
    results: []
  };

  componentDidMount = () => {
    if (this.props.location.query && this.props.location.query.q) this.requestApi(this.props.location.query.q);
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
          this.setState({results});
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }

    return true;
  }

  render() {
    const {query} = this.state;

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
        <div className="ep-profiles">
          <ExploreProfile
            title="Locations"
            background="#009688"
            results={this.state.results.filter(d => d.slug === "geo")}
          />
          <ExploreProfile
            title="Products"
            background="#8bc34a"
            results={this.state.results.filter(d => d.slug === "product")}
          />
          <ExploreProfile
            title="Industries"
            background="#4caf50"
            results={this.state.results.filter(d => d.slug === "industry")}
          />
          <ExploreProfile
            title="Universities"
            background="#cddc39"
            results={this.state.results.filter(d => d.slug === "university")}
          />
          <ExploreProfile
            title="Occupations"
            background="#00bcd4"
            results={this.state.results.filter(d => d.slug === "occupation")}
          />
        </div>
      </div>
    </div>;
  }
}

Explore.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Explore);
