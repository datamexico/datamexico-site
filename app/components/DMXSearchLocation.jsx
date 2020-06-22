import React, {Component} from 'react';
import {InputGroup, Icon, Spinner, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";

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

  shouldComponentUpdate = (nextProps, nextState) => {
    const prevProps = this.props;
    const prevState = this.state;
    return prevProps.statsLocation !== nextProps.statsLocation || prevState.isOpen !== nextState.isOpen || prevState.filterValue !== nextState.filterValue;
  }

  selectLocation = (location) => {
    this.props.selectNewLocation(location);
    this.setState({
      filterValue: "",
      isOpen: false
    });
  }

  filterLocationResult = (filter) => {
    const {locationsArray} = this.props;
    const filterLocations = locationsArray.filter(d => stringNormalizer(d.Label).toLowerCase().includes(stringNormalizer(filter).toLowerCase()));
    const divisions = [...new Set(filterLocations.map(d => d.Division))];

    const filterLocationResult =
      <div className="dmx-search-results">
        {divisions.length > 0
          ? divisions.map(d =>
            <div className="dmx-search-result">
              <span className="dmx-search-results-division dmx-result-row">{d}</span>
              {filterLocations.filter(f => f.Division === d).map(m =>
                <div className="dmx-search-results-location dmx-result-row" onClick={() => this.selectLocation(m)}>
                  <img src={m.Icon} className="location-icon" style={{backgroundColor: colors.State[m.ID] ? colors.State[m.ID] : null}} />
                  <span className="location-name">{`${m.Label}`}</span>
                  <span className="location-division">{`${m.Division}`}</span>
                </div>
              )}
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
          isOpen={isOpen}
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
          // onBlur={() => this.setState({isOpen: false})}
          />
        </Popover>
      </div>
    )
  }
}

export default DMXSearchLocation
