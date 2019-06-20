import colors from "../static/data/colors.json";

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
  shapeConfig: {
    labelConfig: {
      fontFamily: "Roboto"
    }
  }
};
