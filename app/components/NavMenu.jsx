import React from "react";
import {withNamespaces} from "react-i18next";
import {Dialog, Position, Icon} from "@blueprintjs/core";

import "./NavMenu.css";

class NavMenu extends React.Component {
  state = {
    isOpen: true
  }

  render() {
    const {isOpen} = this.props;
    const {dialogClassName, t} = this.props;

    return <Dialog
      className={`${dialogClassName} nav-menu`}
      isOpen={isOpen}
      transitionName={"slide"}
      lazy={false}
      backdropClassName={dialogClassName}
      onClose={() => this.props.run(false)}
    >
      <div className="nav-menu-content">
        <span className="close-button click">
          <Icon icon="cross" onClick={() => this.props.run(false)} />
        </span>
        <div>
          <ul>
            <li><a href="/">{t("Home")}</a></li>
            <li><a href="#">{t("Explore")}</a></li>
            <ul>
              <li><a href="/">{t("Locations")}</a></li>
              <li><a href="/">{t("Products")}</a></li>
              <li><a href="/">{t("Industries")}</a></li>
              <li><a href="/">{t("Occupations")}</a></li>
              <li><a href="/">{t("Universities")}</a></li>
            </ul>
            <li><a href="#">{t("Vizbuilder")}</a></li>
            <li><a href="#">{t("About")}</a></li>
            <li><a href="#">{t("Data Sources")}</a></li>
          </ul>
        </div>
        <div className="nav-footer">
          <img src="/icons/SE.svg" alt=""/>
          <img src="/icons/matt-white.svg" alt=""/>
          <img src="/icons/datawheel-white.svg" alt=""/>
        </div>
      </div>
    </Dialog>;
  }
}

export default withNamespaces()(NavMenu);
