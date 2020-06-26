const axios = require("axios");
const BASE_API = "https://api.datamexico.org/tesseract/data";

const catcher = error => console.error("Custom Attribute Error:", error);
module.exports = function (app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {
    const pid = req.params.pid * 1;
    const {variables, locale} = req.body;
    const {id1, dimension1, hierarchy1, slug1, name1, cubeName1, user} = variables;

    const ENOE_DATASET = async() => {
      // Latest Quarter
      const params = {
        cube: "inegi_enoe",
        drilldowns: "Quarter",
        measures: "Workforce"
      }
      const data = await axios.get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
      const latest = data[0];
      return latest;
    }

    switch (pid) {
      case 1:
        const ENOE_GEO = await ENOE_DATASET();
        const isMunicipality = ["Metro Area", "Municipality"].includes(hierarchy1);
        const isState = ["Nation", "State"].includes(hierarchy1);

        let customId = id1;
        let customName = name1;
        if (isMunicipality) {
          const params = {
            cube: "inegi_population",
            drilldowns: hierarchy1,
            measures: "Population",
            [hierarchy1]: id1,
            parents: true
          }
          const data = await axios.get(BASE_API, {params})
            .then(resp => resp.data.data[0])
            .catch(catcher);
          const levels = ["Nation", "State", "Municipality"];
          const i = levels.findIndex(d => d === hierarchy1);
          const level = levels[i - 1];
          customId = data[`${level} ID`];
          customName = data[level];
        }

        const covidParams = {
          cube: "gobmx_covid",
          drilldowns: "Updated Date",
          measures: "Cases"
        };
        const covidUpdated = await axios.get(BASE_API, {params: covidParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        covidUpdated.sort((a, b) => b["Updated Date ID"] - a["Updated Date ID"]);
        const covidLatestUpdated = covidUpdated[0]["Updated Date ID"];

        return res.json({
          covidLatestUpdated,
          customCovidCube: isState ? "gobmx_covid_stats" : "gobmx_covid_stats_mun",
          customForeignTradeCube: isState ? "economy_foreign_trade_ent" : "economy_foreign_trade_mun",
          customHierarchy: isMunicipality ? "State" : hierarchy1,
          customId,
          customName,
          enoeLatestQuarter: ENOE_GEO["Quarter ID"],
          foreignTradeLatestYear: "2018"
        });

      case 28:
        const ENOE_OCCUPATION = await ENOE_DATASET();

        return res.json({
          enoeLatestQuarter: ENOE_OCCUPATION["Quarter ID"]
        });

      default:
        return res.json({});

      }
    });

}
