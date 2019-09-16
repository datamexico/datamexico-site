import React from "react";
import {withNamespaces} from "react-i18next";
import {Icon, InputGroup, Popover} from "@blueprintjs/core";
import NavMenu from "./NavMenu";
import classnames from "classnames";
import axios from "axios";


import "./Nav.css";
import SearchResult from "./SearchResult";


class Nav extends React.Component {
  state = {
    isOpen: false,
    isSearchOpen: false,
    results: [],
    resultsFilter: [],
    isOpenSearchResults: false
  }

  handleSearch = e => {
    const {results} = this.state;
    const query = e.target.value;

    if (query.length > 0) {
      axios.get(`/api/search?q=${query}`).then(resp => {
        const data = resp.data.results;
        const results = data.map(d => ({id: d.id, name: d.name, slug: d.profile, level: d.hierarchy}));
        this.setState({results, resultsFilter: results});
      });
    }

    const resultsFilter = query.length > 0
      ? results.filter(d => d.name.toLowerCase().indexOf(query.toLowerCase()) >= 0)
      : [];

    const isOpen = query.length > 2;
    this.setState({resultsFilter, isOpenSearchResults: isOpen});
  }

  render() {
    const {className, logo, title, t} = this.props;
    const {isOpen, isSearchOpen, resultsFilter} = this.state;

    return <div className={`${className} nav click`}>
      <NavMenu
        isOpen={isOpen}
        dialogClassName={isOpen ? "slide-enter" : "slide-exit"}
        run={isOpen => this.setState({isOpen})}
      />
      <div className="nav-left">
        <span onClick={() => this.setState({isOpen: !isOpen})}><Icon icon="menu" /> <span className="menu">{t("Menu")}</span></span>
      </div>
      <div className="nav-center">
        {(logo || className === "background") && <a className="profile-logo" href="/" data-refresh="true"><img src="/icons/logo-horizontal.svg" alt=""/></a>}
        <span className="nav-subtitle">{title}</span>
      </div>
      <div className="nav-right">
        <div className={classnames("search-button", {active: isSearchOpen})}>
          <Icon icon="search" className="click" onClick={() => this.setState({isSearchOpen: !isSearchOpen})} />
          <InputGroup
            placeholder={t("Search profiles")}
            className={classnames({active: isSearchOpen})}
            autoFocus="true"
            onChange={this.handleSearch}
          />
          <ul className={classnames("results", {active: isSearchOpen})}>
            {resultsFilter.map((d, i) => <SearchResult
              key={`search_result_${d.id}_${i}`}
              id={d.id}
              slug={d.slug}
              title={d.name}
              level={d.level}
            />)}
          </ul>
        </div>
      </div>
    </div>;
  }
}

Nav.defaultProps = {
  className: "",
  logo: true,
  title: ""
};

export default withNamespaces()(Nav);
