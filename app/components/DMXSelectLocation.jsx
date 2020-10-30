import React, {Component} from 'react';
import PropTypes from "prop-types";
import {Checkbox, Button, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";
import {withNamespaces} from "react-i18next";

import {stringNormalizer} from "../helpers/funcs";
import colors from "../../static/data/colors.json";

import "./DMXSelectLocation.css";

class DMXSelectLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false
    };
  }

  /*
  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    const prevState = this.state;
    return prevProps.locationsSelected !== nextProps.locationsSelected || prevState !== nextState;
  }
  */

  createLocationOptions = () => {
    const {t, locationsOptions, locationsSelected, addNewLocation} = this.props;
    const divisions = [...new Set(locationsOptions.map(d => d["Division"]))];
    const locationOptions =
      <div className="dmx-select-results">
        {divisions.map(d =>
          <div className="dmx-select-results-result">
            <span className="dmx-select-results-result-division">{t(d)}</span>
            <div className="dmx-select-results-result-options">
              {locationsOptions.filter(f => f["Division"] === d).map(m => {
                const checkbockLabel = <div className="dmx-select-results-result-options-location-label">
                  <img src={m["Icon"]} className="dmx-select-results-result-options-location-label-icon" style={{backgroundColor: d === "State" ? colors.State[m["Location ID"]] : d === "Municipality" ? colors.State[m["Location ID"].toString().slice(0, -3)] : null}} />
                  <span className="dmx-select-results-result-options-location-label-name">{m["Location"]}</span>
                </div>
                return <Checkbox
                  label={checkbockLabel}
                  className={"dmx-select-results-result-options-location"}
                  defaultChecked={locationsSelected.includes(m["Location ID"]) ? true : false}
                  disabled={locationsSelected.length === 1 && m["Location ID"] === locationsSelected[0] ? true : false}
                  onChange={evt => addNewLocation(m, evt.currentTarget.checked ? "add" : "remove")}
                />
              })}
            </div>
          </div>
        )}
      </div>
    return locationOptions;
  }

  render() {
    const {t} = this.props;
    const {isOpen} = this.state;
    const locationOptions = this.createLocationOptions();

    const buttonContent = <div className="dmx-select-location-button-content">
      <img src="/icons/visualizations/covid/agregar-ubicacion-icon.svg" alt="" className="dmx-select-location-button-content-img" />
      <span className="dmx-select-location-button-content-text">{t("Add Location")}</span>
    </div>

    return (
      <div className="dmx-select-location">
        <Popover
          captureDismiss={true}
          content={locationOptions}
          defaultIsOpen={false}
          enforceFocus={false}
          isOpen={isOpen}
          position={PopoverPosition.LEFT}
        >
          <Button
            className={"dmx-select-location-button"}
            onClick={() => this.setState({isOpen: !isOpen})}
            text={buttonContent}
          />
        </Popover>
      </div>
    )
  }
}

DMXSelectLocation.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(DMXSelectLocation);
