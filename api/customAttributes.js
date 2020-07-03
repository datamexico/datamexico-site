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
      const enoeLatestQuarter = data[0]["Quarter ID"];
      const enoePrevQuarter = data[1]["Quarter ID"];
      const enoePrevYear = data[4]["Quarter ID"];
      return {enoeLatestQuarter, enoePrevQuarter, enoePrevYear};
    }

    let enoeLatestQuarter, enoePrevQuarter, enoePrevYear;

    switch (pid) {
      case 1:
        const ENOE_GEO = await ENOE_DATASET();
        enoeLatestQuarter = ENOE_GEO.enoeLatestQuarter;
        enoePrevQuarter = ENOE_GEO.enoePrevQuarter;
        enoePrevYear = ENOE_GEO.enoePrevYear;

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
        const covidLatestUpdated = covidUpdated[0]["Updated Date ID"] - 2;
        const customGiniCube = hierarchy1 === "Nation"
          ? "coneval_gini_nat"
          : hierarchy1 === "State" ? "coneval_gini_ent" : "coneval_gini_mun";

        return res.json({
          covidLatestUpdated,
          customCovidCube: isState ? "gobmx_covid_stats" : "gobmx_covid_stats_mun",
          customSocialLagCube: `coneval_social_lag_${isState ? "ent" : "mun"}`,
          customGiniCube,
          customForeignTradeCube: isState ? "economy_foreign_trade_ent" : "economy_foreign_trade_mun",
          customHierarchy: isMunicipality ? "State" : hierarchy1,
          customId,
          customName,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          foreignTradeLatestYear: "2018"
        });

      case 28:
        const ENOE_OCCUPATION = await ENOE_DATASET();
        enoeLatestQuarter = ENOE_OCCUPATION.enoeLatestQuarter;
        enoePrevQuarter = ENOE_OCCUPATION.enoePrevQuarter;
        enoePrevYear = ENOE_OCCUPATION.enoePrevYear;

        return res.json({
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear
        });

      default:
        return res.json({});

      }
    });

}
