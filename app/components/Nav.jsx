import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon} from "@blueprintjs/core";

import "./Nav.css";
import NavMenu from "./NavMenu";

class Nav extends React.Component {
  state = {
    isOpen: false
  }

  render() {
    const {className, title, t} = this.props;
    const {isOpen} = this.state;
    return <div className={`${className} nav`}>
      {isOpen && <NavMenu />}
      <div className="nav-left">
        <span onClick={() => this.setState({isOpen: true})}><Icon icon="menu" /> <span className="menu">{t("Menu")}</span></span>
      </div>
      <div className="nav-center">
        <img className="profile-logo" src="/icons/logo-horizontal.svg" alt=""/>
        <span className="nav-subtitle">{title}</span>
      </div>
      <div className="nav-right">
        <Icon icon="search" />
      </div>
    </div>;
  }
}

Nav.defaultProps = {
  className: "",
  title: ""
};

export default withNamespaces()(Nav);
