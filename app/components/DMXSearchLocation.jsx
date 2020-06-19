import React, {Component} from 'react';
import {InputGroup, Icon, Spinner, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";
import {Delete} from "@blueprintjs/icons";

import {stringNormalizer} from "../helpers/funcs";
import colors from "../../static/data/colors.json";

import "./DMXSearchLocation.css";

export class DMXSearchLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
      isOpen: false
    };
  }

  changeFilterValue = (value) => {
    this.setState({
      filterValue: value
    });
  }

  filterLocationResult = (filter) => {
    const {locationsArray} = this.props;
    const filterLocations = locationsArray.filter(d => stringNormalizer(d.Label).toLowerCase().includes(stringNormalizer(filter).toLowerCase()));

    const filterLocationResult =
      <div className="dmx-search-results">
        {filterLocations.length > 0
          ? filterLocations.map(d =>
            <div className="dmx-search-results-option" onClick={() => this.props.selectDefaultLocation(d)}>
              <img src={d.Icon} className="option-icon" style={{backgroundColor: colors.State[d.ID] ? colors.State[d.ID] : null}} />
              <span className="option-name">{`${d.Label}`}</span>
              <span className="option-division">{`${d.Division}`}</span>
            </div>
          )
          : <div className="dmx-search-results-option">
            <span className="option-name">No options with that search</span>
          </div>
        }
      </div>
    return filterLocationResult;
  }

  render() {
    const {filterValue, isOpen} = this.state;

    const maybeSpinner = filterValue ? <Icon icon="delete" iconSize={16} onClick={() => this.setState({filterValue: ""})} /> : undefined;
    const filterLocationResults = this.filterLocationResult(filterValue);
    return (
      <div className="dmx-search-location">
        <Popover
          defaultIsOpen={false}
          isOpen={true}
          position={PopoverPosition.BOTTOM}
          content={filterLocationResults}
          captureDismiss={true}
          enforceFocus={true}
        >
          <InputGroup
            placeholder="Search location..."
            type="search"
            value={filterValue}
            leftIcon="search"
            rightElement={maybeSpinner}
            onChange={event => this.changeFilterValue(event.target.value)}
            onClick={() => this.setState({isOpen: true})}
            onBlur={() => this.setState({isOpen: false})}
          />
        </Popover>
      </div>
    )
  }
}

export default DMXSearchLocation
