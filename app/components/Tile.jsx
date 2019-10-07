import React from "react";
import {withNamespaces} from "react-i18next";
import "./Tile.css";

class Tile extends React.Component {
  render() {
    const {link, slug, id, lng, title} = this.props;
    return <a
      className="mex-tile"
      href={link || `/${lng}/profile/${slug}/${id}`}
      style={{backgroundImage: `url(/api/image?slug=${slug}&id=${id})`}}
    >
      <span className="title">{title}</span>
    </a>;
  }
}

Tile.defaultProps = {
  link: undefined,
  title: ""
};

export default withNamespaces()(Tile);
