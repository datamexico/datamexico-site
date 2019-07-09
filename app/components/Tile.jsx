import React from "react";
import "./Tile.css";

class Tile extends React.Component {
  render() {
    const {link, slug, id, title} = this.props;

    return <a
      className="mex-tile"
      href={link || `/profile/${slug}/${id}`}
      style={{backgroundImage: `url(/images/${slug}/${id}.jpg)`}}
    >
      <span className="title">{title}</span>
    </a>;
  }
}

Tile.defaultProps = {
  link: undefined,
  title: ""
};

export default Tile;
