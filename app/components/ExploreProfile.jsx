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
        {results.map((d, i) => <Link
          key={`${d.slug}_${i}`}
          className={`ep-profile-result ${filterPanel ? "filter-panel" : "full-panel"}`}
          to={`/${lng}/profile/${d.slug}/${d.id}`}
          style={{backgroundImage: `url(/api/image?slug=${d.slug}&id=${d.id})`}}
        >
          <div className="ep-profile-result-icon" style={{backgroundColor: background}}>
            <img src={`/icons/explore/white/${d.slug}.png`} alt=""/>
          </div>
          <div className="ep-profile-result-content">
            <span className="ep-profile-result-title" title={d.name}>{d.name}</span>
            <span className="ep-profile-result-level">{d.level}</span>
          </div>
        </Link>)}
      </div>
    </div>;
  }
}

ExploreProfile.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreProfile);
