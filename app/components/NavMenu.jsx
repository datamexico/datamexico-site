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
        <span className="close-button click">
          <Icon icon="cross" onClick={() => this.props.run(false)} />
        </span>
        <div>
          <ul>
            <li><a href="/">{t("Home")}</a></li>
            <li><Link to={`${lng}/explore`}>{t("Explore")}</Link></li>
            <ul>
              <li><Link to={`${lng}/explore`}>{t("Locations")}</Link></li>
              <li><Link to={`${lng}/explore`}>{t("Products")}</Link></li>
              <li><Link to={`${lng}/explore`}>{t("Industries")}</Link></li>
              <li><Link to={`${lng}/explore`}>{t("Occupations")}</Link></li>
              <li><Link to={`${lng}/explore`}>{t("Universities")}</Link></li>
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
