import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import Background from "./Background";
import Error from "../Error/Error";
import Footer from "components/Footer";
import Glossary from "./Glossary";
import Legal from "./Legal";
import Nav from "components/Nav";
import Press from "./Press";

import "./About.css";

class About extends Component {
  state = {
    glossary: [],
    terms: []
  };

  componentDidMount = () => {
    axios.all([axios.get("/api/glossary"), axios.get("/api/legal")]).then(axios.spread((resp1, resp2) => this.setState({glossary: resp1.data.data, terms: resp2.data.data})));
  }

  render() {
    const {t} = this.props;
    const {lang, page} = this.props.params;
    const {glossary, terms} = this.state;
    const site = page ? page : "background";
    const validPages = ["background", "press", "glossary", "legal"];

    const valid = validPages.includes(site);
    if (!valid) {return <Error />;}

    return (
      <div className="about-wrapper">
        <Helmet title="About">
          <meta property="og:title" content="About" />
        </Helmet>
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
          <div className="about-body about-section">
            {(function () {
              switch (site) {
                case "background":
                  return <Background />;
                case "press":
                  return <Press />;
                case "glossary":
                  return <Glossary glossary={glossary} />;
                case "legal":
                  return <Legal terms={terms} />;
                default:
                  return <Background />;
              }
            }())}
          </div>
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
