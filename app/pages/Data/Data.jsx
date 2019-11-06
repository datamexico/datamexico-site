import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import Error from "../Error/Error";
import "./Data.css";

class Data extends Component {
  render() {
    return (
      <Error errorType="stub" />
    );
  }
}

Data.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Data);
