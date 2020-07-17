import React from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import HelmetWrapper from "../HelmetWrapper";
import {withNamespaces} from "react-i18next";
import {InputGroup, Button} from "@blueprintjs/core";
import {connect} from "react-redux";
import {nest, map as D3Map} from "d3-collection";
import homeTiles from "helpers/homeTiles";
import {commas} from "helpers/utils";

import ExploreHeader from "../../components/ExploreHeader";
import ExploreProfile from "../../components/ExploreProfile";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import "./Explore.css";

const CancelToken = axios.CancelToken;
let cancel;

const profilesList = {
  'filter': {title: "Explore", dimension: false, levels: []},
  'geo': {title: "Cities & Places", cube: "inegi_population", dimension: "Geography", levels: ["Nation", "State", "Municipality"], background: "#8b9f65"},
  'product': {title: "Products", cube: "economy_foreign_trade_ent", dimension: "Product", levels: ["Chapter", "HS2", "HS4", "HS6"], background: "#ea8db2"},
  'industry': {title: "Industries", cube: "inegi_economic_census", dimension: "Industry", levels: ["Sector", "Subsector", "Industry Group", "NAICS Industry", "National Industry"], background: "#f5c094"},
  'institution': {title: "Universities", cube: "anuies_status", dimension: "Campus", levels: ["Institution"], background: "#e7d98c"},
  'occupation': {title: "Occupations", cube: "inegi_enoe", dimension: "Occupation Actual Job", levels: ["Group", "Subgroup", "Occupation"], background: "#68adcd"}
}

const generateTotalsMap = () => {
  const resp = new D3Map();
  let leavesTemp, count, bigCount=0;
  Object.keys(homeTiles).forEach(profile => {
    leavesTemp = new D3Map();
    count = 0;
    homeTiles[profile].levels.forEach(level => {
      count += level.count;
      bigCount += level.count;
      leavesTemp.set(level.name,{len:level.count});
    });
    resp.set(profile, {len: count, leaves: leavesTemp})
  });
  resp.set('filter',{len:bigCount});
  return resp;
}

class Explore extends React.Component {

  state = {
    query: this.props.location.query.q || "",
    profile: this.props.location.query.profile || "filter",
    tab: this.props.location.query.tab || "0",
    results: [],
    resultsNest: new D3Map(),
    loading: true,
    totalsNest: generateTotalsMap()
  };

  componentDidMount = () => {
    this.requestApi();
  }

  handleSearch = e => {
    const {profile, tab} = this.state;
    const query = e.target.value;
    this.updateUrl(query, profile, tab);
    this.setState({query}, () => this.requestApi());
  }

  handleProfile = profile => {
    const {query} = this.state;
    const tab = "0";
    this.updateUrl(query, profile, tab);
    this.setState({profile, tab}, () => this.requestApi());
  }

  handleTab = tab => {
    const {query, profile} = this.state;
    this.updateUrl(query,profile,tab);
    this.setState({tab}, () => this.requestApi());
  }

  updateUrl = (q,profile,tab) => {
    const searchParams = new URLSearchParams();
    if (q && q.length > 0) searchParams.set("q", q);
    searchParams.set("profile", profile);
    searchParams.set("tab", tab);
    this.context.router.replace(`${this.props.location.pathname}?${searchParams.toString()}`);
  }

  clearSearch = () => {
    this.setState({query: '', profile: 'filter', tab: '0', results:[]}, () => this.requestApi());
    this.updateUrl('', 'filter', '0');
  }

