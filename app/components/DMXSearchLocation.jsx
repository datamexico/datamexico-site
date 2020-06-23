import React, {Component} from 'react';
import {InputGroup, Icon, Spinner, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";

import {stringNormalizer} from "../helpers/funcs";
import colors from "../../static/data/colors.json";

import "./DMXSearchLocation.css";

export class DMXSearchLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterOptions: this.props.locationOptions,
      filterValue: "",
      isOpen: false
    };
  }

  /*
  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    const prevState = this.state;
    return prevProps.statsLocation !== nextProps.statsLocation || prevState.isOpen !== nextState.isOpen || prevState.filterValue !== nextState.filterValue;
  }
  */

  // Match the value of the filter variable with the text inside the search component
  changeFilterValue = (value) => {this.setState({filterValue: value});}

  // Change the global value of the selected location when the user press one location inside the popover component
  selectLocation = (location) => {
    this.props.selectNewLocation(location);
    this.setState({filterValue: "", isOpen: false});
  }

  // Create the popover component with the location value inside filtered by the text inside the seach component
  filterLocationResult = (filter) => {
    const {filterOptions, filterValue} = this.state;
    const filteredLocations = filterOptions.filter(d => stringNormalizer(d.Location).toLowerCase().includes(stringNormalizer(filter).toLowerCase()));
    const filteredDivisions = [...new Set(filteredLocations.map(d => d.Division))];
    const clearSearch = filterValue ? <Icon icon="delete" iconSize={16} onClick={() => this.setState({filterValue: ""})} /> : undefined;

    const filterLocationResult =
      <div className="dmx-search-component">
        <InputGroup
          placeholder="Search location..."
          className={"dmx-search-input"}
          value={filterValue}
          leftIcon="search"
          rightElement={clearSearch}
          onChange={event => this.changeFilterValue(event.target.value)}
        />
        <div className="dmx-search-results">
          {filteredDivisions.length > 0
            ? filteredDivisions.map(d =>
              <div className="dmx-search-results-box">
                <span className="dmx-search-results-division dmx-results-row">{d}</span>
                {filteredLocations.filter(f => f.Division === d).map(m =>
                  <div className="dmx-search-results-location dmx-results-row" onClick={() => this.selectLocation(m)}>
                    <img src={m["Icon"]} className="location-icon" style={{backgroundColor: colors.State[m["Location ID"]] ? colors.State[m["Location ID"]] : null}} />
                    <span className="location-name">{`${m["Location"]}`}</span>
                    <span className="location-division">{`${m["Division"]}`}</span>
                  </div>
                )}
              </div>
            )
            : <div className="dmx-search-results-box">
              <span className="dmx-search-results-no-options dmx-results-row">{`No options for that search`}</span>
            </div>
          }
        </div>
      </div>
    return filterLocationResult;
  }

  render() {
    const {filterValue, isOpen} = this.state;
    const {locationSelected} = this.props;
    const filterLocationResults = this.filterLocationResult(filterValue);

    return (
      <div className="dmx-search-location">
        <Popover
          defaultIsOpen={false}
          isOpen={isOpen}
          position={PopoverPosition.BOTTOM}
          content={filterLocationResults}
          captureDismiss={true}
          enforceFocus={true}
          autoFocus={true}
        >
          <h2 className="location-name" onClick={() => this.setState({isOpen: true})} >
            {locationSelected["Location"]}
          </h2>
        </Popover>
        <h3 className="location-division">{locationSelected["Division"]}</h3>
      </div>
    )
  }
}

export default DMXSearchLocation
