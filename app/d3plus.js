import {mean} from "d3-array";
import {formatAbbreviate} from "d3plus-format";
import colors from "../static/data/colors.json";
import styles from "style.yml";

const typeface = "'Fira Sans Extra Condensed', sans-serif";
const defaultFontColor = styles["dark-1"];
const headingFontColor = styles["dark-3"];
const fontSizeSm = 12;
const fontSizeMd = 14;
const fontSizeLg = 16;
const labelPadding = 5;
const shapeLegend = 25;

const growthPct = d => `${formatAbbreviate(d * 100)}%`;
const pesoMX = d => `$ ${formatAbbreviate(d * 100)} MX`;
// const locale = window.__INITIAL_STATE__.i18n.locale;

/** */
export const findColorV2 = (key, d) => {
  if (key === "Country" || key === "ISO 3") {
    if (!Array.isArray(d["Country ID"])) return "transparent";
    else return colors.Continent[d["Continent ID"]];
  }
  const id = key === "SITC Section" ? d["Section ID"] : d[`${key} ID`];
  const palette = colors[key];
  return palette ? colors[key][id] || colors[key][d[key]] || styles["gmx-green-1"] : styles["gmx-green-1"];
};

export const tooltipTitle = (bgColor, imgUrl, title) => {
  let tooltip = "<div class='d3plus-tooltip-title-wrapper'>";
  if (imgUrl) {
    tooltip += `<div class="icon" style="background-color: ${bgColor}"><img src="${imgUrl}" /></div>`;
  }
  tooltip += `<div class="title"><span>${title}</span></div>`;
  tooltip += "</div>";
  return tooltip;
};

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

export const findIconV2 = (key, d) => {
  // const options = {2: "export", 1: "import"};
  if (key === "Country" || key === "ISO 3") {
    return `/icons/visualizations/Country/country_${d[`${key} ID`]}.png`;
  }
  const icon = key.replace(" 4 Digit", "");
  return `/icons/visualizations/${icon}/png/white/${d[`${key} ID`]}.png`;
};

/** */
function findIcon(d) {
  const keys = [
    "Area",
    "Category",
    "Chapter",
    "Chapter 2 Digit",
    "Chapter 4 Digit",
    "Flow",
    "Generic Investment",
    "Continent",
    "Sector",
    "Sex"
  ];

  for (const key of keys) {
    if (`${key} ID` in d || key in d) {
      const icon = key.replace(" 4 Digit", "");
      return `/icons/visualizations/${icon}/png/white/${d[`${key} ID`]}.png`;
    }

  }
  return undefined;
}