  requestApi = () => {

    const {query, tab, profile} = this.state;

    this.setState({loading:true, results: []});

    if (cancel !== undefined) {
      cancel();
    }

    //Search actual query
    if (profile === 'filter' || query && query!=='' && query.length>2){
      axios.get("/api/profilesearch", {
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
          let results = [];
          let parsed = [];
          let resultsRaw = [];

          Object.keys(resp.data.profiles).forEach(profileName => {
            results = results.concat(resp.data.profiles[profileName]);
          });

          let tempObj;
          results.forEach(elements => {
            elements.forEach(profileItem => {
              if (profilesList[profileItem.slug]){
                tempObj = {id: profileItem.id, name: profileItem.name, slug: profileItem.slug, level: profileItem.memberHierarchy, background: profilesList[profileItem.slug].background};
                resultsRaw.push(tempObj);
                if (profile === 'filter' || profileItem.slug === profile && profileItem.memberHierarchy === profilesList[profile].levels[tab]){
                  parsed.push(tempObj);
                }
              }
            });
          });

          const resultsNest = nest()
            .key(d => d.slug)
            .rollup(function (leaves) {
              return {"len": leaves.length,
                "leaves": nest()
                  .key(d => d.level)
                  .rollup(function (leaves) {
                    return {
                      "len": leaves.length
                    }
                  })
                  .map(leaves)
            }})
            .map(resultsRaw);

          resultsNest.set('filter', {len: resultsRaw.length});

          this.setState({results: parsed, resultsNest, loading:false});
        })
        .catch(error => {
          const result = error.response;
          console.error(error);
          return Promise.reject(result);
        });
    }else{
      axios.get("/api/search", {
        cancelToken: new CancelToken(c => {
          // An executor function receives a cancel function as a parameter
          cancel = c;
        }),
        params: {
          limit: 100,
          locale: this.props.lng,
          dimension: profilesList[profile].dimension,
          cubeName: profilesList[profile].cube ? profilesList[profile].cube:'',
          levels: profilesList[profile].levels[tab],
          pslug: profile
        }
      })
        .then(resp => {
          const color = profilesList[profile].background;
          this.setState({results: resp.data.results.map(profileItem => ({id: profileItem.id, name: profileItem.name, slug: profileItem.profile, level: profileItem.hierarchy, background: color})), loading: false});
        })
        .catch(error => {
          const result = error.response;
          console.error(error);
          return Promise.reject(result);
        });
    }
  }

  render() {
    const {query, tab, profile, results, resultsNest, totalsNest, loading} = this.state;
    const {t} = this.props;

    const clearButton = query !== '' ? <Button onClick={() => this.clearSearch()} minimal={true} className="ep-clear-btn" icon="cross" large={true} outlined={true}>{t('Explore Profile.Clear Filters')}</Button>:<span></span>

    const share = {
      title: `${t("Explore")}`,
      desc: `${t("share.explore")}`
    };

    const totals = (query && query !== '' && !loading) ? resultsNest : totalsNest;

    return <div className="explore">
      <HelmetWrapper info={share} />
      <Nav
        className={"background"}
        logo={false}
        routeParams={this.props.router.params}
        routePath={"/:lang"}
        title={""}
      />
      <div className="ep-container container">

        <div className={`ep-loading-splash ${loading?'show':''}`}></div>

        <div className="ep-search">
          <InputGroup
            leftIcon="search"
            placeholder={t("Explore Profile.Search Placeholder")}
            onChange={this.handleSearch}
            value={query}
            rightElement={clearButton}
          />
        </div>

        <div className="ep-headers">
          {Object.keys(profilesList).map((sectionSlug, i) => {
            let len = totals.get(sectionSlug);
            len = len?len.len:0;
            return <ExploreHeader
              title={t(profilesList[sectionSlug].title)}
              len={commas(len)}
              selected={profile}
              slug={sectionSlug}
              handleTabSelected={profile => this.handleProfile(profile)}
            />
          })}
        </div>

        <div className="ep-profile-tabs">
          {profilesList[profile].levels.map((levelName, ix) => {
            const levelKey = `${ix}`;
            let len = totals.get(profile);
            console.log(totals.get(profile));
            len = len ? len.leaves.get(levelName) : false;
            len = len ? len.len : 0;
            return <div
              className={classnames(
                "ep-profile-tab",
                {"selected": tab === levelKey},
                {"u-hide-below-sm": len === 0}
              )}
              key={levelKey}
              onClick={() => this.handleTab(levelKey)}
            >
              {`${t(levelName)}`} {len ? `(${commas(len)})`:''}
            </div>;
          })}
        </div>

        <div className="ep-profiles">
          <ExploreProfile
            filterPanel={profile === "filter"}
            results={results}
            loading={loading}
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

Explore.need = []

export default withNamespaces()(
  connect(state => ({
  }))(Explore)
);
