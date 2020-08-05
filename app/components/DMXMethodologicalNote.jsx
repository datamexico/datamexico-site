import React, { Component } from 'react';
import {Icon, Tooltip, Position, PopoverInteractionKind} from "@blueprintjs/core";

import "./DMXMethodologicalNote.css";

export class DMXMethodologicalNote extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  keepItOpen = () => this.setState({isOpen: !this.state.isOpen});

  render() {
    const {isOpen} = this.state;
    const {content} = this.props;
    return (
      <div className="dmx-methodological-note">
        <Tooltip content={content} interactionKind={PopoverInteractionKind.HOVER} position={Position.RIGHT_TOP}>
          <Icon icon={"info-sign"} />
        </Tooltip>
      </div>
    )
  }
}

export default DMXMethodologicalNote
