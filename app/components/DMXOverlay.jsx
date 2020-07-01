import React, {Component} from 'react';
import {Icon, Overlay} from "@blueprintjs/core";

import "./DMXOverlay.css";

export class DMXOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleOpen = () => this.setState({isOpen: true});
  handleClose = () => this.setState({isOpen: false, useTallContent: false});

  render() {
    const {isOpen} = this.state;
    const {icon} = this.props;

    return (
      <div className="dmx-overlay">
        <Icon icon={icon} onClick={this.handleOpen} />
        <Overlay
          isOpen={isOpen}
          onClose={this.handleClose}
          hasBackdrop={true}
        >
          <div className="dmx-overlay-open">
            <p>Im a overlay</p>
          </div>
        </Overlay>
      </div>
    )
  }
}

export default DMXOverlay
