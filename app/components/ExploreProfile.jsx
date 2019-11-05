import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";

import "./ExploreProfile.css";

class ExploreProfile extends React.Component {
  render() {
    const {background, filterPanel, lng, results, title} = this.props;

    if (results && results.length === 0 && !filterPanel) {
      return <div className="ep-profile">
        <div className="ep-profile-no-results">
          <img className="icon" src="/icons/no-results.png" alt=""/>
          <p className="message">
            {"Sorry, there are no results for this search. Try with another search param."}
          </p>
        </div>
      </div>
      ;
    }

    return <div className="ep-profile">
      {filterPanel && <h3 className="ep-profile-title">{title}</h3>}
      <div className="ep-profile-results">
        {results.map((d, i) =>
          <li
            className={`ep-profile-result ${filterPanel ? "filter-panel" : "full-panel"}`}
            style={{backgroundImage: `url(/api/image?slug=${d.slug}&id=${d.id})`}}
            key={`${d.slug}_${i}`}
          >
            <Link className="ep-profile-result-content" to={`/${lng}/profile/${d.slug}/${d.id}`}>
              <span className={`ep-profile-result-title heading ${
                d.name.length > 25 || d.name.match(/\w+/).toString().length > 20
                  ? "u-font-xs"
                  : "u-font-sm"
              }`} title={d.name}>
                {d.name}
              </span>
              <div className="ep-profile-result-icon" style={{backgroundColor: background}}>
                <img className="ep-profile-result-icon-img" src={`/icons/explore/${d.slug}-white.png`} alt=""/>
                <span className="ep-profile-result-icon-level display u-font-xxs">{d.level}</span>
              </div>
            </Link>
          </li>
        )}
      </div>
    </div>;
  }
}

ExploreProfile.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreProfile);
