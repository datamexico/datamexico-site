import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon, InputGroup} from "@blueprintjs/core";

import {FOOTER_NAV, LOGOS} from "helpers/consts.js";
import {Toaster, Intent, Position} from "@blueprintjs/core";
import axios from "axios";

import "./Footer.css";

class Footer extends React.Component {

  state = {
    email: ""
  };

  refHandlers = {
    toaster: ref => this.toaster = ref
  };

  addToast = toast => {
    toast.timeout = 5000;
    if (!toast.intent) {
      toast.className = "toast-success";
      toast.intent = Intent.SUCCESS;
    }
    this.toaster.show(toast);
  }

  handleUser = evt => {
    const {email} = this.state;

    const formData = new FormData();

    formData.append("entry.1182831599", email); // Email
    // Reset input content
    evt.target.reset();
    evt.preventDefault();

    const CORS_PROXY = "https://cors-anywhere.herokuapp.com/";
    const GOOGLE_FORM_ACTION_URL =
      "https://docs.google.com/forms/d/e/1FAIpQLSexPJnu7z2NEesS2o4dwpFHp8BAxjtCeWbU0FKvyOXw91y0ag/formResponse";

    axios
      .post(CORS_PROXY + GOOGLE_FORM_ACTION_URL, formData)
      .then(() => {
        this.addToast({
          message: "Gracias por suscribirte en DataMéxico."
        });
      })
      .catch(() => {
        this.addToast({
          intent: Intent.DANGER,
          message: "Algo sucedió mal. Intente nuevamente"
        });
      });
  };

  render() {
    const {t} = this.props;

    return <footer className="footer container">
      <div className="columns">
        <div className="footer-logo-head">
          <img className="footer-logo-page" src={"/icons/homepage/png/logo-dmx-beta-horizontal.png"} alt={"DataMÉXICO"} />
        </div>
        <div className="column">
          <div className="footer-links">
            <nav className="footer-columns">
              <h2 className="u-visually-hidden">Site navigation</h2>
              {FOOTER_NAV.map(col =>
                <div className="footer-column" key={col.title}>
                  <h3 className="footer-heading display u-font-sm">{t(col.title)}</h3>
                  <ul>
                    {col.items.map(link =>
                      <li key={link.title}>
                        <a href={link.url}>{t(link.title)}</a>
                      </li>
                    )}
                  </ul>
                </div>
              )}
            </nav>
          </div>

        </div>
        <div className="column footer-contact">
          <h3 className="u-font-sm">{t("Receive updates on news, datasets, and features?")}</h3>
          <form action="" onSubmit={this.handleUser}>
            <InputGroup
              leftIcon="envelope"
              className="footer-email"
              type="email"
              placeholder={t("Your email address")}
              onChange={evt => this.setState({email: evt.target.value})}
              rightElement={<button className="submit-button">{t("Subscribe me")}<Icon icon="arrow-right" /></button>}
            />
          </form>

          {/* _gotta_ have them logos */}
          <div className="footer-logo-list" role="contentinfo">
            {LOGOS.map(logo =>
              <a className="footer-logo-link" href={logo.url} key={logo.title}>
                <img className="footer-logo-img" src={`/icons/${logo.src}`} alt={logo.title} />
              </a>
            )}
          </div>
        </div>
      </div>

      <Toaster position={Position.BOTTOM} ref={this.refHandlers.toaster}>
        {/* <Toast
          intent={Intent.DANGER}
          // message="No pudimos almacenar tu respuesta. Inténtalo más tarde."
        /> */}
      </Toaster>
    </footer>;
  }
}

export default withNamespaces()(Footer);
