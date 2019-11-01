import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";
import {Dialog, Icon} from "@blueprintjs/core";

import "./NavMenu.css";

class NavMenu extends React.Component {
  state = {
    isOpen: true
  }

  render() {
    const {lng, isOpen} = this.props;
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
        <button className="nav-button close-button" onClick={() => this.props.run(false)}>
          <Icon icon="cross" />
        </button>
        <div>
          <ul>
            <li><a href="/">{t("Home")}</a></li>
            <li><Link to={`${lng}/explore`}>{t("Explore")}</Link></li>
            <ul>
              <li><Link to={`${lng}/explore?profile=geo`}>{t("Locations")}</Link></li>
              <li><Link to={`${lng}/explore?profile=product`}>{t("Products")}</Link></li>
              <li><Link to={`${lng}/explore?profile=industry`}>{t("Industries")}</Link></li>
              <li><Link to={`${lng}/explore?profile=occupation`}>{t("Occupations")}</Link></li>
              <li><Link to={`${lng}/explore?profile=institution`}>{t("Institutions")}</Link></li>
            </ul>
            <li><a href="#">{t("Vizbuilder")}</a></li>
            <li><a href="#">{t("About")}</a></li>
            <li><a href="#">{t("Data Sources")}</a></li>
          </ul>
        </div>
        <div className="nav-footer">
          <img src="/icons/SE.png" alt=""/>
          <img src="/icons/matt-white.svg" alt=""/>
          <img src="/icons/datawheel-white.svg" alt=""/>
        </div>
      </div>
    </Dialog>;
  }
}

export default withNamespaces()(NavMenu);
