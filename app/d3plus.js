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
      if (`${key} ID` in d) {
        return colors[key][d[`${key} ID`]] || colors[key][d[key]] || colors.colorGrey;
      }
    }
  }
  return Object.keys(d).some(v => badMeasures.includes(v)) ? bad : good;
}

const axisStyles = {
  barConfig: {
    stroke: "transparent"
  },
  gridConfig: {
    stroke: "#ffffff"
  },
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
  xConfig: axisStyles,
  yConfig: axisStyles,
  backgroundConfig: {
    fill: "#eaeaf2"
  },
  barPadding: 0,

  legendConfig: {
    label: "",
    shapeConfig: {
      height: () => 20,
      width: () => 20
    }
  },

  colorScaleConfig: {
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
      const tickString = d.toString();
      const len = tickString.length;
      let label = "";
      if (len === 5) {
        label = `${tickString.slice(0, 4)}/01`;
      }
      else if (len === 6) {
        label = `${tickString.slice(0, 4)}/${tickString.slice(5, 6)}/01`;
      }
      else {
        label = d;
      }
      console.log(label);
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
  totalConfig: {
    fontSize: () => 14
  }
};
