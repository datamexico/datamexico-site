import React from "react";
import {withNamespaces} from "react-i18next";

import "./ExploreHeader.css";

class ExploreHeader extends React.Component {
  render() {
    const {selected, slug, title} = this.props;
    const s = selected === slug;

    return (
      <button
        className={`ep-header ${s ? "is-active" : "is-inactive"}`}
        onClick={() => this.props.handleTabSelected(slug)}
      >
        <img className="ep-header-img" src={`/icons/explore/${slug}.png`} alt="" />
        <span className="ep-header-title heading u-font-md">{title}</span>
      </button>
    );
  }
}

ExploreHeader.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreHeader);
