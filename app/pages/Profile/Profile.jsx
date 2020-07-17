import React from "react";
import HelmetWrapper from "../HelmetWrapper";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import {fetchData} from "@datawheel/canon-core";
import {connect} from "react-redux";
import {Profile as CMSProfile} from "@datawheel/canon-cms";
import libs from "@datawheel/canon-cms/src/utils/libs";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import Error from "../Error/Error";

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
        title = `${variables.name}: Salarios, diversidad, industrias e informalidad laboral`;
        desc = `Explore las estadísticas sobre salario, diversidad, industrias e informalidad laboral para la ocupación: ${variables.name}`;
        break;
      case "geo":
        title = `${variables.name}: Economía, empleo, equidad, calidad de vida, educación, salud y seguridad pública`;
        desc = `Explore las estadísticas sobre economía, empleo, equidad, calidad de vida, educación, salud y seguridad pública en ${variables.name}`;
        break;
      case "product":
        title = `${variables.name}: Intercambio comercial, compras y ventas internacionales, mercado y especialización`;
        desc = `Explore las estadísticas sobre intercambio comercial, compras y ventas internacionales, mercado y especialización para ${variables.name}`;
        break;
      case "industry":
        title = `${variables.name}: Salarios, producción, inversión, oportunidades y complejidad`;
        desc = `Explore las estadísticas sobre salarios, producción, inversión, oportunidades y complejidad en la industria ${variables.name}`;
        break;
      case "institution":
        title = `${variables.name}: Situación estudiantil, matrículas y graduaciones`;
        desc = `Explore las estadísticas sobre situación estudiantil, matrículas y graduaciones de la institución: ${variables.name}`;
        break;
      default:
        break;
    }

    const share = {
      title: title,
      desc: desc,
      img: `${baseUrl}/api/image?slug=${slug}&id=${variables.id}&size=thumb`
    };

    return <div id="Profile" onScroll={this.handleScroll}>
      <HelmetWrapper info={share} />

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
    baseUrl: state.env.CANON_API,
    formatters: state.data.formatters,
    locale: state.i18n.locale,
    profile: state.data.profile
  }))(Profile)
);
