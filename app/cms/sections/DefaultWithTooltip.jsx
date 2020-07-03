import React, {Component} from "react";
import {Viz} from "@datawheel/canon-cms";
import {Icon, Tooltip, Position} from "@blueprintjs/core";

import "./DefaultWithTooltip.css";

export default class Default extends Component {
  render() {
    const {contents, slug, heading, hideOptions, title, loading, filters, resetButton, stats, sources, visualizations, vizHeadingLevel} = this.props;
    let {paragraphs} = this.props;
    const tooltip = contents.descriptions[0].description;
    // Removes first element of paragraphs

    if (paragraphs && Array.isArray(paragraphs)) paragraphs = paragraphs.slice(1);

    return (
      <div
        className={`cp-section-inner cp-default-section-inner cp-${slug}-section-inner ${loading ? "is-loading" : ""}`}
        ref={comp => this.section = comp}
      >
        {/* sidebar */}
        <div className="cp-section-content cp-default-section-caption">
          <Tooltip
            content={<div dangerouslySetInnerHTML={{__html: tooltip}} />}
            position={Position.RIGHT_TOP}
            usePortal={false}
          >
            <div className="heading-title-tooltip">{heading} <Icon icon="info-sign" /></div>
          </Tooltip>
          {filters}
          {stats}
          {paragraphs}
          {sources}
          {resetButton}
        </div>

        {/* caption */}
        {visualizations.length
          ? <div className={`cp-default-section-figure${
            visualizations.length > 1 ? " cp-multicolumn-default-section-figure" : ""
            }${
            visualizations.filter(viz => viz.logic_simple && viz.logic_simple.type === "Graphic").length ? " cp-graphic-viz-grid" : ""
            }`}>
            {visualizations.map((visualization, ii) =>
              <Viz
                section={this}
                config={visualization}
                headingLevel={vizHeadingLevel}
                sectionTitle={title}
                slug={slug}
                hideOptions={hideOptions}
                key={ii}
              />
            )}
          </div> : ""
        }
      </div>
    );
  }
}
