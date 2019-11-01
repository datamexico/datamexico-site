import React from "react";
import {withNamespaces} from "react-i18next";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";

import "./Footer.css";

class Footer extends React.Component {
  render() {
    const {t} = this.props;

    return <footer className="footer container">
      <div className="columns">
        <div className="column">

          <div className="footer-links">
            <div className="footer-columns">
              <div className="footer-column">
                <h2 className="u-visually-hidden">Site navigation</h2>
                <h3 className="footer-heading display u-font-sm">{t("Explore")}</h3>
                <ul>
                  <li><a href="/explore">{t("Profiles")}</a></li>
                  <li><a href="#">{t("Viz Builder")}</a></li>
                  <li><a href="#">{t("Data Cart")}</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3 className="footer-heading display u-font-sm">{t("Sources")}</h3>
                <ul>
                  <li><a href="#">{t("Data Sources")}</a></li>
                  <li><a href="#">{t("API")}</a></li>
                  <li><a href="#">{t("Classifications")}</a></li>
                  <li><a href="#">{t("Contact us")}</a></li>
                </ul>
              </div>
              <div className="footer-column">
                <h3 className="footer-heading display u-font-sm">{t("About")}</h3>
                <ul>
                  <li><a href="#">{t("Background")}</a></li>
                  <li><a href="#">{t("In the press")}</a></li>
                  <li><a href="#">{t("Team")}</a></li>
                  <li><a href="#">{t("Glossary")}</a></li>
                  <li><a href="#">{t("Terms of use")}</a></li>
                </ul>
              </div>
            </div>
          </div>

        </div>
        <div className="column footer-contact">
          <h3 className="u-font-sm">{t("Receive updates on news, datasets, and features?")}</h3>
          <InputGroup
            leftIcon="envelope"
            className="footer-email"
            placeholder="Your email address"
            rightElement={<button className="submit-button" onClick={() => console.log("hook me up carlos!")}>{t("Sign Up")}<Icon icon="arrow-right" /></button>}
          />
          <div className="sponsors">
            <img className="brand" src="/icons/SE.png" alt="" />
            <img className="brand" src="/icons/matt-white.svg" alt="" />
            <img className="brand" src="/icons/datawheel-white.svg" alt="" />
          </div>
        </div>
      </div>
    </footer>;
  }
}

export default withNamespaces()(Footer);
