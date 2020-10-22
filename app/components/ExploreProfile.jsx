import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";

import TileV2 from "./TileV2";
import "./ExploreProfile.css";

class ExploreProfile extends React.Component {
  render() {
    const {filterPanel, lng, results, t, loading} = this.props;

    return <div className="ep-profile">

        {results && results.length === 0 && !filterPanel &&
          <div className="ep-profile-no-results">
            <img className="icon" src="/icons/no-results.png" alt=""/>
            <p className="message">
              {!loading ? t("Explore.No data available") : t("CMS.Options.Loading Data")}
            </p>
          </div>
        }

        {results && results.length > 0 &&
          <>
            <ul className="ep-profile-results">
              {results.map((d,ix) =>
                <TileV2
                  title={d.name}
                  slug={d.slug}
                  slugColor={d.background}
                  id={d.id}
                  ix={ix}
                  level={t(d.level)}
                  background={d.background}
                  lng={lng}
                  key={`explore-${d.slug}-tile-${d.id}-${ix}`}
                  layout="cols"
                />
              )}
            </ul>
            {results.length > 99 && <p className="message">{t("Explore.MaxResults")}</p>}
          </>
        }
    </div>;
  }
}

ExploreProfile.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreProfile);
