import React, {Component} from 'react';
import {Icon, Tooltip, Overlay, Button} from "@blueprintjs/core";

import "./DMXOverlay.css";

export class DMXOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  handleOverlay = () => this.setState({isOpen: !this.state.isOpen});

  render() {
    const {isOpen} = this.state;
    console.log("ioOpen", isOpen);
    const {buttonToClose, content, icon, tooltip} = this.props;

    return (
      <div className="dmx-overlay">
        <Tooltip content={tooltip} boundary={"flip"}><Icon icon={icon} onClick={this.handleOverlay} /></Tooltip>
        <Overlay
          canEscapeKeyClose={true}
          canOutsideClickClose={true}
          hasBackdrop={true}
          isOpen={isOpen}
          onClose={this.handleClose}
          transitionDuration={0}
          useTallContent={true}
        >
          <div className="dmx-overlay-card">
            {content}
            {buttonToClose && <Button text={buttonToClose} className={"dmx-overlay-card-button"} onClick={this.handleOverlay}/>}
          </div>
        </Overlay>
      </div>
    )
  }
}

export default DMXOverlay
