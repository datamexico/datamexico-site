import React from "react";
import axios from "axios";
import {nest} from "d3-collection";
import ReactTable from "react-table";
import {hot} from "react-hot-loader/root";
import {withNamespaces} from "react-i18next";
import {Sparklines, SparklinesLine, SparklinesSpots} from "react-sparklines";
import colors from "../../static/data/colors.json";
import {commas} from "helpers/utils";
import {mean} from "d3-array";
import {formatAbbreviate} from "d3plus-format";

import "./CovidTable.css";

class CovidTable extends React.Component {
  state = {
    tableData: []
  }

  componentDidMount = () => {
    const {data, dates, locations} = this.props;
    console.log(this.props);

    const today = new Date(dates[0].Time);
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14).getTime();
    const dataFiltered = data.filter(d => new Date(d.Time).getTime() >= lastWeek);
    const nestedData = nest()
      .key(d => d["Location ID"])
      .entries(dataFiltered)

    const tableData = nestedData.map(d => {
      const {values} = d;
      const trend = values.map(h => h["AVG 7 Days Daily Cases"]);
      const diff = trend.reduce((all, d, i) => {
        if (i > 0) {
          const delta = 1 - trend[i - 1] / d;
          all.push(delta);
        };
        return all;
      }, []);
      values.sort((a, b) => b["Time ID"] - a["Time ID"]);
      const latest = values[0];
      const location = locations.find(h => h["Location ID"] === latest["Location ID"])
      const item = Object.assign({}, latest, {"Trend": trend, "Growth": mean(diff)}, location)
      return item;
    });

    this.setState({tableData});
  }

  render() {
    const {lng} = this.props;
    const {tableData} = this.state;
    console.log(tableData);

    return <div className="container">
      <div className="columns">
        <div className="column">
          <table className="covid19-table">
            <thead>
              <tr>
                <th>Entidad federativa</th>
                <th>Tendencia de nuevos casos 14 días</th>
                <th>Contagios 7 días</th>
                <th>Fallecidos 7 días</th>
                <th>Total contagios</th>
                <th>Total fallecidos</th>
              </tr>
            </thead>
            <tbody>
              {tableData.map(d => {
                const color = d.Growth > 0.1
                  ? "#A70512"
                  : d.Growth < -0.1 ? "#008874" : "gray";
                return <tr>
                  <td>
                    <div className="geo-wrapper">
                      <div className="icon" style={{backgroundColor: colors.State[d["Location ID"]]}}>
                        <img src={d.Icon} alt="" />
                      </div>
                      <a href={`/${lng}/profile/geo/${d["Location ID"]}`} className="title">{d.Location}</a>
                    </div>
                  </td>
                  <td style={{width: 200, height: 50}}>
                    <div className="trend-wrapper">
                      <Sparklines data={d.Trend}>
                        <SparklinesLine color={color} style={{fill: "none", strokeWidth: 3}} />
                      </Sparklines>
                      <span style={{color}} className="trend-value">{formatAbbreviate(d.Growth * 100)}%</span>
                    </div>
                  </td>
                  <td>
                    {commas(d["Last 7 Daily Cases"])}
                  </td>
                  <td>
                    {commas(d["Last 7 Daily Deaths"])}
                  </td>
                  <td>
                    {commas(d["Accum Cases"])}
                  </td>
                  <td>
                    {commas(d["Accum Deaths"])}
                  </td>
                </tr>
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  }
}

export default withNamespaces()(hot(CovidTable));
