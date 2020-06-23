import React, {Component} from 'react';
import {Checkbox, Button, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";

import {stringNormalizer} from "../helpers/funcs";

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
    const {locationsOptions, locationsSelected, addNewLocation} = this.props;
    const divisions = [...new Set(locationsOptions.map(d => d["Division"]))];

    const locationOptions =
      <div className="dmx-select-results">
        {divisions.map(d =>
          <div className="dmx-select-result">
            <span className="dmx-select-results-division">{d}</span>
            <div className="dmx-select-result-options">
              {locationsOptions.filter(f => f["Division"] === d).map(m =>
                <Checkbox
                  label={`${m["Location"]}`}
                  className={"dmx-select-results-location"}
                  defaultChecked={locationsSelected.includes(m["Location ID"]) ? true : false}
                  onChange={evt => addNewLocation(m, evt.currentTarget.checked)}
                />
              )}
            </div>
          </div>
        )}
      </div>
    return locationOptions;
  }

  render() {
    const {isOpen} = this.state;
    const locationOptions = this.createLocationOptions();

    return (
      <div className="dmx-select-location">
        <Popover
          defaultIsOpen={false}
          isOpen={isOpen}
          position={PopoverPosition.AUTO}
          content={locationOptions}
          captureDismiss={true}
          enforceFocus={false}
        >
          <Button
            icon={"series-add"}
            onClick={() => this.setState({isOpen: !isOpen})}
            text={"Add Locations"}
          />
        </Popover>
      </div>
    )
  }
}

export default DMXSelectLocation
