import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon, InputGroup, Popover} from "@blueprintjs/core";
import NavMenu from "./NavMenu";
import classnames from "classnames";


import "./Nav.css";


class Nav extends React.Component {
  state = {
    isOpen: false,
    isSearchOpen: false
  }

  render() {
    const {className, logo, title, t} = this.props;
    const {isOpen, isSearchOpen} = this.state;

    return <div className={`${className} nav click`}>
      <NavMenu
        isOpen={isOpen}
        dialogClassName={isOpen ? "slide-enter" : "slide-exit"}
        run={isOpen => this.setState({isOpen})}
      />
      <div className="nav-left">
        <span onClick={() => this.setState({isOpen: !isOpen})}><Icon icon="menu" /> <span className="menu">{t("Menu")}</span></span>
      </div>
      <div className="nav-center">
        {(logo || className === "background") && <a className="profile-logo" href="/" data-refresh="true"><img src="/icons/logo-horizontal.svg" alt=""/></a>}
        <span className="nav-subtitle">{title}</span>
      </div>
      <div className="nav-right">
        <div className={classnames("search-button", {active: isSearchOpen})}>
          <Icon icon="search" className="click" onClick={() => this.setState({isSearchOpen: !isSearchOpen})} />
          <Popover
            popoverClassName="nav-search-popover"
            content={<div className="">
              hola
            </div>}
            portal={true}
            portalClassName="nav-search-portal"
            position="bottom"
            minimal={true}
            isOpen={isSearchOpen}
          >
            <InputGroup
              placeholder={t("Search profiles")}
              className={classnames({active: isSearchOpen})}
              autoFocus="true"
            />
          </Popover>
        </div>
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
