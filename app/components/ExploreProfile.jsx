import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";

import Tile from "./Tile";
import "./ExploreProfile.css";

class ExploreProfile extends React.Component {
  render() {
    const {background, filterPanel, lng, results, title, t, loading} = this.props;

    return <div className="ep-profile">

        {results && results.length === 0 && !filterPanel &&
          <div className="ep-profile-no-results">
            <img className="icon" src="/icons/no-results.png" alt=""/>
            <p className="message">
              {!loading ? t("Explore Profile.No data available") : t("CMS.Options.Loading Data")}
            </p>
          </div>
        }

        {results && results.length > 0 &&
          <>
            <div className="ep-profile-results">
              {results.map(d =>
                <Tile
                  title={d.name}
                  slug={d.slug}
                  id={d.id}
                  level={t(d.level)}
                  background={background}
                  lng={lng}
                  key={`${d.slug}-tile-${d.id}`}
                />
              )}
            </div>
            {results.length === 100 && <p className="message">{t("Explore Profile.MaxResults")}</p>}
          </>
        }
    </div>;
  }
}

ExploreProfile.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreProfile);
