import React from "react";
import {Icon} from "@blueprintjs/core";

import "./DMXTree.css";

export default class DMXTree extends React.Component {
  state = {
    isOpen: false
  }
  render() {
    const {isOpen} = this.state;
    const {t, children} = this.props;
    return <div className="dmx-tree">
      <h6 className="title is-6" onClick={() => this.setState({isOpen: !isOpen})}>
        <Icon icon={`chevron-${isOpen ? "down" : "right"}`} /> {t("Advanced options")}
      </h6>
      {isOpen && <div className="dmx-tree-content">{children}</div>}
    </div>
  }
}
