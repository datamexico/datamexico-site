import React from "react";
import {withNamespaces} from "react-i18next";
import {Dialog, Icon} from "@blueprintjs/core";

import {SIDEBAR_NAV, LOGOS} from "helpers/consts.js";
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
        {/* close button */}
        <button className="nav-button close-button" onClick={() => this.props.run(false)}>
          <span className="menu">{t("Menu")}</span>
          <Icon icon="cross" />
        </button>

        {/* nav */}
        <nav className="nav-menu-nav">
          {/* logo / home page link */}
          <a className="nav-menu-logo" href="/">
            <img className="nav-menu-logo-img" src="/icons/logo-horizontal.png" alt={t("Home")} />
          </a>

          {/* main list */}
          <ul className="nav-menu-list">
            {SIDEBAR_NAV.map(link =>
              <li className="nav-menu-item" key={link.title}>
                <a className="nav-menu-link" href={link.url}>
                  {t(link.title)}
                </a>
                {/* nested list */}
                {link.items && Array.isArray(link.items) && link.items.length &&
                  <ul className="nav-menu-nested-list">
                    {link.items.map(nested =>
                      <li className="nav-menu-item nav-menu-nested-item" key={nested.title}>
                        <a className="nav-menu-link nav-menu-nested-link" href={nested.url}>
                          {t(nested.title)}
                        </a>
                      </li>
                    )}
                  </ul>
                }
              </li>
            )}
          </ul>

          {/* _gotta_ have them logos, again */}
          <div className="nav-menu-footer">
            {LOGOS.map(logo =>
              <a className="nav-menu-footer-link" href={logo.url} key={logo.title} aria-hidden tabIndex="-1" target="_blank" rel="noopener noreferrer">
                <img className="nav-menu-footer-img" src={`/icons/${logo.src}`} alt={logo.title} />
              </a>
            )}
          </div>
        </nav>
      </div>
    </Dialog>;
  }
}

export default withNamespaces()(NavMenu);
