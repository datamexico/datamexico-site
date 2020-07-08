import React, {Component} from 'react'
import PropTypes from "prop-types";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Glossary extends Component {
  render() {
    const {t} = this.props;
    const glossary = [
      {
        initial: "A",
        title: "Average Net Price",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain."
      },
      {
        initial: "A",
        title: "Average Net Price",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain."
      },
      {
        initial: "A",
        title: "Average Net Price",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain."
      },
      {
        initial: "F",
        title: "FDI",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain."
      },
      {
        initial: "I",
        title: "IED",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain."
      },
      {
        initial: "G",
        title: "GINI",
        description: "On the other hand, we denounce with righteous indignation and dislike men who are so beguiled and demoralized by the charms of pleasure of the moment, so blinded by desire, that they cannot foresee the pain and trouble that are bound to ensue; and equal blame belongs to those who fail in their duty through weakness of will, which is the same as saying through shrinking from toil and pain."
      },
    ];
    const initials = [...new Set(glossary.map(m => m.initial))].sort((a, b) => a.localeCompare(b));
    return (
      <div className="about-glossary">
        <h3>{t("AboutSite.glossary")}</h3>
        {initials.map(d => (
          <div className="glossary-initial">
            <h4>{d}</h4>
            {glossary.filter(f => f.initial === d).sort((a, b) => a.title.localeCompare(b.title)).map((m, i) => (
              <div className="glossary-item" key={i}>
                <h5>{m.title}</h5>
                <p>{m.description}</p>
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

export default withNamespaces()(hot(Glossary));
