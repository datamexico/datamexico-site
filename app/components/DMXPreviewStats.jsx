import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";
import classnames from "classnames";

import {commas} from "helpers/utils";

import "./DMXPreviewStats.css";

class DMXPreviewStats extends Component {
  shouldComponentUpdate = (nextProp, nextState) => {
    const prevProps = this.props;
    return nextProp !== prevProps;
  }

  render() {
    const {t, data, stats} = this.props;

    return (
      <div className="dmx-preview-stats">
        {stats.map((d, k) => (
          <div className={classnames("stat", k < stats.length-1 && "notLast")}>
            <img src={`/icons/visualizations/covid/${d.IconName}`} alt="" className="stat-icon" />
            <div className="stat-text">
              <span className="stat-value">{commas(data[d.ID])}</span>
              <span className="stat-name">{d.Name}</span>
            </div>
          </div>
        ))}
      </div>
    )
  }
}

DMXPreviewStats.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(DMXPreviewStats);
