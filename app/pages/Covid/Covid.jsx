import React, {Component} from "react";
import PropTypes from "prop-types";
import axios from "axios";
import classnames from "classnames";
import {Helmet} from "react-helmet";
import {withNamespaces} from "react-i18next";

import Nav from "../../components/Nav";
import Footer from "../../components/Footer";
import CovidCard from "../../components/CovidCard";

import "./Covid.css";

class Covid extends Component {
  render() {
    return <div className="covid">
      <Helmet title="Coronavirus">
        <meta property="og:title" content={"Coronavirus"} />
      </Helmet>
      <Nav
        className={"background"}
        logo={false}
        routeParams={this.props.router.params}
        routePath={"/:lang"}
        title={""}
      />
      <div className="covid-header">
        <h1>Covid</h1>
      </div>
      <div className="covid-container container">
        <CovidCard />
      </div>
      <Footer />
    </div>;
  }
}

Covid.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Covid);
