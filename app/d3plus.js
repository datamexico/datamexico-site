import {mean} from "d3-array";
import {formatAbbreviate} from "d3plus-format";
import colors from "../static/data/colors.json";
import styles from "style.yml";

const typeface = "'Barlow', sans-serif";
const defaultFontColor = styles["dark-1"];
const headingFontColor = styles["dark-3"];
const fontSizeSm = 12;
const fontSizeMd = 14;
const fontSizeLg = 16;
const labelPadding = 5;

const bad = styles["viz-negative"];
const good = styles["viz-positive"];

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
  const keys = ["Area", "Category", "Chapter", "Flow", "Generic Investment", "Continent", "Sector", "Sex"];
  for (const key of keys) {
    if (`${key} ID` in d || key in d) return `/icons/visualizations/${key}/png/white/${d[`${key} ID`]}.png`;
  }
  return undefined;
}

/** default x/y axis styles */
const axisConfig = {
  // main bar lines
  barConfig: {
    "stroke": defaultFontColor,
    "stroke-width": 1
  },
  // secondary grid lines
  gridConfig: {
    "stroke": styles["light-1"],
    "stroke-width": 1,
    "opacity": 0.5
  },
  locale: "es-MX",
  // axis title labels
  titleConfig: {
    fontFamily: () => typeface,
    fontColor: headingFontColor
  },
  // value labels
  shapeConfig: {
    labelConfig: {
      labelRotation: false,
      fontColor: headingFontColor,
      fontFamily: () => typeface,
      fontSize: () => fontSizeMd
    }
  },
  // death to ticks
  tickSize: 0
};


/**
  The object exported by this file will be used as a base config for any
  d3plus-react visualization rendered on the page.
*/
export default {
  // global defaults
  aggs: {
    "Area ID": mean,
    "Category ID": mean,
    "Chapter ID": mean,
    "Generic Investment ID": mean,
    "Flow ID": mean,
    "Sector ID": mean,
    "Sex ID": mean,
    "Year": mean
  },
  locale: "es-MX",
  xConfig: axisConfig,
  yConfig: axisConfig,
  barPadding: 0,
  groupPadding: 10,

  // legends
  legendConfig: {
    shapeConfig: {
      fill: d => findColor(d),
      backgroundImage: d => findIcon(d),
      width: fontSizeSm,
      height: fontSizeSm
    },
    labelConfig: {
      fontColor: defaultFontColor,
      fontFamily: () => typeface
    },
    stroke: "transparent"
  },

  // color scale
  colorScaleConfig: {
    axisConfig: {
      labelOffset: true,
      labelRotation: false,
      locale: "es-MX",
      shapeConfig: {
        height: 30,
        labelConfig: {
          fontColor: defaultFontColor,
          fontFamily: () => typeface
        }
      },
      titleConfig: {
        fontFamily: () => typeface,
        fontColor: headingFontColor
      },
      // death to ticks
      tickSize: 0,
      tickFormat: d => formatAbbreviate(d),
      barConfig: {
        stroke: "transparent"
      }
    },
    color: [
      styles["accent-light"],
      styles.accent,
      "#6DD0CE",
      "#56B0AE",
      styles["viz-positive"]
    ],
    legendConfig: {
      shapeConfig: {
        height: fontSizeLg,
        width: fontSizeLg,
        stroke: "transparent"
      }
    },
    rectConfig: {
      stroke: "transparent"
    }
  },

  // geomaps
  ocean: "transparent",
  tiles: false,
  pointSizeMin: 1,
  pointSizeMax: 7,
  zoomScroll: false,

  // various visualizations
  shapeConfig: {
    // labels
    fontFamily: () => typeface,
    labelConfig: {
      volot: defaultFontColor,
      fontFamily: () => typeface,
      fontMax: fontSizeMd,
      padding: 10
    },
    // stacked area
    Area: {
      labelConfig: {
        fontColor: styles.white,
        fontFamily: () => typeface,
        fontMax: fontSizeLg
      },
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
    // line charts
    Line: {
      curve: "monotoneX",
      stroke: findColor,
      strokeWidth: 3,
      strokeLinecap: "round"
    },
    // scatter plots
    Circle: {
      fill: d => {
        if (d["Trade Value RCA"]) {
          return d["Trade Value RCA"] > 1 ? findColor(d) : "#b1bac6";
        }
        return "#b1bac6";
      },
      stroke: "#b1bac6"
    },
    fill: findColor,
    // tree maps
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
        fontFamily: () => typeface,
        fontMax: fontSizeLg,
        fontMin: fontSizeSm,
        padding: 0
      }
    }
  },

  // timelines
  timelineConfig: {
    // handle
    handleConfig: {
      width: 9,
      fill: styles["accent-dark"]
    },
    tickFormat: d => {
      console.log(d);
      d = d.toString().includes("Q") ? d.toString().replace("Q", "0") : d;
      const latest = new Date(d);
      const id = latest.getFullYear();
      const month = latest.getUTCMonth() + 1;
      const day = latest.getDate();

      const tickString = id.toString();
      const len = tickString.length;

      let label = "";

      if (month === 1 && id < 20000) {
        label = id;
      }

      else if (len === 5) {
        // ${tickString.slice(0, 4)}-
        const quarter = tickString.slice(4, 5);
        label = quarter === "1" ? `${tickString.slice(0, 4)}` : `Q${quarter}`;
        // ${quarter}${tickString.slice(0, 4)}
      }
      else if (len === 6) {
        label = `${tickString.slice(0, 4)}/${tickString.slice(4, 6)}/01`;
      }
      else {
        label = latest;
      }
      return label;
    },
    // button stuff
    brushing: false,
    buttonBehavior: "buttons",
    buttonHeight: 20,
    buttonWidth: 200,
    buttonPadding: 5,
    // selected range
    selectionConfig: {
      "height": 8,
      "fill": styles["accent-dark"],
      "fill-opacity": 0.25,
      "transform": "translate(0, 2)"
    },
    // main horizontal bar line
    barConfig: {
      stroke: styles["light-3"],
      opacity: 0.5
    },
    shapeConfig: {
      // ticks and/or button bg
      fill: styles["light-3"],
      stroke: "none",
      // label and/or button text
      labelConfig: {
        fontColor(d) {
          const n = parseInt(d.text, 10);
          return defaultFontColor;
        },
        fontFamily: () => typeface,
        fontSize: () => fontSizeSm,
        lineHeight: () => fontSizeLg,
        padding: 0
      }
    },
    labelRotation: false,
    padding: 0
  },

  // tooltips
  tooltipConfig: {
    background: styles.white,
    border: `1px solid ${defaultFontColor}`,
    footerStyle: {
      "color": headingFontColor,
      "fontFamily": () => typeface,
      "font-size": fontSizeSm,
      "padding-top": "5px",
      "text-align": "center"
    },
    padding: "10px",
    titleStyle: {
      "color": headingFontColor,
      "padding": "5px 10px",
      "fontFamily": () => typeface,
      "font-size": fontSizeLg,
      "max-height": "100px",
      "overflow": "hidden",
      "text-overflow": "ellipsis",
      "display": "-webkit-box",
      "-webkit-box-orient": "vertical",
      "-webkit-line-clamp": "3"
    },
    minWidth: "200px"
  },
  totalConfig: {
    locale: "es-MX",
    fontSize: () => fontSizeMd
  }
};
