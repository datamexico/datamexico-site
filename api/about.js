const axios = require("axios");

const TSV_BACKGROUND = "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=0";
const TSV_PRESS = "	https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1846034667";
const TSV_GLOSSARY = "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1714281129";
const TSV_LEGAL = "https://docs.google.com/spreadsheets/u/1/d/1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs/export?format=tsv&id=1al8qMBhGOjRU2rGLzetj_uPjE4jmNJ9MWl-hVOlQPPs&gid=1918198501";

const BASE_URL = "/api/about";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      await axios
        .all([axios.get(TSV_BACKGROUND), axios.get(TSV_PRESS), axios.get(TSV_GLOSSARY), axios.get(TSV_LEGAL)])
        .then(axios.spread((...resp) => {
          const dictionary = {
            0: {Texto: "Text"},
            1: {Titular: "Title", Texto: "Text", Fotografía: "Picture"},
            2: {Concepto: "Concept", Descripción: "Description"},
            3: {Título: "Title", Descripción: "Description"}
          }
          const respData = resp.map(d => d.data);
          const cvsData = respData.map((respItem, respIndex) => {
            const csv = respItem.split("\r\n").map(d => d.split("\t"));
            const csvHeader = csv[0];
            const csvDictionary = dictionary[respIndex];
            const data = csv.slice(1).reduce((all, d) => {
              const item = {};
              respIndex === 2 && (item["Initial"] = d[0].charAt(0).toUpperCase()); //Initials for glossary
              csvHeader.forEach((h, i) => {
                item[csvDictionary[h]] = d[i] !== "" ? d[i] : null;
              });
              all.push(item);
              return all;
            }, []);
            return data;
          });

          res.json({
            background: cvsData[0],
            press: cvsData[1],
            glossary: cvsData[2],
            terms: cvsData[3]
          });
        }));
    } catch (e) {
      console.log(e);
    }
  });

};
