import React, {Component} from "react";
import PropTypes from "prop-types";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import "./Error.css";

class Error extends Component {
  render() {
    const {t, errorType, locale, route, routeParams} = this.props;

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
          routePath={route.path}
          routeParams={routeParams}
          //routeParams={this.props.router && this.props.router.params ? this.props.router.params : null}
          title=""
        />
        <div className="error-header container">
          <h1 className="error-header-title u-font-xxl">{errorType}</h1>
          <div className="error-header-img" />
        </div>
        <div className="error-container container">
          <p className="u-font-lg">{t("Error.Text")}</p>
          <p className="u-font-lg" dangerouslySetInnerHTML={{__html: t("Error.Redirection", {locale: locale}) }}></p>
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
