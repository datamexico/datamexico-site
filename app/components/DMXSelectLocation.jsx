import React, {Component} from 'react';
import {Checkbox, Button, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";

import {stringNormalizer} from "../helpers/funcs";
import colors from "../../static/data/colors.json";

import "./DMXSelectLocation.css";

export class DMXSelectLocation extends Component {
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
    const {locationBase, locationsOptions, locationsSelected, addNewLocation} = this.props;
    const divisions = [...new Set(locationsOptions.map(d => d["Division"]))];
    // Delete after
    const divisionDictionary = {"Country": "País", "State": "Estado"};

    const locationOptions =
      <div className="dmx-select-results">
        {divisions.map(d =>
          <div className="dmx-select-result">
            <span className="dmx-select-results-division">{divisionDictionary[d]}</span>
            <div className="dmx-select-result-options">
              {locationsOptions.filter(f => f["Division"] === d).map(m => {
                const checkbockLabel = <div className="dmx-result-label">
                  <img src={m["Icon"]} className="label-icon" style={{backgroundColor: colors.State[m["Location ID"]] ? colors.State[m["Location ID"]] : null}} />
                  <span className="label-name">{m["Location"]}</span>
                </div>
                return <Checkbox
                  label={checkbockLabel}
                  className={"dmx-select-results-location"}
                  defaultChecked={locationsSelected.includes(m["Location ID"]) ? true : false}
                  defaultIndeterminate={m["Location ID"] === locationBase["Location ID"] ? true : false}
                  disabled={m["Location ID"] === locationBase["Location ID"] ? true : false}
                  onChange={evt => addNewLocation(m, evt.currentTarget.checked)}
                />
              })}
            </div>
          </div>
        )}
      </div>
    return locationOptions;
  }

  render() {
    const {isOpen} = this.state;
    const locationOptions = this.createLocationOptions();

    const buttonContent = <div className="dmx-button-content">
      <img src="/icons/visualizations/covid/agregar-ubicacion-icon.svg" alt="" className="dmx-button-content-img" />
      <span className="dmx-button-content-text">{"Añadir Localidad"}</span>
    </div>

    return (
      <div className="dmx-select-location">
        <Popover
          defaultIsOpen={false}
          isOpen={isOpen}
          position={PopoverPosition.LEFT}
          content={locationOptions}
          captureDismiss={true}
          enforceFocus={false}
        >
          <Button
            className={"dmx-button"}
            onClick={() => this.setState({isOpen: !isOpen})}
            text={buttonContent}
          />
        </Popover>
      </div>
    )
  }
}

export default DMXSelectLocation
