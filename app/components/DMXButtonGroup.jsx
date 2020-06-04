import React from "react";
import {withNamespaces} from "react-i18next";
import Button from "@datawheel/canon-cms/src/components/fields/Button.jsx";

import "./DMXButtonGroup.css";

class DMXButtonGroup extends React.Component {
  render() {
    const {items, selected, title, t} = this.props;
    return <div className="dmx-button-group cp-button-group">
      {title && <h6 className="dmx-button-group-title title">{title}</h6>}
      <div className="dmx-button-group-items">{items.map((d, i) => <Button
        key={`dmx-button-${i}`}
        className={selected.id === d.id ? "cp-button is-active" : "cp-button"}
        minimal={true}
        onClick={() => this.props.callback(d)}
      >{t(d.name)}</Button>)}</div>
    </div>;
  }
}
DMXButtonGroup.defaultProps = {
  items: [],
  selected: {},
  title: undefined
};

export default withNamespaces()(DMXButtonGroup);
