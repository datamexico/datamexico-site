const axios = require("axios");

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);

const BASE_URL = "/api/covid";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      // Gets the latest data of all the gobmx_covid datasets
      const DATASETS_DATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Updated Date";
      const LATEST_WEEK = await axios.get(DATASETS_DATES).then(resp => {
        const dateArray = resp.data.data.reverse().slice(0, 7);
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
      const COVID_STATS_MEASURES = "Daily Cases,Daily Deaths,Daily Hospitalized,Daily Suspect,Accum Cases,Accum Deaths,Accum Hospitalized,Accum Suspect,Days Between Ingress and Death,New Cases Report,New Deaths Report,New Hospitalized Report,New Suspect Report,Accum Cases Report,Accum Deaths Report,Accum Hospitalized Report,Accum Suspect Report,AVG 7 Days Daily Cases,AVG 7 Days Accum Cases,AVG 7 Days Daily Deaths,AVG 7 Days Accum Deaths,AVG 7 New Cases Report,AVG 7 Accum Cases Report,AVG 7 New Deaths Report,AVG 7 Accum Deaths Report,Last 7 Daily Cases,Last 7 Daily Deaths,Last 7 Accum Cases,Last 7 Accum Deaths,Last 7 New Cases Report,Last 7 Accum Cases Report,Last 7 New Deaths Report,Last 7 Accum Deaths Report,Rate Daily Cases,Rate Accum Cases,Rate Daily Deaths,Rate Accum Deaths,Rate New Cases Report,Rate Accum Cases Report,Rate New Deaths Report,Rate Accum Deaths Report,Days from 50 Cases,Days from 10 Deaths";
      const COVID_STATS_NATION = CANON_CMS_CUBES + `/data.jsonrecords?cube=gobmx_covid_stats_nation&drilldowns=Geography+Nation%2CTime&measures=${COVID_STATS_MEASURES}&parents=false&sparse=false`
      const COVID_STATS_STATES = CANON_CMS_CUBES + `/data.jsonrecords?cube=gobmx_covid_stats_state&drilldowns=State%2CTime&measures=${COVID_STATS_MEASURES}&parents=false&sparse=false`
      const COVID_STATS_DATA = await axios
        .all([axios.get(COVID_STATS_NATION), axios.get(COVID_STATS_STATES)])
        .then(axios.spread((...resp) => {
          resp[0].data.data.forEach(d => {
            d["Location ID"] = d["Geography Nation ID"];
            d["Location"] = d["Geography Nation"];
            delete d["Geography Nation ID"];
            delete d["Geography Nation"];
          });
          resp[1].data.data.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            delete d["State ID"];
            delete d["State"];
          });
          const dataArray = resp.map(d => d.data.data);
          return dataArray.flat();
        }))
        .catch(e => console.log(e));

      // Gets the most recent data from the gobmx_covid cube
      const COVID_GOBMX_DRILLDOWNS = "Updated Date,Covid Result,Patient Type,Age Range,Sex";
      const COVID_GOBMX_NATION = CANON_CMS_CUBES + `/data.jsonrecords?Updated+Date=${LATEST_DATE["Time ID"]}&cube=gobmx_covid&drilldowns=${COVID_GOBMX_DRILLDOWNS + ",Nation"}&measures=Cases&parents=false&sparse=false`;
      const COVID_GOBMX_STATES = CANON_CMS_CUBES + `/data.jsonrecords?Updated+Date=${LATEST_DATE["Time ID"]}&cube=gobmx_covid&drilldowns=${COVID_GOBMX_DRILLDOWNS + ",State"}&measures=Cases&parents=false&sparse=false`;
      const COVID_GOBMX_DATA = await axios
        .all([axios.get(COVID_GOBMX_NATION), axios.get(COVID_GOBMX_STATES)])
        .then(axios.spread((...resp) => {
          resp[0].data.data.forEach(d => {
            d["Location ID"] = d["Nation ID"];
            d["Location"] = d["Nation"];
            delete d["Nation ID"];
            delete d["Nation"];
          });
          resp[1].data.data.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            delete d["State ID"];
            delete d["State"];
          });
          const dataArray = resp.map(d => d.data.data);
          return dataArray.flat();
        }))
        .catch(e => console.log(e));

      res.json({
        dates: LATEST_WEEK,
        locations: LOCATIONS,
        covid_stats: COVID_STATS_DATA,
        covid_gobmx: COVID_GOBMX_DATA
      });
    } catch (e) {
      console.log(e);
    }
  });

};
