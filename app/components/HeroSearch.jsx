import React, {Component} from "react";
import {withNamespaces} from "react-i18next";
import {hot} from "react-hot-loader/root";
import axios from "axios";
import {event, select} from "d3-selection";
import {Icon} from "@blueprintjs/core";
import {encodeChars} from "@datawheel/canon-core";

import SearchResult from "../components/SearchResult";
import "./HeroSearch.css";

class HeroSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchActive: false,
      results: [],
      timeout: 0,
      userQuery: ""
    };
  }

  // handle focus state
  openSearch() {
    const {id, searchActive} = this.state;

    if (!searchActive) {
      this.setState({searchActive: true});
    }

    // fake tab via up/down keys
    select(document).on(`keydown.${id}`, () => {
      const {router} = this.props;
      const {searchActive} = this.state;
      const key = event.keyCode;
      const DOWN = 40, ENTER = 13, ESC = 27, UP = 38;

      // ABORT
      if (key === ESC) {
        this.setState({searchActive: false, userQuery: ""});
      }

      // fake native tab behavior with up & down keys
      else if (searchActive && event.target === this.textInput) {
        const highlighted = document.querySelector(".is-highlighted");

        // item selected
        if (key === ENTER && highlighted) {
          router.push(document.querySelector(".is-highlighted .search-result-link"));
          this.setState({searchActive: false});
        }
        else if (searchActive && (key === DOWN || key === UP)) {
          if (!highlighted) {
            if (key === DOWN) {
              document.querySelector(".hero-search-results li:first-child").classList.add("is-highlighted");
            }
          }
          else {
            const results = document.querySelectorAll(".hero-search-results li");
            const currentIndex = [].indexOf.call(results, highlighted);
            // const listHeight = document.querySelector(".hero-search-results").clientHeight;

            if (key === DOWN && currentIndex < results.length - 1) {
              const newHighlighted = results[currentIndex + 1];
              highlighted.classList.remove("is-highlighted");
              newHighlighted.classList.add("is-highlighted");
              newHighlighted.scrollIntoView(false);
            }
            else if (key === UP) {
              if (currentIndex > 0) {
                const newHighlighted = results[currentIndex - 1];
                highlighted.classList.remove("is-highlighted");
                newHighlighted.classList.add("is-highlighted");
                newHighlighted.scrollIntoView(false);
              }
            }
          }
        }
      }
    }, false);
  }

  // close search
  closeSearch() {
    const {searchActive} = this.state;
    if (searchActive) {
      // wrap in a setTimeout to prevent from firing right away when a result is clicked
      setTimeout(() =>
        this.setState({
          searchActive: false,
          userQuery: "",
          results: []
        }), 200);
    }
  }

  onChange(e) {
    const {timeout} = this.state;
    const {locale, limit, minQueryLength} = this.props;
    const userQuery = e ? e.target.value : "";

    if (userQuery.length < minQueryLength) {
      this.setState({
        searchActive: true,
        results: [],
        userQuery
      });
      clearTimeout(timeout);
    }
    else {
      this.setState({
        // set userQuery separately to avoid input lag
        userQuery,
        // make the request on a timeout
        timeout: setTimeout(() => {
          axios.get("/api/search", {params: {
            q: userQuery,
            locale,
            limit
          }})
            .then(resp => this.setState({results: resp.data.results}));
        }, 180)
      });
    }
  }

  /** when tabbing outside, close the search */
  onBlur(e) {
    const currentTarget = e.currentTarget;

    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        this.closeSearch();
      }
    }, 85); // register the click before closing
  }

  render() {
    const {locale, minQueryLength, t} = this.props;
    const {results, searchActive, userQuery} = this.state;

    return (
      <span
        className={`hero-search ${searchActive ? "is-open" : "is-closed"}`}
        onBlur={this.onBlur.bind(this)}
      >

        <label className="hero-search-label">
          <span className="u-visually-hidden">
            {t("Search locations, industries, occupations, products, and organizations")}
          </span>
          <input
            className="hero-search-input u-font-md"
            placeholder={t("Eg. Ciudad de Mexico, Monterrey")}
            value={userQuery}
            onChange={this.onChange.bind(this)}
            onFocus={this.openSearch.bind(this)}
            ref={input => this.textInput = input}
            key="si"
          />
          <Icon className="hero-search-icon" icon="search" />

          {/* search "button" */}
          <a
            className="hero-search-link u-font-sm"
            href={`/${locale}/explore${userQuery ? `?q=${ encodeChars(userQuery.toString()) }` : ""}`}
          >
            {t("Search")}
          </a>
        </label>

        {/* list of search results */}
        {searchActive && userQuery.length >= minQueryLength && results &&
          <ul className="hero-search-results u-font-xs">
            {results.map(result =>
              <SearchResult
                key={`search-result-${result.id}`}
                id={result.id}
                slug={result.profile}
                title={result.name}
                level={t(result.hierarchy)}
              />
            )}
            {results.length === 0 &&
              <li className="search-result">
                <p className="search-result-link">{t("No results found")}</p>
              </li>
            }
          </ul>
        }
      </span>
    );
  }
}

HeroSearch.defaultProps = {
  limit: 20,
  minQueryLength: 1,
  locale: "es"
};

export default withNamespaces()(hot(HeroSearch));
