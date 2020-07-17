import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import HelmetWrapper from "../HelmetWrapper";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import Background from "./Background";
import Error from "../Error/Error";
import Footer from "components/Footer";
import Glossary from "./Glossary";
import Legal from "./Legal";
// import Methodology from "./Methodology";
import Nav from "components/Nav";
import Press from "./Press";

import "./About.css";

class About extends Component {
  state = {
    data: null
  };

  componentDidMount = () => {
    axios.get("/api/about").then(resp => {
      this.setState({data: resp.data});
    });
  }

  render() {
    const {t} = this.props;
    const {lang, page} = this.props.params;
    const {data} = this.state;
    const site = page ? page : "background";
    const validPages = ["background", "press", "glossary", "legal"];

    const valid = validPages.includes(site);
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
      title: `Data México | ${t("About")}`,
      desc: t("share.about")
    };

    return (
      <div className="about-wrapper">
        <HelmetWrapper info={share} />
        <Nav
          className="background"
          logo={false}
          routeParams={this.props.router && this.props.router.params ? this.props.router.params : null}
          routePath="/:lang"
          title=""
        />
        <div className="about-content">
          <div className="about-hero">
            <h2 className="about-hero-title">{t("About")}</h2>
            <div className="about-hero-buttons">
              {validPages.map((d, i) => (
                <a href={`/${lang}/about/${d}`} className={classnames("about-hero-button", {"is-active": d === site})} key={i}>
                  <img src="" alt="" className="about-hero-button-icon" />
                  <span className="about-hero-button-name">{t(`AboutSite.${d}`)}</span>
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
