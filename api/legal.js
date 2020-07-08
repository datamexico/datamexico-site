const axios = require("axios");

const PATH_TSV = "https://docs.google.com/spreadsheets/u/1/d/1QyONVs3Qtsh4WekrXDLrZBaVv7sMtaOwPnA_KpBESiQ/export?format=tsv&id=1QyONVs3Qtsh4WekrXDLrZBaVv7sMtaOwPnA_KpBESiQ&gid=0";
const BASE_URL = "/api/legal";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      const respData = await axios(PATH_TSV).then(resp => resp.data);
      const dataDict = {
        "Título": "Title",
        Descripción: "Description"
      }
      const csv = respData.split("\r\n").map(d => d.split("\t"));
      const csvHeader = csv[0];
      const data = csv.slice(1).reduce((all, d) => {
        const item = {};
        csvHeader.forEach((h, i) => {
          item[dataDict[h]] = d[i] !== "" ? d[i] : null;
        });
        all.push(item);
        return all;
      }, []);

      res.json({data});
    } catch (e) {
      console.log(e);
    }
  });

};
