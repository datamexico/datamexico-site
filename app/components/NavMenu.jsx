import React from "react";
import {Dialog, Position, Icon} from "@blueprintjs/core";

import "./NavMenu.css";

class NavMenu extends React.Component {
  state = {
    isOpen: true
  }

  render() {
    const {isOpen} = this.props;
    const {dialogClassName} = this.props;

    return <Dialog
      className={`${dialogClassName} nav-menu`}
      isOpen={isOpen}
      transitionName={"slide"}
      lazy={false}
      backdropClassName={dialogClassName}
      onClose={() => this.props.run(false)}
    >
      <div className="nav-menu-content">
        <span className="close-button click">
          <Icon icon="cross" onClick={() => this.props.run(false)} />
        </span>
        <div>
          <ul>
            <li>Home</li>
            <li>Explore</li>
            <ul>
              <li>Locations</li>
              <li>Industries</li>
            </ul>
            <li>About</li>
          </ul>
        </div>
        <div className="nav-footer">
          <img src="/icons/SE.svg" alt=""/>
          <img src="/icons/matt-white.svg" alt=""/>
          <img src="/icons/datawheel-white.svg" alt=""/>
        </div>
      </div>
    </Dialog>;
  }
}

export default NavMenu;
