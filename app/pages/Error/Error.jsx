import React, {Component} from "react";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import "./Error.css";

class Error extends Component {
  render() {
    const {errorType, locale} = this.props;

    let text = "Lo sentimos, esta página no existe.";
    // if (errorType === "stub") {
    //   text = "This page is currently under construction.";
    // }

    return (
      <div className="error">
        <Helmet title="Error">
          <meta property="og:title" content="Error" />
        </Helmet>
        <Nav
          className="background"
          logo={false}
          routeParams={this.props.router && this.props.router.params ? this.props.router.params : null}
          routePath="/:lang"
          title=""
        />
        <div className="error-header container">
          <h1 className="error-header-title u-font-xxl">{errorType}</h1>
          <div className="error-header-img" />
        </div>
        <div className="error-container container">
          <p className="u-font-lg">{text}</p>
          <p className="u-font-lg"><a href={`/${locale}/explore`}>Explora perfiles</a> o vuelve al <a href="/">inicio</a>.</p>
        </div>
        <Footer />
      </div>
    );
  }
}

Error.contextTypes = {
  router: PropTypes.object
};

Error.defaultProps = {
  locale: "es",
  errorType: "404"
};

export default withNamespaces()(Error);
