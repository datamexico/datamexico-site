import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import Error from "../Error/Error";
import "./About.css";

class About extends Component {
  render() {
    return (
      <Error errorType="stub" />
    );
  }
}

About.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(About);
