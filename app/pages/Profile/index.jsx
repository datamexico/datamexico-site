import React from "react";
import {Helmet} from "react-helmet";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {Profile as CMSProfile, Section} from "@datawheel/canon-cms";
import libs from "@datawheel/canon-cms/src/utils/libs";

import Stat from "../../components/Stat";

import {Geomap} from "d3plus-react";
import SectionIcon from "../../components/SectionIcon";
import {Icon} from "@blueprintjs/core";
import Nav from "../../components/Nav";

import "./style.css";
import Footer from "../../components/Footer";

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
    const {profile, t} = this.props;

    const {variables} = profile;
    const {scrolled} = this.state;
    return <div id="Profile" onScroll={this.handleScroll}>
      <Helmet title={variables.name}>
        <meta property="og:title" content={variables.name} />
      </Helmet>

      <Nav
        className={scrolled ? "background" : ""}
        title={scrolled ? variables.name : ""}
        routePath={this.props.route.path}
        routeParams={this.props.router.params}
      />
      <CMSProfile {...this.props} />
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
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);

