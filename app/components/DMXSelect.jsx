import React from "react";
import {withNamespaces} from "react-i18next";
import {Select} from "@blueprintjs/select";
import {Button, MenuItem} from "@blueprintjs/core";
import classnames from "classnames";

import "./DMXSelect.css";

class DMXSelect extends React.Component {
  state = {
    isOpen: false
  }

  renderItem = (item, {modifiers, handleClick}) => {
    const {t} = this.props;
    if (!modifiers.matchesPredicate) {
      return null;
    }

    return <MenuItem
      active={modifiers.active}
      key={`${item.value || item.id}-${item.title || item.name}`}
      label={item.label || ""}
      onClick={handleClick}
      shouldDismissPopover={false}
      text={<div className="menu-item-text">{t(item.title) || t(item.name)}</div>}
    />;

  };
  render() {
    const {disabled, items, popoverPosition, selectedItem, title, icon, t} = this.props;
    const {isOpen} = this.state;
    return <div className="dmx-selector">
      <div className="dmx-selector-header">
        {icon && <img src={icon} alt="selector-icon" className="dmx-selector-icon"/>}
        <h6 className="title is-6">{title}</h6>
      </div>
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
          text={t(selectedItem.title) || t(selectedItem.name)}
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

export default withNamespaces()(DMXSelect);
