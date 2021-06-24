import React, {Component} from 'react'
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Legal extends Component {
  render() {
    const {t, terms} = this.props;
    return (
      <div className="about-legal">
        <h3>{t("About.Terms of use")}</h3>
        {terms.length > 0 && terms.map(d => (
          <div>
            <h4>{d.Title}</h4>
            {d.Description ? d.Description.split("\n").map((m, i) => {
              return <p key={i}>{m}</p>
            }) : ""}
          </div>
        ))}
      </div>
    )
  }
}

Legal.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Legal);
