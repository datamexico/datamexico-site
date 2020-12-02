import React, {Component} from "react";
import HelmetWrapper from "../HelmetWrapper";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

// import Methodology from "./Methodology";
import Background from "./Background";
import Error from "../Error/Error";
import Footer from "components/Footer";
import Glossary from "./Glossary";
import Legal from "./Legal";
import Nav from "components/Nav";
import Press from "./Press";
import Versions from "./Versions";

import "./About.css";

class About extends Component {
  state = {
    data: null
  };

  componentDidMount = () => {
    const {lng} = this.props;
    axios.get(`/api/about/${lng}`).then(resp => {
      this.setState({data: resp.data});
    });
  }

  render() {
    const {t, route, routeParams} = this.props;
    const {lang, page} = this.props.params;
    const {data} = this.state;
    const site = page ? page : "background";
    const pages = {
      "background": "Background",
      "press": "In the press",
      "glossary": "Glossary",
      "legal": "Terms of use",
      "versions": "Versions"
    };

    const valid = Object.keys(pages).includes(site);
    if (!valid) {return <Error />;}

    let childComponent = null;
    if (data) {
      switch (site) {
        case "background":
          childComponent = <Background background={data.background} />;
          break;
        case "press":
          childComponent = <Press press={data.press} />;
          break;
        case "glossary":
          childComponent = <Glossary glossary={data.glossary} />;
          break;
        case "legal":
          childComponent = <Legal terms={data.terms} />;
          break;
        case "versions":
          childComponent = <Versions versions={data.version} />;
          break;
        /*
      case "methodology":
        childComponent = <Methodology />;
        break;
        */
        default:
          childComponent = <Background background={data.background} />;
          break;
      }
    }

    const share = {
      title: `Data México | ${t("About.Title")}`,
      desc: t("Share.About")
    };

    return (
      <div className="about-wrapper">
        <HelmetWrapper info={share} />

        <Nav
          className="background"
          logo={false}
          routePath={route.path}
          routeParams={routeParams}
          title=""
        />

        <div className="about-content">
          <div className="about-hero">
            <h2 className="about-hero-title">{t("About.Title")}</h2>
            <div className="about-hero-buttons">
              {Object.keys(pages).map((d, i) => (
                <a href={`/${lang}/about/${d}`} className={classnames("about-hero-button", {"is-active": d === site})} key={i}>
                  <img src="" alt="" className="about-hero-button-icon" />
                  <span className="about-hero-button-name">{t(`About.${pages[d]}`)}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="about-body about-section">{data && childComponent}</div>
        </div>

        <Footer />
      </div>
    );
  }
}

About.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(hot(About));
