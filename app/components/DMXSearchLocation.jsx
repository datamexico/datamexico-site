import React, {Component} from 'react';
import PropTypes from "prop-types";
import {InputGroup, Icon, Popover, PopoverPosition, PopoverInteractionKind} from "@blueprintjs/core";
import {withNamespaces} from "react-i18next";

import colors from "../../static/data/colors.json";
import {stringNormalizer} from "helpers/funcs";

import "./DMXSearchLocation.css";

class DMXSearchLocation extends Component {
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
    this.props.resetBaseLocation(location);
    this.setState({filterValue: "", isOpen: false});
  }

  // Create the popover component with the location value inside filtered by the text inside the seach component
  filterLocationResult = (filter) => {
    const {t, locationOptions} = this.props;
    const {filterValue} = this.state;
    const filteredLocations = locationOptions.filter(d => stringNormalizer(d.Location).toLowerCase().includes(stringNormalizer(filter).toLowerCase()));
    const filteredDivisions = [...new Set(filteredLocations.map(d => d.Division))];
    const clearSearch = filterValue ? <Icon icon="cross" iconSize={16} onClick={() => this.setState({filterValue: ""})} /> : undefined;

    const filterLocationResult =
      <div className="dmx-search-component">
        <InputGroup
          placeholder={t("Search location")}
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
                <span className="dmx-search-component-results-box-division dmx-results-row">{t(d)}</span>
                {filteredLocations.filter(f => f.Division === d).map(m =>
                  <div className="dmx-search-component-results-box-location dmx-results-row" onClick={() => this.selectLocation(m)}>
                    <img src={m["Icon"]} className="dmx-search-component-results-box-location-icon" style={{backgroundColor: d === "State" ? colors.State[m["Location ID"]] : d === "Municipality" ? colors.State[m["Location ID"].toString().slice(0, -3)] : null}} />
                    <span className="dmx-search-component-results-box-location-name">{`${m["Location"]}`}</span>
                    <span className="dmx-search-component-results-box-location-division">{`${t(m["Division"])}`}</span>
                  </div>
                )}
              </div>
            )
            : <div className="dmx-search-component-results-box">
              <span className="dmx-search-component-results-box-no-options dmx-results-row">{t("No results found")}</span>
            </div>
          }
        </div>
      </div>
    return filterLocationResult;
  }

  render() {
    const {t, locationSelected} = this.props;
    const {filterValue, isOpen} = this.state;
    const filterLocationResults = this.filterLocationResult(filterValue);

    return (
      <div className="dmx-search-display">
        <Popover
          captureDismiss={true}
          content={filterLocationResults}
          defaultIsOpen={false}
          enforceFocus={false}
          isOpen={isOpen}
          position={PopoverPosition.BOTTOM}
        >
          <div className="dmx-search-display-location">
            <img src={isOpen ? "/icons/visualizations/covid/search-active-icon.svg" : "/icons/visualizations/covid/search-01-icon.svg"} alt="" className="dmx-search-display-location-icon" />
            <h2 className="dmx-search-display-location-name" onClick={() => this.setState({isOpen: !isOpen})} >
              {locationSelected["Location"]}
            </h2>
          </div>
        </Popover>
        <h3 className="dmx-search-display-location-division">{t(locationSelected["Division"])}</h3>
      </div>
    )
  }
}

DMXSearchLocation.contextTypes = {
  router: PropTypes.object
};

export default withNamespaces()(DMXSearchLocation);
