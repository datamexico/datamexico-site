import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";
import {InputGroup} from "@blueprintjs/core";

import ExploreHeader from "../../components/ExploreHeader";
import ExploreProfile from "../../components/ExploreProfile";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import "./Explore.css";

const CancelToken = axios.CancelToken;
let cancel;

const levels = {
  geo: ["Nation", "State", "Metro Area", "Municipality"],
  product: ["Chapter", "HS2", "HS4", "HS6"],
  industry: ["Sector", "Subsector", "Industry Group", "NAICS Industry", "National Industry"],
  institution: ["Institution"],
  occupation: ["Group", "Subgroup", "Occupation"]
};

const headers = [
  {title: "Explore", slug: "filter"},
  {title: "Cities & Places", slug: "geo", background: "#8b9f65"},
  {title: "Products", slug: "product", background: "#ea8db2"},
  {title: "Industries", slug: "industry", background: "#f5c094"},
  {title: "Universities", slug: "institution", background: "#e7d98c"},
  {title: "Occupations", slug: "occupation", background: "#68adcd"}
];

class Explore extends React.Component {

  state = {
    query: "",
    selected: this.props.location.query.profile || "filter",
    tab: this.props.location.query.profile && this.props.location.query.profile === "institution" ? "Institution" : "Explore",
    results: []
  };


  componentDidMount = () => {
    this.requestApi(this.props.location.query.q);
  }

  handleSearch = e => {
    const {selected} = this.state;
    const query = e.target.value;
    const searchParams = new URLSearchParams();
    searchParams.set("q", query);
    if (selected && selected !== "filter") searchParams.set("profile", selected);
    this.context.router.replace(`${this.props.location.pathname}?${searchParams.toString()}`);

    this.requestApi(query);

  }

  handleTab = selected => {
    const {query} = this.state;
    const searchParams = new URLSearchParams();
    if (query && query.length > 0) searchParams.set("q", query);
    if (selected && selected !== "filter") searchParams.set("profile", selected);
    this.context.router.replace(`${this.props.location.pathname}?${searchParams.toString()}`);

    this.setState({selected, tab: selected === "institution" ? levels[selected][0] : "Explore"});
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
          const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
          this.setState({results});
        }));
    }

  }

  render() {
    const {query, tab, selected} = this.state;
    const {t} = this.props;

    return <div className="explore">
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
      <div className="ep-container container">
        <div className="ep-search">
          <InputGroup
            leftIcon="search"
            placeholder={t("Explore Profile.Search Placeholder")}
            onChange={this.handleSearch}
            value={query}
          />
        </div>
        <div className="ep-headers">
          {headers.map((d, i) => <ExploreHeader
            key={`explore_header_${i}`}
            title={t(d.title)}
            selected={selected}
            slug={d.slug}
            handleTabSelected={selected => this.handleTab(selected)}
          />)}


        </div>
        {selected !== "filter" &&
          <div className="ep-profile-tabs">
            {levels[selected].length > 1 && <div
              className={`ep-profile-tab ${tab === "Explore" ? "selected" : ""}`}
              onClick={() => this.setState({tab: "Explore"})}>
              {t("Explore")}
            </div>}
            {levels[selected].map((d, i) => {
              // selected = Slug
              // tab = Tab selected (Translated)
              const results = this.state.results.filter(h => h.slug === selected && h.level === d);
              const len = results.length;

              return <div
                className={classnames(
                  "ep-profile-tab",
                  {selected: tab === t(d)},
                  {"u-hide-below-sm": len === 0}
                )}
                key={i}
                onClick={() => this.setState({tab: t(d)})}
              >
                {`${t(d)} (${len})`}
              </div>;
            })}
          </div>}
        <div className="ep-profiles">
          {this.state.results.length === 0 && selected === "filter"
            ? <ExploreProfile
              title={""}
              background={""}
              filterPanel={false}
              results={[]}
            />

            : headers.filter(d => d.slug !== "filter").map(d => {
              if (["filter", d.slug].includes(selected)) {
                let results = this.state.results.filter(h => h.slug === d.slug);
                if (tab !== "Explore") results = results.filter(h => h.level === tab);


                return <ExploreProfile
                  title={t(d.title)}
                  background={d.background}
                  filterPanel={selected === "filter"}
                  results={results}
                />;

              }
              return undefined;
            })}


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
