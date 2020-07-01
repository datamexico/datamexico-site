import React, {Component} from 'react';
import classnames from "classnames";
import {Checkbox} from "@blueprintjs/core";

import "./DMXCheckbox.css";

export class DMXCheckbox extends Component {
  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    return prevProps.unique !== nextProps.unique;
  }

  render() {
    const {title, items, unique, onChange} = this.props;
    return (
      <div className="dmx-checkbox">
        {title && <div className="dmx-checkbox-title">{title}</div>}
        {items.map(d => (
          <div className="dmx-checkbox-item">
            <Checkbox
              label={d.name}
              className={classnames({"hidden": d.unique && unique && unique !== d.value})}
              onChange={event => onChange(event.currentTarget.checked, d.id, d.value)}
            />
          </div>
        ))}
      </div>
    )
  }
}

export default DMXCheckbox
