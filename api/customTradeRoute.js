const axios = require("axios");

const BASE_API = "https://api.datamexico.org/tesseract/data";

module.exports = function (app) {
  app.get("/api/trade/data", async(req, res) => {
    const queryObject = query => Object.keys(query).map(d => `${d}=${query[d]}`).join("&");
    const {query} = req;
    const {drilldowns, measures} = query;
    const queryString = queryObject(query);

    const isMunLevel = ["Metro Area", "Municipality"].some(d => queryString.includes(d));
    const cube = `economy_foreign_trade_${isMunLevel ? "mun" : "ent"}`;

    const replaces = {
      "HS2": "HS2 2 Digit",
      "HS4": "HS4 4 Digit",
      "Year": "Date Year"
    }
    const dds = Object.entries(replaces).reduce((string, d) => {
      return string.replace(d[0], d[1]);
    }, drilldowns);

    const params1 = Object.entries(query).reduce((obj, d) => {
      const key = replaces[d[0]] || d[0];
      obj[key] = d[1].replace("Year", "Date Year");
      return obj;
    }, {});


    const productLevel = drilldowns.includes("HS4") ? 4 : drilldowns.includes("HS6") ? 6 : 2;
    const params2 = {
      cube,
      drilldowns: dds,
      measures: measures || "Trade Value"
    }
    if (!params1["Product Level"]) params2["Product Level"] = productLevel;
    if (!params1.Level) params2.Level = isMunLevel ? 2 : drilldowns.includes("Nation") ? 1 : 1; // TODO
    const params = Object.assign(params1, params2);

    const data = await axios.get(BASE_API, {params})
      .then(resp => resp.data)
      .catch(error => ({data: [], error: error.toString()}));
    data.response = BASE_API + "?" + queryObject(params);

    const customReplaces = {
      "Chapter 2 Digit": "Chapter",
      "Chapter 4 Digit": "Chapter",
      "Date Year": "Year",
      "HS2 2 Digit": "HS2",
      "HS2 4 Digit": "HS2",
      "HS4 4 Digit": "HS4"
    }

    if (data.data && data.data[0]) {
      const item = Object.keys(data.data[0]);
      const entries = Object.entries(customReplaces).filter(d => item.includes(d[0]));
      data.data.forEach(d => {
        for(const s of entries) {
          if (d.hasOwnProperty(s[0])) {
            d[s[1]] = d[s[0]];
            delete d[s[0]];
          }
          if (d.hasOwnProperty(`${s[0]} ID`)) {
            d[`${s[1]} ID`] = d[`${s[0]} ID`];
            delete d[`${s[0]} ID`];
          }
        }
      })
    }

    res.json(data).end();

  });
}
