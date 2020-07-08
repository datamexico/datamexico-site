const axios = require("axios");

const PATH_CSV = "https://docs.google.com/spreadsheets/u/1/d/1IUnyXj7XwbJQi_mXTbs3JZlGgn9IgHMDV-_9KkILM6I/export?format=tsv&id=1IUnyXj7XwbJQi_mXTbs3JZlGgn9IgHMDV-_9KkILM6I&gid=0";
const BASE_URL = "/api/glossary";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      const respData = await axios(PATH_CSV).then(resp => resp.data);
      const dataDict = {
        "Concepto": "Concept",
        Descripción: "Description"
      }
      const csv = respData.split("\r\n").map(d => d.split("\t"));
      const csvHeader = csv[0];
      const data = csv.slice(1).reduce((all, d) => {
        const item = {};
        item["Initial"] = d[0].charAt(0).toUpperCase();
        csvHeader.forEach((h, i) => {
          item[dataDict[h]] = d[i] !== "" ? d[i] : null;
        });
        all.push(item);
        return all;
      }, []);

      res.json({data: data});
    } catch (e) {
      console.log(e);
    }
  });

};
