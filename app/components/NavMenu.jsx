import React from "react";
import {Dialog} from "@blueprintjs/core";

import "./NavMenu.css";

class NavMenu extends React.Component {
  state = {
    isOpen: true
  }

  render() {
    const {isOpen} = this.state;

    return <Dialog
      className="nav-menu"
      isOpen={isOpen}
      onClose={() => this.setState({isOpen: !isOpen})}
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
