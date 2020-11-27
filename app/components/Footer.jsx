import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon, InputGroup} from "@blueprintjs/core";

import {FOOTER_NAV, LOGOS, SOCIAL_MEDIA} from "helpers/consts.js";
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
    const {t, lng} = this.props;

    const NAV = FOOTER_NAV.map(column => {
      let items = column.items;
      items.forEach(item => {
        item.url = item.url.includes(":lng") ? item.url.replace(":lng", lng) : item.url;
      });
      return column
    });

    const translate_disclaimer = {
      en: "The translations presented on the site were made automatically through the Google Translate API"
    };

    return <footer className="footer container">
      <div className="columns">
        <div className="footer-logo-head">
          <img className="footer-logo-page" src={"/icons/homepage/png/logo-dmx-beta-horizontal.png"} alt={"DataMÉXICO"} />
          <div className="footer-social-media">
            {SOCIAL_MEDIA.map(d => (
              <div>
                <a href={d.url} target="_blank" rel="noopener noreferrer" alt={d.title}>
                  <img className="footer-social-media-logo" src={`/icons/social_media/${d.src}`} />
                </a>
              </div>
            ))}
          </div>
          {lng !== "es" && (
            <div className="footer-translate-disclaimer">
              <span>{translate_disclaimer[lng]}</span>
            </div>
          )}
        </div>

        <div className="column">
          <div className="footer-links">
            <nav className="footer-columns">
              <h2 className="u-visually-hidden">Site navigation</h2>
              {NAV.map(col =>
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
          <h3 className="u-font-sm">{t("Footer.MailTitle")}</h3>
          <form action="" onSubmit={this.handleUser}>
            <InputGroup
              leftIcon="envelope"
              className="footer-email"
              type="email"
              placeholder={t("Footer.Mail")}
              onChange={evt => this.setState({email: evt.target.value})}
              rightElement={<button className="submit-button">{t("Footer.MailSubscribe")}<Icon icon="arrow-right" /></button>}
            />
          </form>

          {/* _gotta_ have them logos */}
          <div className="footer-logo-list" role="contentinfo">
            {LOGOS.map(logo =>
              <a className="footer-logo-link" href={logo.url} key={logo.title} target="_blank" rel="noopener noreferrer">
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
