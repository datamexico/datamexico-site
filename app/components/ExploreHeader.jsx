import React from "react";
import {Link} from "react-router";
import {withNamespaces} from "react-i18next";

import "./ExploreHeader.css";

class ExploreHeader extends React.Component {
  render() {
    const {selected, slug, title} = this.props;
    const s = selected === slug;

    return <div className="ep-header" onClick={() => this.props.handleTabSelected(slug)}>
      <img src={`/icons/explore/${s ? "selected" : "inactive"}/${slug}.png`} alt=""/>
      <h3 className="ep-header-title"><span className={s ? "selected" : ""}>{title}</span></h3>
    </div>;
  }
}

ExploreHeader.defaultProps = {
  results: []
};

export default withNamespaces()(ExploreHeader);
