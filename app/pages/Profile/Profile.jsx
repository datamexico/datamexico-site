import React from "react";
import HelmetWrapper from "../HelmetWrapper";
import PropTypes from "prop-types";
import libs from "@datawheel/canon-cms/src/utils/libs";
import {Profile as CMSProfile} from "@datawheel/canon-cms";
import {connect} from "react-redux";
import {fetchData} from "@datawheel/canon-core";
import {withNamespaces} from "react-i18next";

import Error from "../Error/Error";
import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import {spanishLabels} from "helpers/spanishLabels";

import "./Profile.css";

class Profile extends React.Component {
  state = {
    scrolled: false
  };

  getChildContext() {
    const {formatters, locale, profile, router} = this.props;
    const {variables} = profile;

    return {
      formatters: formatters.reduce((acc, d) => {
        const f = Function("n", "libs", "formatters", d.logic);
        const fName = d.name.replace(/^\w/g, chr => chr.toLowerCase());
        acc[fName] = n => f(n, libs, acc);
        return acc;
      }, {}),
      router,
      variables,
      locale
    };
  }

  componentDidMount() {
    window.addEventListener("scroll", this.handleScroll);
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
    const {profile, t, baseUrl} = this.props;

    const {variables} = profile;
    const {scrolled} = this.state;

    let slug = "", title = "", desc = "";
    if (profile && profile.errorCode && profile.errorCode === 404) return <Error />;

    if (profile.meta) {
      slug = profile.meta.map(d => d.slug).join("_");
    }

    switch (slug) {
      case "occupation":
        title = t("Profile.Occupation Title", {name: variables.name});
        desc = t("Profile.Occupation Description", {name: variables.name});
        break;
      case "geo":
        title = t("Profile.Geo Title", {name: variables.name});
        desc = t("Profile.Geo Description", {name: variables.name});
        break;
      case "product":
        title = t("Profile.Product Title", {name: variables.name});
        desc = t("Profile.Product Description", {name: variables.name});
        break;
      case "industry":
        title = t("Profile.Industry Title", {name: variables.name});
        desc = t("Profile.Industry Description", {name: variables.name});
        break;
      case "institution":
        title = t("Profile.Institution Title", {name: variables.name});
        desc = t("Profile.Institution Description", {name: variables.name});
        break;
      default:
        break;
    }

    const share = {
      title: title,
      desc: desc,
      img: `${baseUrl}/api/image?slug=${slug}&id=${variables.id}&size=thumb`
    };

    const searchProps = {
      placeholder: t("Profile.Search Placeholder"),
      subtitleFormat: d => spanishLabels[d.memberHierarchy]
    }

    return <div id="Profile" onScroll={this.handleScroll}>
      <HelmetWrapper info={share} />

      <Nav
        className={scrolled ? "background" : ""}
        title={scrolled ? variables.name : ""}
        routePath={this.props.route.path}
        routeParams={this.props.router.params}
      />

      <CMSProfile {...this.props} searchProps={searchProps} />

      <Footer />
    </div>;
  }
}

Profile.need = [
  fetchData("profile", "/api/profile/?slug=<slug>&id=<id>&slug2=<slug2>&id2=<id2>&slug3=<slug3>&id3=<id3>&locale=<i18n.locale>"),
  fetchData("formatters", "/api/formatters")
];

Profile.childContextTypes = {
  formatters: PropTypes.object,
  locale: PropTypes.string,
  router: PropTypes.object,
  variables: PropTypes.object
};

export default withNamespaces()(
  connect(state => ({
    baseUrl: state.env.CANON_API,
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);
