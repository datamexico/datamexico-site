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
    stroke: "#ccc"
  },
  gridConfig: {
    stroke: "#ccc"
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

export default {
  axisConfig: axisStyles,
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
      fillOpacity: 0.75,
      strokeOpacity: 0.25
    },
    Rect: {
      labelConfig: {
        fontResize: true,
        padding: 0
      }
    }
  }
};
