import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon, InputGroup} from "@blueprintjs/core";

import "./Search.css";
import Nav from "./Nav";

class Search extends React.Component {

  render() {
    const {t} = this.props;
    return <div className="search-panel">
      <Nav className="background" />
      <div className="container">
        <InputGroup leftIcon="search" />
      </div>
    </div>;
  }
}

export default withNamespaces()(Search);
