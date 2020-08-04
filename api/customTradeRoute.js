const axios = require("axios");

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);
const BASE_API = CANON_CMS_CUBES + "/data";


// Dictionary of equivalences.
// Keys are names defined in the query.
// Values are names defined on the cube.
const replaces = {
  "Chapter": "Chapter 4 Digit",
  "HS2": "HS2 4 Digit",
  "HS4": "HS4 4 Digit",
  "Year": "Date Year"
}

module.exports = function (app) {
  /**
   * Custom Trade Data API
   * This API handles queries that uses foreign trade data, considering cuts by product, geo, and time levels.
   */
  app.get("/api/trade/data", async(req, res) => {
    const queryObject = query => Object.keys(query).map(d => `${d}=${query[d]}`).join("&");
    const {query} = req;
    const {drilldowns, measures} = query;
    const queryString = queryObject(query);

    // Defines the cube to use.
    // Options are "economy_foreign_trade_ent" and "economy_foreign_trade_mun".
    const isMunLevel = ["Metro Area", "Municipality"].some(d => queryString.includes(d)) || (query.Level && query.Level === "2");
    const cube = `economy_foreign_trade_${isMunLevel ? "mun" : "ent"}`;

    // Generates an object using drilldown names defined in the query.
    // Replaces each key with the drilldown name used on the cube.
    const dds = Object.entries(replaces).reduce((string, d) => {
      return string.replace(d[0], d[1]);
    }, drilldowns);

    // Generates a new object, based on params defined in the query.
    // Replaces each key with the drilldown name used on the cube.
    const params1 = Object.entries(query).reduce((obj, d) => {
      const key = replaces[d[0]] || d[0];
      obj[key] = d[1].replace("Year", "Date Year");
      return obj;
    }, {});

    // Generates a string of keys.
    const keys = Object.keys(params1).join();

    // Cuts by Product Level.
    const handleDepth = depth => [drilldowns, keys].some(d => d.includes(`HS${depth}`) || d.includes(`${depth} Digit`));
    // Product Level
    const productLevel = [4, 6].find(d => handleDepth(d)) || 2;

    // Generates an object with params defined dynamically.
    const params2 = {
      cube,
      drilldowns: dds,
      measures: measures || "Trade Value"
    }

    // If the user didn't define "Product Level" and "Level" in the query, it includes them on params2.
    if (!params1["Product Level"]) params2["Product Level"] = productLevel;
    if (!params1.Level) params2.Level = isMunLevel ? 2 : drilldowns.includes("Nation") ? 1 : 1; // TODO

    // Join both objects.
    const params = Object.assign(params1, params2);

    // Gets data from API.
    const data = await axios.get(BASE_API, {params})
      .then(resp => resp.data)
      .catch(error => ({data: [], error: error.toString()}));

    // For testing purposes, creates a param called "response", that includes response URL used on tesseract.
    data.response = BASE_API + "?" + queryObject(params);

    const customReplaces = {
      "Chapter 2 Digit": "Chapter",
      "Chapter 4 Digit": "Chapter",
      "Date Year": "Year",
      "HS2 2 Digit": "HS2",
      "HS2 4 Digit": "HS2",
      "HS4 4 Digit": "HS4"
    }

    // Converts key names.
    if (data.data && data.data[0]) {
      const item = Object.keys(data.data[0]);

      // Gets keys to be replaced.
      const entries = Object.entries(customReplaces).filter(d => item.includes(d[0]));
      // Iterates over data, and it replaces key name.
      data.data.forEach(d => {
        for(const s of entries) {
          const prevId = `${s[0]} ID`; // Custom ID

          // Check if key exists on object.
          if (d.hasOwnProperty(s[0])) {
            d[s[1]] = d[s[0]];
            delete d[s[0]];
          }
          if (d.hasOwnProperty(prevId)) {
            d[`${s[1]} ID`] = d[prevId];
            delete d[prevId];
          }
        }
      })
    }

    res.json(data).end();

  });
}
