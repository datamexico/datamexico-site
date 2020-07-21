import React from "react";
import {withNamespaces} from "react-i18next";

import "./ExploreHeader.css";

class ExploreHeader extends React.Component {
  render() {
    const {selected, slug, title, t, handleTabSelected, len} = this.props;
    const s = selected === slug;

    return (
      <button
        className={`ep-header ${s ? "is-active" : "is-inactive"}`}
        onClick={() => handleTabSelected(slug)}
        key={`explore-header-btn-${slug}`}
      >
        <img className="ep-header-img" src={`/icons/explore/${slug}.png`} alt="" />
        <span className="ep-header-title heading u-font-md">{t(title)}<small>{len ? `${len}` : ''}</small></span>
      </button>
    );
  }
}

ExploreHeader.defaultProps = {};

export default withNamespaces()(ExploreHeader);
