import React, {Component} from 'react';
import {InputGroup, Icon, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";

import colors from "../../static/data/colors.json";
import {stringNormalizer} from "helpers/funcs";

import "./DMXSearchLocation.css";

export class DMXSearchLocation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      filterValue: "",
      isOpen: false
    };
  }

  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    const prevState = this.state;
    return prevProps.statsLocation !== nextProps.statsLocation
      || prevState.isOpen !== nextState.isOpen
      || prevState.filterValue !== nextState.filterValue;
  }

  // Match the value of the filter variable with the text inside the search component
  changeFilterValue = (value) => {this.setState({filterValue: value})}

  // Change the global value of the selected location when the user press one location inside the popover component
  selectLocation = (location) => {
    this.props.addNewLocation(location, "base");
    this.setState({filterValue: "", isOpen: false});
  }

  // Create the popover component with the location value inside filtered by the text inside the seach component
  filterLocationResult = (filter) => {
    const {locationOptions} = this.props;
    const {filterValue} = this.state;
    const filteredLocations = locationOptions.filter(d => stringNormalizer(d.Location).toLowerCase().includes(stringNormalizer(filter).toLowerCase()));
    const filteredDivisions = [...new Set(filteredLocations.map(d => d.Division))];
    const clearSearch = filterValue ? <Icon icon="cross" iconSize={16} onClick={() => this.setState({filterValue: ""})} /> : undefined;
    // Delete after
    const divisionDictionary = {"Country": "País", "State": "Estado"};

    const filterLocationResult =
      <div className="dmx-search-component">
        <InputGroup
          placeholder="Search location..."
          className={"dmx-search-component-input"}
          value={filterValue}
          leftIcon="search"
          rightElement={clearSearch}
          onChange={event => this.changeFilterValue(event.target.value)}
        />
        <div className="dmx-search-component-results">
          {filteredDivisions.length > 0
            ? filteredDivisions.map(d =>
              <div className="dmx-search-component-results-box">
                <span className="dmx-search-component-results-box-division dmx-results-row">{divisionDictionary[d]}</span>
                {filteredLocations.filter(f => f.Division === d).map(m =>
                  <div className="dmx-search-component-results-box-location dmx-results-row" onClick={() => this.selectLocation(m)}>
                    <img src={m["Icon"]} className="dmx-search-component-results-box-location-icon" style={{backgroundColor: colors.State[m["Location ID"]] ? colors.State[m["Location ID"]] : null}} />
                    <span className="dmx-search-component-results-box-location-name">{`${m["Location"]}`}</span>
                    <span className="dmx-search-component-results-box-location-division">{`${divisionDictionary[m["Division"]]}`}</span>
                  </div>
                )}
              </div>
            )
            : <div className="dmx-search-component-results-box">
              <span className="dmx-search-component-results-box-no-options dmx-results-row">{`No options for that search`}</span>
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
    // Delete after
    const divisionDictionary = {"Country": "País", "State": "Estado"};

    return (
      <div className="dmx-search-display">
        <Popover
          autoFocus={true}
          captureDismiss={true}
          content={filterLocationResults}
          defaultIsOpen={false}
          enforceFocus={true}
          isOpen={isOpen}
          position={PopoverPosition.BOTTOM}
        >
          <div className="dmx-search-display-location">
            <img src={isOpen ? "/icons/visualizations/covid/search-active-icon.svg" : "/icons/visualizations/covid/search-01-icon.svg"} alt="" className="dmx-search-display-location-icon" />
            <h2 className="dmx-search-display-location-name" onClick={() => this.setState({isOpen: true})} >
              {locationSelected["Location"]}
            </h2>
          </div>
        </Popover>
        <h3 className="dmx-search-display-location-division">{divisionDictionary[locationSelected["Division"]]}</h3>
      </div>
    )
  }
}

export default DMXSearchLocation
