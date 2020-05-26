import React from "react";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";
import classnames from "classnames";

import "./DMXSelect.css";

export default class DMXSelect extends React.Component {
  state = {
    isOpen: false
  }

  renderItem = (item, {modifiers, handleClick}) => {
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return <MenuItem
      active={modifiers.active}
      key={`${item.value || item.id}-${item.title || item.name}`}
      label={item.label || ""}
      onClick={handleClick}
      shouldDismissPopover={false}
      text={<div className="menu-item-text">{item.title || item.name}</div>}
    />;

  };
  render() {
    const {disabled, items, popoverPosition, selectedItem, title} = this.props;
    const {isOpen} = this.state;
    return <div className="dmx-selector">
      <h6 className="title is-6">{title}</h6>
      <Select
        activeItem={selectedItem}
        className={classnames(
          "popover-virtual-selector",
          "filter-selector",
          {"is-disabled": disabled}
        )}
        disabled={disabled}
        filterable={false}
        isOpen={isOpen}
        itemRenderer={this.renderItem}
        items={items}
        minimal={true}
        usePortal={false}
        onItemSelect={d => this.props.callback(d)}
        popoverProps={{minimal: true, position: popoverPosition, popoverClassName: "selector"}}
      >
        <Button
          className="dmx-selector-button"
          minimal={true}
          text={selectedItem.title || selectedItem.name}
          rightIcon="chevron-down"
        />
      </Select>
    </div>;
  }
}

DMXSelect.defaultProps = {
  callback: undefined,
  disabled: false,
  selectedItem: {},
  popoverPosition: "bottom-left"
};
