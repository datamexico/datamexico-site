const axios = require("axios");
const locale = "es";

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);

const BASE_URL = "/api/covid/";

const headers = {
  headers: {
    "Cache-Control": "no-cache",
    "Pragma": "no-cache"
  }
};

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      // Gets the dates from the last 7 days
      const DATASET_DATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Updated%20Date";
      const LATEST_WEEK = await axios.get(DATASET_DATES).then(resp => {
        const dateArray = resp.data.data.sort((a, b) => b.ID - a.ID).slice(0, 8);
        dateArray.forEach(d => {
          d["Time ID"] = d["ID"];
          d["Time"] = d["Label"];
          delete d["ID"];
          delete d["Label"];
        });
        return dateArray;
      });
      const LATEST_DATE = LATEST_WEEK[0];

      // Gets all the data from the mexican geo divisions
      const MEXICO_NATION = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Nation";
      const MEXICO_STATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=State";
      const MEXICO_MUNICIPALITIES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Municipality";
      const LOCATIONS = await axios
        .all([axios.get(MEXICO_NATION), axios.get(MEXICO_STATES), axios.get(MEXICO_MUNICIPALITIES)])
        .then(axios.spread((...resp) => {
          resp[0].data.data.forEach(d => {
            d["Location ID"] = d["ID"];
            d["Location"] = d["Label"];
            d["Division"] = "Nation";
            d["Icon"] = "/icons/visualizations/Nation/svg/mexico-flag.svg";
            delete d["ID"];
            delete d["Label"];
          });
          resp[1].data.data.forEach(d => {
            d["Location ID"] = d["ID"];
            d["Location"] = d["Label"];
            d["Division"] = "State";
            d["Icon"] = `/icons/visualizations/State/png/white/${d["ID"]}.png`;
            delete d["ID"];
            delete d["Label"];
          });
          resp[2].data.data.forEach(d => {
            d["Location ID"] = d["ID"];
            d["Location"] = d["Label"];
            d["Division"] = "Municipality";
            d["Icon"] = `/icons/visualizations/State/png/white/${d["ID"].toString().slice(0, -3)}.png`;
            delete d["ID"];
            delete d["Label"];
          });
          const locationArray = resp.map(d => d.data.data.filter(d => d["Location"] !== "No Informado"));
          return locationArray.flat();
        }))
        .catch(e => console.log(e));

      // Gets all the data from the gobmx_covid_stats cube
      const COVID_STATS_MEASURES = "Daily%20Cases,Daily%20Deaths,Daily%20Hospitalized,Daily%20Suspect,Accum%20Cases,Accum%20Deaths,Accum%20Hospitalized,Accum%20Suspect,Days%20Between%20Ingress%20and%20Death,New%20Cases%20Report,New%20Deaths%20Report,New%20Hospitalized%20Report,New%20Suspect%20Report,Accum%20Cases%20Report,Accum%20Deaths%20Report,Accum%20Hospitalized%20Report,Accum%20Suspect%20Report,AVG%207%20Days%20Daily%20Cases,AVG%207%20Days%20Accum%20Cases,AVG%207%20Days%20Daily%20Deaths,AVG%207%20Days%20Accum%20Deaths,AVG%207%20New%20Cases%20Report,AVG%207%20Accum%20Cases%20Report,AVG%207%20New%20Deaths%20Report,AVG%207%20Accum%20Deaths%20Report,Last%207%20Daily%20Cases,Last%207%20Daily%20Deaths,Last%207%20Accum%20Cases,Last%207%20Accum%20Deaths,Last%207%20New%20Cases%20Report,Last%207%20Accum%20Cases%20Report,Last%207%20New%20Deaths%20Report,Last%207%20Accum%20Deaths%20Report,Rate%20Daily%20Cases,Rate%20Accum%20Cases,Rate%20Daily%20Deaths,Rate%20Accum%20Deaths,Rate%20New%20Cases%20Report,Rate%20Accum%20Cases%20Report,Rate%20New%20Deaths%20Report,Rate%20Accum%20Deaths%20Report,Days%20from%2050%20Cases,Days%20from%2010%20Deaths";
      const COVID_STATS_NATION = CANON_CMS_CUBES + `/data.jsonrecords?cube=gobmx_covid_stats_nation&drilldowns=Nation,Time&measures=${COVID_STATS_MEASURES}&parents=false&sparse=false&locale=${locale}`;
      const COVID_STATS_STATES = CANON_CMS_CUBES + `/data.jsonrecords?cube=gobmx_covid_stats_state&drilldowns=State,Time&measures=${COVID_STATS_MEASURES}&parents=false&sparse=false&locale=${locale}`;
      const COVID_STATS_DATA_ALL = await axios
        .all([axios.get(COVID_STATS_NATION, headers), axios.get(COVID_STATS_STATES, headers)])
        .then(axios.spread((...resp) => {
          resp[0].data.data.forEach(d => {
            d["Location ID"] = d["Nation ID"];
            d["Location"] = d["Nation"];
            d["Division"] = "Nation";
            delete d["Nation ID"];
            delete d["Nation"];
          });
          resp[1].data.data.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            d["Division"] = "State";
            delete d["State ID"];
            delete d["State"];
          });
          const dataArray = resp.map(d => d.data.data);
          return dataArray.flat();
        }))
        .catch(e => console.log(e));
      const COVID_STATS_DATA = COVID_STATS_DATA_ALL.filter(d => 20200315 * 1 <= d["Time ID"] * 1);

      // Gets the most recent data from the gobmx_covid cube
      const COVID_GOBMX_DRILLDOWNS = "Covid%20Result,Is%20Dead,Patient%20Type,Age%20Range,Sex,Updated%20Date";
      const COVID_GOBMX_NATION = CANON_CMS_CUBES + `/data.jsonrecords?Updated+Date=${LATEST_DATE["Time ID"]}&cube=gobmx_covid&drilldowns=${`${COVID_GOBMX_DRILLDOWNS},Nation`}&measures=Cases&parents=false&sparse=false&locale=${locale}`;
      const COVID_GOBMX_STATES = CANON_CMS_CUBES + `/data.jsonrecords?Updated+Date=${LATEST_DATE["Time ID"]}&cube=gobmx_covid&drilldowns=${`${COVID_GOBMX_DRILLDOWNS},State`}&measures=Cases&parents=false&sparse=false&locale=${locale}`;
      const COVID_GOBMX_DATA = await axios
        .all([axios.get(COVID_GOBMX_NATION, headers), axios.get(COVID_GOBMX_STATES, headers)])
        .then(axios.spread((...resp) => {
          resp[0].data.data.forEach(d => {
            d["Location ID"] = d["Nation ID"];
            d["Location"] = d["Nation"];
            d["Division"] = "Nation";
            delete d["Nation ID"];
            delete d["Nation"];
          });
          resp[1].data.data.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            d["Division"] = "State";
            delete d["State ID"];
            delete d["State"];
          });
          const dataArray = resp.map(d => d.data.data);
          return dataArray.flat();
        }))
        .catch(e => console.log(e));

      res.json({
        dates: LATEST_WEEK,
        data_date: LATEST_DATE,
        locations: LOCATIONS,
        covid_stats: COVID_STATS_DATA,
        covid_gobmx: COVID_GOBMX_DATA
      });
    } catch (e) {
      console.log(e);
    }
  });

};
