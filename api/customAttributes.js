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
    const {variables, locale} = req.body;
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

    // Foreign Trade: Shared customAttribute
    const FOREIGN_DATASET = async (hierarchy, id) => {
      const params = {
        cube: "economy_foreign_trade_ent",
        drilldowns: "Month",
        measures: "Trade Value",
        [hierarchy]: id,
        parents: true,
      };
      const data = await axios
        .get(BASE_API, {params})
        .then(resp => resp.data.data)
        .catch(catcher);

      data.sort((a, b) => b["Month ID"] - a["Month ID"]);

      const yearsInData = [...new Set(data.map(m => m.Year))];
      yearsInData.sort((a, b) => b - a);

      const quartersInData = [...new Set(data.map(m => m["Quarter ID"]))];
      quartersInData.sort((a, b) => b - a);

      let tradeLatestYear = undefined;
      let tradeLatestQuarter = undefined;

      for (const year of yearsInData) {
        const quetersPerYear = data.filter(d => d.Year === year).length;
        if (quetersPerYear === 12 && !tradeLatestYear) tradeLatestYear = year;
      }

      for (const quarter of quartersInData) {
        const quartersPerYear = data.filter(d => d["Quarter ID"] === quarter).length;
        if (quartersPerYear === 3 && !tradeLatestQuarter) tradeLatestQuarter = quarter;
      }

      const foreignTradeLatestYear = tradeLatestYear;
      const foreignTradePrevYear = tradeLatestYear - 1;
      const foreignTradeLatestQuarter = tradeLatestQuarter;
      const foreignTradeLatestMonth = data[0] ? data[0]["Month ID"] : undefined;

      return {foreignTradeLatestMonth, foreignTradeLatestQuarter, foreignTradeLatestYear, foreignTradePrevYear};
    };

    // Creates empty variables.
    let enoeLatestQuarter, enoePrevQuarter, enoePrevYear, foreignTradeLatestMonth, foreignTradeLatestQuarter, foreignTradeLatestYear, foreignTradePrevYear;

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
          () => { }
        );
        enoeLatestQuarter = ENOE_GEO.enoeLatestQuarter;
        enoePrevQuarter = ENOE_GEO.enoePrevQuarter;
        enoePrevYear = ENOE_GEO.enoePrevYear;

        const FOREIGN_GEO = await FOREIGN_DATASET(hierarchy1, id1).catch(
          () => { }
        );
        foreignTradeLatestMonth = FOREIGN_GEO.foreignTradeLatestMonth;
        foreignTradeLatestYear = FOREIGN_GEO.foreignTradeLatestYear;
        foreignTradePrevYear = FOREIGN_GEO.foreignTradePrevYear;

        //FDI temporal customAttributes at geo level
        const fdiGeo = {
          cube: "fdi_2_state_investment",
          drilldowns: "Quarter",
          measures: "Investment",
          parents: true,
        };

        const fdiGeoValues = await axios
          .get(BASE_API, {params: fdiGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        fdiGeoValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const fdiLatestQuarter = fdiGeoValues[0] ? fdiGeoValues[0]["Quarter ID"] : undefined;

        //GDP latest quarter customAttributes
        const gdpGeo = {
          cube: "inegi_gdp",
          drilldowns: "Quarter",
          measures: "GDP"
        };

        const gdpValues = await axios
          .get(BASE_API, {params: gdpGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        gdpValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const gdpLatestQuarter = gdpValues[0] ? gdpValues[0]["Quarter ID"] : undefined;

        //INEA temporal customAttributes
        const ineaGeo = {
          cube: "inea_adult_education_stats",
          drilldowns: "Quarter",
          measures: "Active advisors"
        };

        const ineaGeoValues = await axios
          .get(BASE_API, {params: ineaGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        ineaGeoValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const ineaLatestQuarter = ineaGeoValues[0] ? ineaGeoValues[0]["Quarter ID"] : undefined;
        const ineaPrevYearQuarter = ineaGeoValues[4] ? ineaGeoValues[4]["Quarter ID"] : undefined;

        //Sesnsp_crimes temporal customAttributes
        const sesnspGeo = {
          cube: "sesnsp_crimes",
          drilldowns: "Month",
          measures: "Value"
        };

        const sesnsp_crimes = await axios
          .get(BASE_API, {params: sesnspGeo})
          .then(resp => resp.data.data)
          .catch(catcher);
        sesnsp_crimes.sort((a, b) => b["Month ID"] - a["Month ID"]);
        const crimesLatestMonth = sesnsp_crimes[0] ? sesnsp_crimes[0]["Month ID"] : undefined;
        const crimesPrevYearMonth = sesnsp_crimes[12] ? sesnsp_crimes[12]["Month ID"] : undefined;

        //Gini customAttributes
        const customGiniCube =
          hierarchy1 === "Nation"
            ? "coneval_gini_nat"
            : hierarchy1 === "State"
              ? "coneval_gini_ent"
              : "coneval_gini_mun";

        //Foreign Trade Cube customAttributes
        const customForeignTradeCube =
        hierarchy1 === "Nation"
          ? "economy_foreign_trade_nat"
          : hierarchy1 === "State"
            ? "economy_foreign_trade_ent"
            : "economy_foreign_trade_mun";

        return res.json({
          customCovidCube:
            hierarchy1 === "State"
              ? "gobmx_covid_stats_state"
              : hierarchy1 === "Nation"
                ? "gobmx_covid_stats_nation"
                : "gobmx_covid_stats_mun",

          customSocialLagCube: `coneval_social_lag_${isState ? "ent" : "mun"}`,
          customGiniCube,
          customForeignTradeCube, //: isState ? "economy_foreign_trade_ent" : "economy_foreign_trade_mun",
          customHierarchy,
          customId,
          customName,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          fdiLatestQuarter,
          foreignTradeLatestMonth,
          foreignTradeLatestYear,
          foreignTradePrevYear,
          ineaLatestQuarter,
          ineaPrevYearQuarter,
          crimesLatestMonth,
          crimesPrevYearMonth,
          gdpLatestQuarter
        });

      // Product profile
      case 11:

        const FOREIGN_PRODUCT = await FOREIGN_DATASET(hierarchy1, id1).catch(
          () => { }
        );
        foreignTradeLatestMonth = FOREIGN_PRODUCT.foreignTradeLatestMonth;
        foreignTradeLatestQuarter = FOREIGN_PRODUCT.foreignTradeLatestQuarter;
        foreignTradeLatestYear = FOREIGN_PRODUCT.foreignTradeLatestYear;
        foreignTradePrevYear = FOREIGN_PRODUCT.foreignTradePrevYear;

        return res.json({
          foreignTradeLatestYear,
          foreignTradePrevYear,
          foreignTradeLatestQuarter,
          foreignTradeLatestMonth
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

        const anuiesLatestYear = anuiesUpdated[0] ? anuiesUpdated[0].Year : undefined;
        const anuiesPrevYear = anuiesUpdated[1] ? anuiesUpdated[1].Year : undefined;

        return res.json({
          anuiesLatestYear,
          anuiesPrevYear
        });

      // Occupation profile
      case 28:
        const ENOE_OCCUPATION = await ENOE_DATASET(hierarchy1, id1).catch(
          () => { }
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
        // Economic Census
        const censusParams = {
          cube: "inegi_economic_census",
          drilldowns: "National Industry",
          measures: "Economic Unit",
          parents: "true",
          locale: locale,
          [hierarchy1]: id1
        };
        const censusIdSector = await axios
          .get(BASE_API, {params: censusParams})
          .then(resp => resp.data.data)
          .catch(catcher);

        const sectorId = censusIdSector[0]["Sector ID"];
        const sectorName = censusIdSector[0].Sector;

        //ENOE
        const ENOE_INDUSTRY = await ENOE_DATASET(hierarchy1, id1).catch(
          () => { }
        );

        enoeLatestQuarter = ENOE_INDUSTRY.enoeLatestQuarter;
        enoePrevQuarter = ENOE_INDUSTRY.enoePrevQuarter;
        enoePrevYear = ENOE_INDUSTRY.enoePrevYear;
        const isDeepestLevel = ["NAICS Industry", "National Industry"].includes(
          hierarchy1
        );

        //FDI temporal customAttributes
        const fdiIndustry = {
          cube: "fdi_quarter_industry",
          drilldowns: "Quarter",
          measures: "Investment",
          parents: true,
        };
        const fdiIndustryValues = await axios
          .get(BASE_API, {params: fdiIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        fdiIndustryValues.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const fdiLatestQuarterIndustry = fdiIndustryValues[0] ? fdiIndustryValues[0]["Quarter ID"] : undefined;
        const fdiLatestYearIndustry = fdiIndustryValues[0] ? fdiIndustryValues[0].Year : undefined;
        const fdiPrevQuarterIndustry = fdiIndustryValues[1] ? fdiIndustryValues[1]["Quarter ID"] : undefined;
        const fdiPrevQuarterYearIndustry = fdiIndustryValues[4] ? fdiIndustryValues[4]["Quarter ID"] : undefined;

        //GDP latest quarter customAttributes
        const gdpIndustry = {
          cube: "inegi_gdp",
          drilldowns: "Quarter",
          measures: "GDP"
        };

        const gdpValuesIndustry = await axios
          .get(BASE_API, {params: gdpIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        gdpValuesIndustry.sort((a, b) => b["Quarter ID"] - a["Quarter ID"]);
        const gdpLatestQuarterSector = gdpValuesIndustry[0] ? gdpValuesIndustry[0]["Quarter ID"] : undefined;
        const gdpPrevQuarterSector = gdpValuesIndustry[1] ? gdpValuesIndustry[1]["Quarter ID"] : undefined;
        const gdpPrevYearQuarterSector = gdpValuesIndustry[4] ? gdpValuesIndustry[4]["Quarter ID"] : undefined;

        //DENUE
        const denueIndustry = {
          cube: "inegi_denue",
          drilldowns: "Year",
          measures: "Companies"
        };

        const denueValues = await axios
          .get(BASE_API, {params: denueIndustry})
          .then(resp => resp.data.data)
          .catch(catcher);
        denueValues.sort((a, b) => b["Year"] - a["Year"]);
        const denueLastestYear = denueValues[0] ? denueValues[0]["Year"] : undefined;
        const denuePrevYear = denueValues[1] ? denueValues[1]["Year"] : undefined;

        //const fdiYearCube = hierarchy1 === "Sector" ? "fdi_7_sector" : hierarchy1 === "Subsector" ? "fdi_7_subsector" : "fdi_7_industry_group";
        //const fdiQuaterCube = hierarchy1 === "Sector" ? "fdi_8_sector_investment" : hierarchy1 === "Subsector" ? "fdi_8_subsector_investment" : "fdi_8_industry_group_investment";

        return res.json({
          customId: isDeepestLevel ? id1.toString().slice(0, 4) : id1,
          customHierarchy: isDeepestLevel ? "Industry Group" : hierarchy1,
          sectorId,
          sectorName,
          customCensusLevel: hierarchy1 === "Sector" ? 1 : hierarchy1 === "Subsector" ? 2 : 3,
          enoeLatestQuarter,
          enoePrevQuarter,
          enoePrevYear,
          fdiLatestQuarterIndustry,
          fdiLatestYearIndustry,
          fdiPrevQuarterIndustry,
          fdiPrevQuarterYearIndustry,
          gdpLatestQuarterSector,
          gdpPrevQuarterSector,
          gdpPrevYearQuarterSector,
          denueLastestYear,
          denuePrevYear,
          isDeepestLevel
        });

      default:
        return res.json({});
    }
  });
};
