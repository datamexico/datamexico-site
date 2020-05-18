import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";

import Tile from "./Tile";
import "./ExploreProfile.css";

class ExploreProfile extends React.Component {
  render() {
    const {background, filterPanel, lng, results, title, t} = this.props;

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
      {filterPanel &&
        <h3 className="ep-profile-title">{t(title)}</h3>
      }
      <div className="ep-profile-results">
        {results.map(d =>
          <Tile
            title={d.name}
            slug={d.slug}
            id={d.id}
            level={t(d.level)}
            background={background}
            lng={lng}
            key={`${d.slug}-tile`}
          />
        )}
      </div>
    </div>;
  }
}

ExploreProfile.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreProfile);
