import React from "react";
import {withNamespaces} from "react-i18next";
import {Button, Icon, InputGroup, Popover} from "@blueprintjs/core";

import "./Footer.css";

class Footer extends React.Component {
  render() {
    const {t} = this.props;

    return <footer id="Footer" className="footer">
      <div className="container">
        <div className="columns">
          <div className="column">

            <div className="footer-links">
              <div className="explore-columns">
                <div className="explore-column">
                  <h4>{t("Explore")}</h4>
                  <ul>
                    <li>{t("Profiles")}</li>
                  </ul>
                </div>
                <div className="explore-column">
                  <h4>{t("Sources")}</h4>
                  <ul>
                    <li>{t("Data Sources")}</li>
                    <li>{t("API")}</li>
                    <li>{t("Classifications")}</li>
                    <li>{t("Contact us")}</li>
                  </ul>
                </div>
                <div className="explore-column">
                  <h4>{t("About")}</h4>
                  <ul>
                    <li>{t("Background")}</li>
                    <li>{t("In the press")}</li>
                    <li>{t("Team")}</li>
                    <li>{t("Glossary")}</li>
                    <li>{t("Terms of use")}</li>
                  </ul>
                </div>
              </div>
            </div>

          </div>
          <div className="column footer-contact">
            <h4>{t("Receive updates on news, datasets, and features?")}</h4>
            <InputGroup
              leftIcon="envelope"
              className="footer-email"
              placeholder="Your email address"
              rightElement={<span>{t("Sign In")}<Icon icon="arrow-right" /></span>}
            />
            <div className="sponsors">
              <img className="brand" src="/icons/SE.png" alt="" />
              <img className="brand" src="/icons/matt-white.svg" alt="" />
              <img className="brand" src="/icons/datawheel-white.svg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </footer>;
  }
}

export default withNamespaces()(Footer);
