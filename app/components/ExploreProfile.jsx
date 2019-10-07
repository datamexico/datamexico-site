import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";

import "./ExploreProfile.css";

class ExploreProfile extends React.Component {
  render() {
    const {background, lng, results, title} = this.props;

    return <div className="ep-profile">
      <h3 className="ep-profile-title" style={{backgroundColor: background}}>{title}</h3>
      <div className="ep-profile-results">
        {results.map((d, i) => <Link
          key={`${d.slug}_${i}`}
          className="ep-profile-result"
          to={`/${lng}/profile/${d.slug}/${d.id}`}
        >
          <span className="ep-profile-result-title" title={d.name}>{d.name}</span>
          <span className="ep-profile-result-level">{d.level}</span>
        </Link>)}
      </div>
    </div>;
  }
}

ExploreProfile.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreProfile);