/** default x/y axis styles */
const axisConfig = {
  // main bar lines
  barConfig: {
    stroke: "transparent"
  },
  // secondary grid lines
  gridConfig: {
    stroke: "#cccccc",
    strokeWidth: 1
    // opacity: 0.5
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
    "Chapter 2 Digit ID": mean,
    "Chapter 4 Digit ID": mean,
    "Generic Investment ID": mean,
    "Flow ID": mean,
    "Sex ID": mean,
    "State ID": mean,
    "Year": mean
  },
  locale: "es-MX",
  xConfig: axisConfig,
  yConfig: {...axisConfig, scale: "auto"},
  y2Config: {...axisConfig, scale: "auto"},
  barPadding: 0,
  groupPadding: 10,

  // legends
  legendConfig: {
    label: "",
    shapeConfig: {
      fill: d => findColor(d),
      backgroundImage: d => findIcon(d),
      width: shapeLegend,
      height: shapeLegend
    },
    labelConfig: {
      fontColor: defaultFontColor,
      fontFamily: () => typeface
    },
    stroke: "transparent"
  },

  // color scale
  colorScaleConfig: {
    scale: "quantile",
    axisConfig: {
      labelOffset: true,
      labelRotation: false,
      locale: "es-MX",
      shapeConfig: {
        height: 50,
        labelConfig: {
          fontSize: () => fontSizeLg,
          fontColor: headingFontColor,
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
      },
      rectConfig: {
        stroke: "transparent"
      }
    },
    color: [
      "#84F0EE",
      "#4FBEBC",
      "#008E8D",
      "#006160",
      "#005253"
    ],
    legendConfig: {
      shapeConfig: {
        height: shapeLegend,
        width: shapeLegend,
        stroke: "transparent"
      }
    },
    rectConfig: {
      rx: 0,
      ry: 0,
      borderRadius: 0,
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
      fontFamily: () => typeface,
      fontMax: 32,
      padding: 10
    },
    // stacked area
    Area: {
      labelConfig: {
        fontColor: styles.white,
        fontFamily: () => typeface
        // fontMax: fontSizeLg,
        // fontMin: fontSizeSm
      },
      strokeWidth: d => {
        const c = findColor(d);
        return [good, bad].includes(c) ? 1 : 0;
      }
    },
    Bar: {
      labelConfig: {
        fontSize: () => 16,
        fontFamily: () => typeface
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
      stroke: "#aaaaaa",
      strokeWidth: 1
    },
    fill(d) {
      if (this && this._groupBy) {
        const parentName = this._groupBy[0](d);
        if (parentName) {
          let parent = Object.entries(d).find(h => h[1] === parentName) || [undefined];
          let parentId = parent[0];
          if (parentId.includes(" ID")) {
            parentId = parentId.slice(0, -3);
            parent = Object.entries(d).find(h => h[0] === parentId) || [undefined];
          }

          const bgColor = findColorV2(parentId, d);
          return bgColor;
        }
        else return "green";
      }
      else {
        return findColor(d) || "green";
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
    footerStyle: {
      "color": headingFontColor,
      "fontFamily": () => typeface,
      "font-size": fontSizeSm,
      "padding-top": "5px",
      "text-align": "center"
    },
    title(d) {
      const len = this._groupBy.length;
      const parentName = this._groupBy[0](d);
      let parent = Object.entries(d).find(h => h[1] === parentName) || [undefined];
      let parentId = parent[0];
      if (parentId.includes(" ID")) {
        parentId = parentId.slice(0, -3);
        parent = Object.entries(d).find(h => h[0] === parentId) || [undefined];
      }
      const itemName = this._groupBy[len - 1](d);
      let item = Object.entries(d).find(h => h[1] === itemName) || [undefined];
      let itemId = item[0];
      if (itemId.includes(" ID")) {
        itemId = itemId.slice(0, -3);
        item = Object.entries(d).find(h => h[0] === itemId) || [undefined];
      }
      if (itemId === "ISO 3") {
        itemId = "Country";
        item = Object.entries(d).find(h => h[0] === itemId) || [undefined];
      }
      if (itemId === "id") {
        itemId = "HS4";
        item = Object.entries(d).find(h => h[0] === itemId) || [undefined];
      }

      const title = Array.isArray(item[1]) ? `Other ${parent[1] || "Values"}` : item[1];
      const itemBgImg = ["Country", "Organization"].includes(itemId) ? itemId : parentId;
      const bgColor = findColorV2(itemBgImg, d);
      const imgUrl = findIconV2(itemBgImg, d);
      return tooltipTitle(bgColor, imgUrl, title);
    },
    tbody(d) {
      const output = [];
      if (d.Quarter) {
        output.push(["Quarter", d.Quarter]);
      }
      if (d.Workforce) {
        output.push(["Workforce", formatAbbreviate(d.Workforce)]);
      }
      if (d["Workforce Growth"]) {
        output.push(["Workforce Growth", growthPct(d["Workforce Growth"])]);
      }
      if (d["Workforce Growth Value"]) {
        output.push(["Workforce Growth Value", formatAbbreviate(d["Workforce Growth Value"])]);
      }
      if (d.Wage) output.push(["Wage", pesoMX(d.Wage * 1)]);
      if (d["Wage Growth"]) output.push(["Wage Growth", growthPct(d["Wage Growth"])]);
      if (d["Wage Growth Value"]) output.push(["Wage Growth Value", pesoMX(d["Wage Growth Value"] * 1)]);

      if (d.Students) output.push(["Students", d.Students]);
      return output;
    }
  },
  totalConfig: {
    locale: "es-MX",
    fontSize: () => fontSizeMd
  }
};
