const axios = require("axios");
const BASE_API = "https://api.datamexico.org/tesseract/data";

const catcher = error => (console.error("Custom Attribute Error:", error), {data: []});
module.exports = function (app) {

  app.post("/api/cms/customAttributes/:pid", async(req, res) => {
    const pid = req.params.pid * 1;
    const {variables, locale} = req.body;
    const {id1, dimension1, hierarchy1, slug1, name1, cubeName1, parents1} = variables;

    const ENOE_DATASET = async(hierarchy, id) => {
      // Latest Quarter
      const params = {
        cube: "inegi_enoe",
        drilldowns: "Quarter",
        measures: "Workforce",
        [hierarchy]: id
      };
      const data = await axios.get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
      const enoeLatestQuarter = data[0] ? data[0]["Quarter ID"] : undefined;
      const enoePrevQuarter = data[1] ? data[1]["Quarter ID"] : undefined;
      const enoePrevYear = data[4] ? data[4]["Quarter ID"] : undefined;
      return {enoeLatestQuarter, enoePrevQuarter, enoePrevYear};
    }

    const FDI_DATASET = async(hierarchy, id) => {
      // Latest Quarter
      const params = {
        cube: "economy_fdi",
        drilldowns: "Quarter",
        measures: "Investment (Million)",
        parents: true,
        [hierarchy]: id
      };
      const data = await axios.get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
      const fdiLatestQuarter = data[0] ? data[0]["Quarter ID"] : undefined;
      const fdiLatestYear = data[0] ? data[0]["Year"] : undefined;
      const fdiPrevQuarter = data[1] ? data[1]["Quarter ID"] : undefined;
      const fdiPrevQuarterYear = data[4] ? data[4]["Quarter ID"] : undefined;
      return {fdiLatestQuarter, fdiLatestYear, fdiPrevQuarter, fdiPrevQuarterYear};
    }

    let enoeLatestQuarter, enoePrevQuarter, enoePrevYear;

    switch (pid) {
      // Geo profile
      case 1:
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

        const isMunicipality = ["Metro Area", "Municipality"].includes(hierarchy1);
        const isState = ["Nation", "State"].includes(hierarchy1);

        const customHierarchy = isMunicipality ? "State" : hierarchy1

        const ENOE_GEO = await ENOE_DATASET(customHierarchy, customId);
        enoeLatestQuarter = ENOE_GEO.enoeLatestQuarter;
        enoePrevQuarter = ENOE_GEO.enoePrevQuarter;
        enoePrevYear = ENOE_GEO.enoePrevYear;

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
        const customGiniCube = hierarchy1 === "Nation"
          ? "coneval_gini_nat"
          : hierarchy1 === "State" ? "coneval_gini_ent" : "coneval_gini_mun";

        return res.json({
          covidLatestUpdated,
          customCovidCube: hierarchy1 === "State"
            ? "gobmx_covid_stats_state"
            : hierarchy1 === "Nation"
              ? "gobmx_covid_stats_nation" : "gobmx_covid_stats_mun",
          customSocialLagCube: `coneval_social_lag_${isState ? "ent" : "mun"}`,
          customGiniCube,
          customForeignTradeCube: isState ? "economy_foreign_trade_ent" : "economy_foreign_trade_mun",
          customHierarchy,
          customId,
          customName,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          foreignTradePrevYear: 2018,
          foreignTradeLatestMonth: 202005,
          foreignTradeLatestYear: 2019,
          fdiLatestQuarter: 20201,
          fdiLatestYear: 2019
        });

      case 11:
        return res.json({
          foreignTradeLatestYear: 2019,
          foreignTradePrevYear: 2018
        });

      case 22:
        return res.json({
          anuiesLatestYear: 2019,
          anuiesPrevYear: 2018
        });

      case 28:
        const ENOE_OCCUPATION = await ENOE_DATASET(hierarchy1, id1);
        enoeLatestQuarter = ENOE_OCCUPATION.enoeLatestQuarter;
        enoePrevQuarter = ENOE_OCCUPATION.enoePrevQuarter;
        enoePrevYear = ENOE_OCCUPATION.enoePrevYear;

        return res.json({
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear
        });

      // Industry profile
      case 33:
        const ENOE_INDUSTRY = await ENOE_DATASET(hierarchy1, id1);
        const FDI_INDUSTRY = await FDI_DATASET(hierarchy1, id1);
        const {fdiLatestQuarter, fdiLatestYear, fdiPrevQuarter, fdiPrevQuarterYear} = FDI_INDUSTRY;
        enoeLatestQuarter = ENOE_INDUSTRY.enoeLatestQuarter;
        enoePrevQuarter = ENOE_INDUSTRY.enoePrevQuarter;
        enoePrevYear = ENOE_INDUSTRY.enoePrevYear;
        const isDeepestLevel = ["NAICS Industry", "National Industry"].includes(hierarchy1);

        return res.json({
          customId: isDeepestLevel ? id1.toString().slice(0, 4) : id1,
          customHierarchy: isDeepestLevel ? "Industry Group" : hierarchy1,
          denueLatestMonth: 20200417,
          denuePrevMonth: 20191114,
          economicCensusLatestYear: 2014,
          economicCensusPrevYear: 2009,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          fdiLatestQuarter,
          fdiLatestYear,
          fdiPrevQuarter,
          fdiPrevQuarterYear,
          isDeepestLevel
        });

      default:
        return res.json({});

      }
    });

}
