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
    const {data, date, locations} = this.props;
    const today = new Date(date.Time);
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

    const columns = [
      {
        id: "Location",
        accessor: d => d["Location ID"],
        Cell: d => <div className="geo-wrapper">
          <div className="icon" style={{backgroundColor: colors.State[d.original["Location ID"]]}}>
            <img src={d.original.Icon} alt="" />
          </div>
          <a href={`/${lng}/profile/geo/${d.original["Location ID"]}`} className="title">{d.original.Location}</a>
        </div>,
        Header: "Entidad federativa",
        width: 200
      },
      {
        id: "Last 7 Daily Cases",
        accessor: d => d["Last 7 Daily Cases"],
        Cell: d => commas(d.original["Last 7 Daily Cases"]),
        Header: "Total contagios 7 días"
      },
      {
        id: "Last 7 Daily Deaths",
        accessor: d => d["Last 7 Daily Deaths"],
        Cell: d => commas(d.original["Last 7 Daily Deaths"]),
        Header: "Total fallecidos 7 días"
      },
      {
        id: "Accum Cases",
        accessor: d => d["Accum Cases"],
        Cell: d => commas(d.original["Accum Cases"]),
        Header: "Total contagios"
      },
      {
        id: "Accum Deaths",
        accessor: d => d["Accum Deaths"],
        Cell: d => commas(d.original["Accum Deaths"]),
        Header: "Total fallecidos"
      }
    ]

    return <div className="container">
      <div className="columns">
        <div className="column">
          {tableData.length && <ReactTable
            className="covid19-table"
            columns={columns}
            data={tableData}
            minRows={tableData.length}
            pageSize={tableData.length}
            showPagination={false}
            defaultPageSize={tableData.length}
          />}
          {/* <table className="covid19-table">
            <thead>
              <tr>
                <th>Entidad federativa</th>
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
                    {commas(d[""])}
                  </td>
                  <td>
                    {commas(d["Accum "])}
                  </td>
                </tr>
              })}
            </tbody>
          </table> */}
        </div>
      </div>
    </div>
  }
}

export default withNamespaces()(hot(CovidTable));
