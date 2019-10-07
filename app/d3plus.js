import {mean} from "d3-array";
import {formatAbbreviate} from "d3plus-format";
import colors from "../static/data/colors.json";

const bad = "#cf5555";
const good = "#3182bd";

/**
  The object exported by this file will be used as a base config for any
  d3plus-react visualization rendered on the page.
*/

const badMeasures = [];
export {badMeasures};

/**
 * Finds a color if defined in the color lookup.
 * @param {Object} d
 */
function findColor(d) {
  let detectedColors = [];
  if (this && this._filteredData) {
    detectedColors = Array.from(new Set(this._filteredData.map(findColor)));
  }
  if (detectedColors.length !== 1) {
    for (const key in colors) {
      if (`${key} ID` in d || key in d) {
        return colors[key][d[`${key} ID`]] || colors[key][d[key]] || colors.colorGrey;
      }
    }
  }
  return Object.keys(d).some(v => badMeasures.includes(v)) ? bad : good;
}

/** */
function findIcon(d) {
  const keys = ["Chapter", "Flow", "Continent", "Sector"];
  for (const key of keys) {
    if (`${key} ID` in d || key in d) return `/icons/visualizations/${key}/png/white/${d[`${key} ID`]}.png`;
  }
  return undefined;
}

const axisStyles = {
  barConfig: {
    stroke: "transparent"
  },
  gridConfig: {
    stroke: "#ccc"
  },
  locale: "es-MX",
  shapeConfig: {
    labelConfig: {
      fontColor: () => "#211f1a",
      // fontFamily: () => "Source Sans Pro",
      fontSize: () => 12,
      fontWeight: () => 400
    },
    stroke: "#ccc"
  },
  tickSize: 5,
  titleConfig: {
    fontColor: () => "#211f1a",
    // fontFamily: () => "Palanquin",
    fontSize: () => 12,
    fontWeight: () => 400
  }
};

const labelPadding = 5;

export default {
  aggs: {
    "Category ID": mean,
    "Chapter ID": mean,
    // "Continent ID": mean,
    "Flow ID": mean,
    "Sector ID": mean,
    "Sex ID": mean,
    "Year": mean
  },
  xConfig: axisStyles,
  yConfig: axisStyles,
  locale: "es-MX",
  // backgroundConfig: {
  //   fill: "#eaeaf2"
  // },
  barPadding: 0,
  groupPadding: 10,

  legendConfig: {
    label: "",
    shapeConfig: {
      fill: d => findColor(d),
      backgroundImage: d => findIcon(d),
      height: () => 20,
      width: () => 20
    }
  },

  colorScaleConfig: {
    axisConfig: {
      labelOffset: true,
      labelRotation: false,
      locale: "es-MX",
      shapeConfig: {
        labelConfig: {
          fontColor: () => "#211f1a",
          fontSize: () => 12,
          fontWeight: () => 400
        }
      },
      titleConfig: {
        fontColor: () => "#211f1a",
        fontSize: () => 12,
        fontWeight: () => 400
      },
      tickFormat: d => formatAbbreviate(d)
    },
    color: ["#A7D079", "#82B769", "#609E59", "#49854F", "#3A6B49"],
    legendConfig: {
      shapeConfig: {
        labelConfig: {
          fontSize: () => 12
        },
        height: () => 15,
        stroke: "transparent",
        width: () => 15
      }
    },
    scale: "jenks"
  },
  ocean: "transparent",
  tiles: false,

  shapeConfig: {
    Area: {
      strokeWidth: d => {
        const c = findColor(d);
        return [good, bad].includes(c) ? 1 : 0;
      }
    },
    Bar: {
      labelConfig: {
        fontSize: () => 13
      },
      textAlign: "left",
      stroke: "transparent",
      strokeWidth: d => {
        const c = findColor(d);
        return [good, bad].includes(c) ? 1 : 0;
      }
    },
    fill: findColor,
    labelConfig: {
      fontSize: () => 13
    },
    Line: {
      curve: "monotoneX",
      stroke: findColor,
      strokeWidth: 3,
      strokeLinecap: "round"
    },
    Path: {
      // fillOpacity: 0.75,
      // strokeOpacity: 0.25
    },
    Rect: {
      labelBounds: (d, i, s) => {
        const h = s.height;
        const sh = Math.min(17, h * 0.5);
        const arr = [
          {width: s.width - labelPadding * 2, height: h - sh, x: -s.width / 2 + labelPadding, y: -h / 2 + labelPadding},
          {width: s.width - labelPadding * 2, height: sh, x: -s.width / 2 + labelPadding, y: h / 2 - sh}
        ];
        return arr;
      },
      labelConfig: {
        // fontFamily: () => pathway,
        fontSize: () => 13,
        fontResize: true,
        padding: 0
      }
    }
  },
  timelineConfig: {
    brushing: false,
    tickFormat: d => {
      d = d.toString().includes("Q") ? d.toString().replace("Q", "0") : d;
      const latest = new Date(d);
      const id = latest.getFullYear();
      const tickString = id.toString();
      const len = tickString.length;

      let label = "";

      if (len === 5) {
        // ${tickString.slice(0, 4)}-
        const quarter = tickString.slice(4, 5);
        label = quarter === "1" ? tickString.slice(0, 4) : `Q${quarter}`;
      }
      else if (len === 6) {
        label = `${tickString.slice(0, 4)}/${tickString.slice(4, 6)}/01`;
      }
      else {
        label = latest;
      }
      return label;
    },
    buttonBehavior: "ticks",
    buttonHeight: 20,
    buttonPadding: 5,
    labelRotation: false,
    padding: 0,
    selectionConfig: {
      "fill": "#888",
      "fill-opacity": 0.25,
      "transform": "translate(0, 2)"
    },
    shapeConfig: {
      fill: "transparent",
      labelConfig: {
        fontColor(d) {
          const n = parseInt(d.text, 10);
          return "#888";
        },
        // fontFamily: () => "Source Sans Pro",
        fontSize: () => 12,
        fontWeight: () => 700,
        lineHeight: () => 16,
        padding: 0
      },
      stroke: "transparent",
      strokeWidth: 0
    }
  },
  tooltipConfig: {
    background: "#edefed",
    border: "1px solid #787e83",
    footerStyle: {
      "color": "#666",
      "fontFamily": () => "'Chivo', sans-serif",
      "font-size": "12px",
      "font-weight": "300",
      "padding-top": "5px",
      "text-align": "center"
    },
    padding: "10px",
    titleStyle: {
      "color": "#3F908E",
      "padding": "5px 10px",
      "fontFamily": () => "'Chivo', sans-serif",
      "font-size": "16px",
      "font-weight": "600",
      "max-height": "100px",
      "overflow": "hidden",
      "text-overflow": "ellipsis",
      "display": "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": "3"
    },
    width: "200px"
  },
  totalConfig: {
    fontSize: () => 14
  }
};
