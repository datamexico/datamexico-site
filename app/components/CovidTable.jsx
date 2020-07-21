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
    tableData: [],
    width: 0
  }

  componentDidMount = () => {
    const {data, date, locations} = this.props;
    const today = new Date(date.Time);
    const lastWeek = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 14).getTime();
    const dataFiltered = data.filter(d => new Date(d.Time).getTime() >= lastWeek);

    const tableData = locations.map(d => {
      const locationData = dataFiltered.filter(m => m["Location ID"] === d["Location ID"]);
      const aditionalData = locationData.reduce((acc, item) => {
        acc["Last 14 Daily Cases"] = (acc["Last 14 Daily Cases"] || 0) + item["Daily Cases"];
        acc["Last 14 Daily Deaths"] = (acc["Last 14 Daily Deaths"] || 0) + item["Daily Deaths"];
        acc["Last 14 Daily Hospitalized"] = (acc["Last 14 Daily Hospitalized"] || 0) + item["Daily Hospitalized"];
        acc["Last 14 Daily Suspect"] = (acc["Last 14 Daily Suspect"] || 0) + item["Daily Suspect"];
        return acc;
      }, {});
      aditionalData["Location"] = d["Location"];
      aditionalData["Location ID"] = d["Location ID"];
      aditionalData["Icon"] = d["Icon"];

      const dateData = locationData.find(m => m["Time ID"] === date["Time ID"]);
      return Object.assign({}, dateData, aditionalData);
    });

    this.setState({
      tableData,
      width: window.innerWidth
    });
  }

  render() {
    const {lng} = this.props;
    const {tableData, width} = this.state;

    const columns = width > 768 ? [
      {
        id: "Location",
        accessor: d => d["Location ID"],
        Cell: d => <div className="geo-wrapper">
          <div className="icon" style={{backgroundColor: colors.State[d.original["Location ID"]]}}>
            <img src={d.original.Icon} alt="" />
          </div>
          <a href={`/${lng}/profile/geo/${d.original["Location ID"]}`} className="title">{d.original.Location}</a>
        </div>,
        Header: "Entidad federativa"
      },
      {
        id: "Last 14 Daily Cases",
        accessor: d => d["Last 14 Daily Cases"],
        Cell: d => commas(d.original["Last 14 Daily Cases"]),
        Header: "Contagios confirmados 14 días"
      },
      {
        id: "Last 14 Daily Deaths",
        accessor: d => d["Last 14 Daily Deaths"],
        Cell: d => commas(d.original["Last 14 Daily Deaths"]),
        Header: "Fallecídos confirmados 14 días"
      },
      {
        id: "Accum Cases",
        accessor: d => d["Accum Cases"],
        Cell: d => commas(d.original["Accum Cases"]),
        Header: "Contagios totales confirmados"
      },
      {
        id: "Accum Deaths",
        accessor: d => d["Accum Deaths"],
        Cell: d => commas(d.original["Accum Deaths"]),
        Header: "Fallecidos totales confirmados"
      },
      {
        id: "Accum Suspect",
        accessor: d => d["Accum Suspect"],
        Cell: d => commas(d.original["Accum Suspect"]),
        Header: "Total test realizados"
      }
    ] : [
      {
        id: "Location",
        accessor: d => d["Location ID"],
        Cell: d => <div className="geo-wrapper">
          <div className="icon" style={{backgroundColor: colors.State[d.original["Location ID"]]}}>
            <img src={d.original.Icon} alt="" />
          </div>
          <a href={`/${lng}/profile/geo/${d.original["Location ID"]}`} className="title">{d.original.Location}</a>
        </div>,
        Header: "Entidad federativa"
      },
      {
        id: "Last 14 Daily Cases",
        accessor: d => d["Last 14 Daily Cases"],
        Cell: d => commas(d.original["Last 14 Daily Cases"]),
        Header: "Contagios confirmados 14 días"
      },
      {
        id: "Accum Cases",
        accessor: d => d["Accum Cases"],
        Cell: d => commas(d.original["Accum Cases"]),
        Header: "Contagios totales confirmados"
      }
    ];

    return <div className="covid-table container">
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
