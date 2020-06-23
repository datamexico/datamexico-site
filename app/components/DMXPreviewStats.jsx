import React, {Component} from "react";
import PropTypes from "prop-types";
import {withNamespaces} from "react-i18next";

import "./DMXPreviewStats.css";

class DMXPreviewStats extends Component {
  /*
  shouldComponentUpdate = (nextProp, nextState) => {
    const prevProps = this.props;
    return nextProp !== prevProps;
  }
  */

  render() {
    const {t, data, stats} = this.props;

    return (
      <div className="dmx-preview-stats">
        {stats.map(d => (
          <div className="stat">
            <span className="stat-value">{data[d.ID]}</span>
            <span className="stat-name">{d.Name}</span>
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
