import React, {Component} from 'react'
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Glossary extends Component {
  render() {
    const {t, glossary} = this.props;
    const initials = [...new Set(glossary.map(m => m.Initial))].sort((a, b) => a.localeCompare(b));
    return (
      <div className="about-glossary">
        <h3>{t("About.Glossary")}</h3>
        {glossary.length > 0 && initials.map(d => (
          <div className="glossary-initial">
            <h4>{d}</h4>
            {glossary.filter(f => f.Initial === d).sort((a, b) => a.Concept.localeCompare(b.Concept)).map((m, i) => (
              <div className="glossary-item" key={i}>
                <h5>{m.Concept}</h5>
                <p>{m.Description}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    )
  }
}

Glossary.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Glossary);
