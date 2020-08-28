const axios = require("axios");
const yn = require("yn");
const {CANON_CMS_CUBES} = process.env;
const verbose = yn(process.env.CANON_CMS_LOGGING);
const BASE_API = `${CANON_CMS_CUBES}data.jsonrecords`;

const catcher = error => {
  if (verbose) console.error("Custom Attribute Error:", error);
  return [];
};
module.exports = function (app) {
  app.post("/api/cms/customAttributes/:pid", async (req, res) => {
    const pid = req.params.pid * 1;
    const {cache} = app.settings;
    const {variables} = req.body;
    const {
      id1,
      dimension1,
      hierarchy1,
      slug1,
      name1,
      cubeName1,
      parents1
    } = variables;

    // ENOE: Shared customAttribute
    const ENOE_DATASET = async (hierarchy, id) => {
      const params = {
        cube: "inegi_enoe",
        drilldowns: "Quarter",
        measures: "Workforce",
        [hierarchy]: id
      };
      const data = await axios
        .get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
      const enoeLatestQuarter = data[0] ? data[0]["Quarter ID"] : undefined;
      const enoePrevQuarter = data[1] ? data[1]["Quarter ID"] : undefined;
      const enoePrevYear = data[4] ? data[4]["Quarter ID"] : undefined;
      return {enoeLatestQuarter, enoePrevQuarter, enoePrevYear};
    };

    // FDI: Shared customAttribute
    const FDI_DATASET = async (hierarchy, id) => {
      const params = {
        cube: "economy_fdi",
        drilldowns: "Quarter",
        measures: "Investment (Million)",
        parents: true,
        [hierarchy]: id
      };
      const data = await axios
        .get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
      const fdiLatestQuarter = data[0] ? data[0]["Quarter ID"] : undefined;
      const fdiLatestYear = data[0] ? data[0].Year : undefined;
      const fdiPrevQuarter = data[1] ? data[1]["Quarter ID"] : undefined;
      const fdiPrevQuarterYear = data[4] ? data[4]["Quarter ID"] : undefined;
      return {
        fdiLatestQuarter,
        fdiLatestYear,
        fdiPrevQuarter,
        fdiPrevQuarterYear
      };
    };

    // Creates empty variables.
    let enoeLatestQuarter, enoePrevQuarter, enoePrevYear;

    // Verifies profile.
    switch (pid) {
      // Geo profile
      case 1:
        let customId = id1;
        let customName = name1;
        const isMunicipality = ["Municipality"].includes(hierarchy1);
        const isState = ["Nation", "State"].includes(hierarchy1);

        if (isMunicipality) {
          const allData = cache.geoData;
          const parent = allData[id1];
          if (parent) {
            customId = parent["State ID"];
            customName = parent.State;
          }
        }

        const customHierarchy = isMunicipality ? "State" : hierarchy1;

        const ENOE_GEO = await ENOE_DATASET(customHierarchy, customId).catch(
          () => {}
        );
        enoeLatestQuarter = ENOE_GEO.enoeLatestQuarter;
        enoePrevQuarter = ENOE_GEO.enoePrevQuarter;
        enoePrevYear = ENOE_GEO.enoePrevYear;

        const covidParams = {
          cube: "gobmx_covid",
          drilldowns: "Updated Date",
          measures: "Cases"
          // [hierarchy1]: id1
        };
        const covidUpdated = await axios
          .get(BASE_API, {params: covidParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        covidUpdated.sort((a, b) => b["Updated Date ID"] - a["Updated Date ID"]);
        const covidLatestUpdated = covidUpdated[0]
          ? covidUpdated[0]["Updated Date ID"]
          : undefined;
        const customGiniCube =
          hierarchy1 === "Nation"
            ? "coneval_gini_nat"
            : hierarchy1 === "State"
              ? "coneval_gini_ent"
              : "coneval_gini_mun";

        return res.json({
          covidLatestUpdated,
          customCovidCube:
            hierarchy1 === "State"
              ? "gobmx_covid_stats_state"
              : hierarchy1 === "Nation"
                ? "gobmx_covid_stats_nation"
                : "gobmx_covid_stats_mun",
          customSocialLagCube: `coneval_social_lag_${isState ? "ent" : "mun"}`,
          customGiniCube,
          customForeignTradeCube: isState
            ? "economy_foreign_trade_ent"
            : "economy_foreign_trade_mun",
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

      // Product profile
      case 11:
        const productParams = {
          cube: "economy_foreign_trade_ent",
          drilldowns: "Quarter",
          measures: "Trade Value",
          parents: "true"
        };

        const productQuaters = await axios.get(BASE_API, {params: productParams})
          .then(resp => resp.data.data)
          .catch(catcher);

        const yearsInData = [...new Set(productQuaters.map(m => m.Year))];
        yearsInData.sort((a, b) => b - a);

        let tradeLatestYear = undefined;

        for (const year of yearsInData) {
          const quetersPerYear = productQuaters.filter(d => d.Year === year).length;
          if (quetersPerYear === 4 && !tradeLatestYear) tradeLatestYear = year;
        }

        return res.json({
          foreignTradeLatestYear: tradeLatestYear,
          foreignTradePrevYear: tradeLatestYear - 1
        });

      // Institution profile
      case 22:
        const anuiesParams = {
          cube: "anuies_enrollment",
          drilldowns: "Year",
          measures: "Students",
          [hierarchy1]: id1
        };
        const anuiesUpdated = await axios
          .get(BASE_API, {params: anuiesParams})
          .then(resp => resp.data.data)
          .catch(catcher);
        anuiesUpdated.sort((a, b) => b.Year - a.Year);
        const anuiesLatestYear = anuiesUpdated[0]
          ? anuiesUpdated[0].Year
          : undefined;

        const anuiesPrevYear = anuiesUpdated[1]
          ? anuiesUpdated[1].Year
          : undefined;

        return res.json({
          anuiesLatestYear,
          anuiesPrevYear
        });

      // Occupation profile
      case 28:
        const ENOE_OCCUPATION = await ENOE_DATASET(hierarchy1, id1).catch(
          () => {}
        );
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
        const ENOE_INDUSTRY = await ENOE_DATASET(hierarchy1, id1).catch(
          () => {}
        );
        const FDI_INDUSTRY = await FDI_DATASET(hierarchy1, id1).catch(() => {});
        const {
          fdiLatestQuarter,
          fdiLatestYear,
          fdiPrevQuarter,
          fdiPrevQuarterYear
        } = FDI_INDUSTRY;
        enoeLatestQuarter = ENOE_INDUSTRY.enoeLatestQuarter;
        enoePrevQuarter = ENOE_INDUSTRY.enoePrevQuarter;
        enoePrevYear = ENOE_INDUSTRY.enoePrevYear;
        const isDeepestLevel = ["NAICS Industry", "National Industry"].includes(
          hierarchy1
        );
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
};
