import React, {Component} from "react";
import PropTypes from "prop-types";
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
  render() {
    const {t} = this.props;
    const {page} = this.props.params;
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
        <div className="about-hero">
          <h2 className="about-hero-title">{site}</h2>
        </div>
        <div className="about-content">
          {(function () {
            switch (site) {
              case "background":
                return <Background />;
              case "press":
                return <Press />;
              case "glossary":
                return <Glossary />;
              case "legal":
                return <Legal />;
              default:
                return <Background />;
            }
          }())}
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
