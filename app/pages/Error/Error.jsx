import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";
import {InputGroup} from "@blueprintjs/core";

import Footer from "../../components/Footer";
import Nav from "../../components/Nav";

import "./Error.css";

class Error extends Component {
  render() {
    const {locale} = this.props;

    return (
      <div className="error">
        <Helmet title="Error">
          <meta property="og:title" content={"Error"} />
        </Helmet>
        <Nav
          className="background"
          logo={false}
          routeParams={this.props.router.params}
          routePath="/:lang"
          title=""
        />
        <div className="error-header container">
          <h1 className="u-font-xxl">404</h1>
          <div className="error-header-img" />
        </div>
        <div className="error-container container">
          <p className="u-font-lg">Our apologies, but this page doesn’t exist.</p>
          <p className="u-font-lg"><a href={`/${locale}/explore`}>Explore profiles</a> or go back to the <a href="/">home page</a>?</p>
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
  locale: "es"
}

export default withNamespaces()(Error);
