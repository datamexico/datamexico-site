import React, {Component} from 'react'

import "./CovidCard.css";

export class CovidCard extends Component {
  render() {
    return (
      <div className="covid-card columns">
        <div className="covid-card-header column">
          Card Header
        </div>
        <div className="covid-card-body columns column">
          <div className="card-body-options column">
            Card Body Options
          </div>
          <div className="card-body-visualization column">
            Card Body Visualization
          </div>
        </div>
        <div className="covid-card-footer column">
          Card Footer
        </div>
      </div>
    )
  }
}

export default CovidCard
