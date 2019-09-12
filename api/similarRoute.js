const axios = require("axios");

const loadJSON = require("../utils/loadJSON");
const industrySimilar6Digit = loadJSON("/static/json/industry_similar_6digit.json");

const datasets = {
  "National Industry": industrySimilar6Digit
};

const API = "https://api.datamexico.org/tesseract/data";

module.exports = function(app) {

  app.get("/api", (req, res) => {
    const {query} = req;
    // Search levels that includes :similar as param
    const searchLevels = Object.entries(query).reduce((all, d) => {
      if (d[1].includes(":similar")) all.push(d[0]);
      return all;
    }, []);

    const similarLimit = query.similarLimit || 8;

    searchLevels.forEach(h => {
      const dataCache = datasets[h];
      if (!dataCache) res.status(500).send(`No cache for ${h}`);

      const results = query[h].split(",");
      query[h] = results.reduce((all, d) => {
        if (d.includes(":")) {
          const limit = d.split(":");
          const obj = dataCache[limit[0]];
          const ids = obj.map(d => d[`${h} ID`]).slice(0, similarLimit).join(",");
          all.push(ids);
        }
        else all.push(d);

        return all;
      }, []).join(",");

    });

    axios.get(API, {params: query}).then(resp => {
      res.json(resp.data).end();
    });

  });

};
