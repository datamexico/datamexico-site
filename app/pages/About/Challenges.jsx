/*import React, {Component} from 'react'
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./About.css";

class Challenges extends Component {
  render() {
    const {t, challenges} = this.props;
    return (
      <div className="about-challenge">
        <h3>{t("About.Challenges")}</h3>
        {challenges.length > 0 && challenges.map(d => (
          <div>
            <h4>{d.Challenge}</h4>
            <p>{d.Description}</p>
            <div>
              <ul>
              <li>{d.Position}: <a href={d.URL} target="_blank" rel="noopener noreferrer">{d.Project}</a></li>
              <p>{d.Explanation}</p>
            </ul>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

Challenges.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(Challenges);*/
