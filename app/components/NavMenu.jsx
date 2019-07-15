import React from "react";
import {Dialog, Position} from "@blueprintjs/core";

import "./NavMenu.css";

class NavMenu extends React.Component {
  state = {
    isOpen: true
  }

  render() {
    const {isOpen} = this.state;
    const {dialogClassName} = this.props;

    return <Dialog
      className={`${dialogClassName} nav-menu`}
      isOpen={isOpen}
      transitionName={"slide"}
      // lazy={false}
      onClose={() => this.props.run(false)}
    >
      <div className="nav-menu-content">
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
