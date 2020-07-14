import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";
import {InputGroup} from "@blueprintjs/core";
import {connect} from "react-redux";

import ExploreHeader from "../../components/ExploreHeader";
import ExploreProfile from "../../components/ExploreProfile";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import "./Explore.css";

const CancelToken = axios.CancelToken;
let cancel;

const levels = {
  geo: ["Explore", "Nation", "State", "Metro Area", "Municipality"],
  product: ["Explore", "Chapter", "HS2", "HS4", "HS6"],
  industry: ["Explore", "Sector", "Subsector", "Industry Group", "NAICS Industry", "National Industry"],
  institution: ["Institution"],
  occupation: ["Explore", "Group", "Subgroup", "Occupation"]
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
    profile: this.props.location.query.profile || "filter",
    tab: this.props.location.query.tab || "0",
    results: []
  };


  componentDidMount = () => {
    this.requestApi(this.props.location.query.q);
  }

  handleSearch = e => {
    const {profile, tab} = this.state;
    const query = e.target.value;
    this.updateUrl(query, profile, tab);
    this.requestApi(query);
  }

  handleProfile = profile => {
    const {query} = this.state;
    const tab = "0";
    this.updateUrl(query, profile, tab);
    this.setState({profile, tab});
  }

  handleTab = tab => {
    const {query, profile} = this.state;
    this.updateUrl(query,profile,tab);
    this.setState({tab});
  }

  updateUrl = (q,profile,tab) => {
    const searchParams = new URLSearchParams();
    if (q && q.length > 0) searchParams.set("q", q);
    searchParams.set("profile", profile);
    searchParams.set("tab", tab);
    this.context.router.replace(`${this.props.location.pathname}?${searchParams.toString()}`);
  }

  requestApi = query => {

    const {defaultData} = this.props;

    const {tab, profile} = this.state;

    this.setState({query});
    if (cancel !== undefined) {
      cancel();
    }

    //Search actual query
    if (query && query.length > 0) {
      return axios.get("/api/profilesearch", {
        cancelToken: new CancelToken(c => {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
        params: {
          query,
          limit: 100,
          locale: this.props.lng
        }
      })
        .then(resp => {
          const results = [];
          Object.keys(resp.data.profiles).forEach(key => {
            resp.data.profiles[key].forEach(elements => {
              elements.forEach(profile => {
                results.push({id: profile.id, name: profile.name, slug: profile.slug, level: profile.memberHierarchy});
              });
            });
          });
          this.setState({results});
        })
        .catch(error => {
          const result = error.response;
          return Promise.reject(result);
        });
    }
    else {
      //No query

      if(profile==='filter'){
        this.setState({results: defaultData});
      }

    }

  }

  render() {
    const {query, tab, profile, results} = this.state;
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
          <h1>[{profile}] - [{tab}]</h1>
        </div>

        <div className="ep-headers">
          {headers.map((d, i) => <ExploreHeader
            key={`explore_header_${i}`}
            title={t(d.title)}
            selected={profile}
            slug={d.slug}
            handleTabSelected={profile => this.handleProfile(profile)}
          />)}
        </div>

        {profile !== "filter" &&
          <div className="ep-profile-tabs">
            {levels[profile].map((d, ix) => {
              const filtered = results.filter(h => h.slug === profile && h.level === d);
              const len = filtered.length;
              const levelKey = `${ix}`;
              return <div
                className={classnames(
                  "ep-profile-tab",
                  {"selected": tab === levelKey},
                  {"u-hide-below-sm": len === 0}
                )}
                key={levelKey}
                onClick={() => this.handleTab(levelKey)}
              >
                {`${t(d)} (${len})`}
              </div>;
            })}
          </div>
        }

        <div className="ep-profiles">
          {results.length === 0 && profile === "filter"
            ? <ExploreProfile
              title={""}
              background={""}
              filterPanel={false}
              results={[]}
            />

            : headers.filter(d => d.slug !== "filter").map(d => {
              if (["filter", d.slug].includes(profile)) {
                let results = this.state.results.filter(h => h.slug === d.slug);

                return <ExploreProfile
                  title={t(d.title)}
                  background={d.background}
                  filterPanel={profile === "filter"}
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

Explore.need = [
  (params, store) => {
    const defaultDataPromise = new Promise((resolve, reject) => {
      return axios.all([
        axios.get(`${store.env.CANON_API}/api/search?q=&dimension=Geography&limit=10`),
        axios.get(`${store.env.CANON_API}/api/search?q=&dimension=Product&limit=10`),
        axios.get(`${store.env.CANON_API}/api/search?q=&dimension=Occupation Actual Job&limit=10`),
        axios.get(`${store.env.CANON_API}/api/search?q=&dimension=Industry&limit=10`),
        axios.get(`${store.env.CANON_API}/api/search?q=&dimension=Campus&limit=10`)
      ])
      .then(axios.spread((geoResp, univResp, occupResp, sectorResp, prodResp) => {
        const data = geoResp.data.results
          .concat(univResp.data.results)
          .concat(occupResp.data.results)
          .concat(sectorResp.data.results)
          .concat(prodResp.data.results);
        const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
        resolve({
          key: "exploreData",
          data: results
        });
      }));
    });

    return {
      type: "GET_DATA",
      promise: defaultDataPromise
    };
  }
]

export default withNamespaces()(
  connect(state => ({
    defaultData: state.data.exploreData
  }))(Explore)
);
