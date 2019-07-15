import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon} from "@blueprintjs/core";
import NavMenu from "./NavMenu";

import "./Nav.css";


class Nav extends React.Component {
  state = {
    isOpen: false
  }

  render() {
    const {className, logo, title, t} = this.props;
    const {isOpen} = this.state;
    return <div className={`${className} nav`}>
      <NavMenu
        dialogClassName={isOpen ? "slide-active" : "slide-leave"}
        run={isOpen => this.setState({isOpen})}
      />
      <div className="nav-left">
        <span onClick={() => this.setState({isOpen: !this.state.isOpen})}><Icon icon="menu" /> <span className="menu">{t("Menu")}</span></span>
      </div>
      <div className="nav-center">
        {(logo || className === "background") && <a className="profile-logo" href="/" data-refresh="true"><img src="/icons/logo-horizontal.svg" alt=""/></a>}
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
  logo: true,
  title: ""
};

export default withNamespaces()(Nav);
