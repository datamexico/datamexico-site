const axios = require("axios");

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);

const BASE_URL = "/api/covid";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      // const LATEST_TIME = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time&measures=Daily+Cases&parents=false&sparse=false&time=time.latest";
      const TIME = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time&measures=Daily+Cases&parents=false&sparse=false";
      let date = {};
      await axios.get(TIME).then(resp => {
        date = resp.data.data.slice().reverse()[1];
      });

      const MEXICO_STATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid_stats&level=State";
      const COVID_HISTORICAL_COUNTRY = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_HISTORICAL_STATES = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time%2CState&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";

      await axios.all([axios.get(MEXICO_STATES), axios.get(COVID_HISTORICAL_COUNTRY), axios.get(COVID_HISTORICAL_STATES)]).then(
        axios.spread((resp1, resp2, resp3) => {
          const locations = resp1.data.data.filter(d => d["Label"] !== "No Informado");
          locations.forEach(d => {
            d["Division"] = "State"
            d["Icon"] = `/icons/visualizations/State/png/white/${d["ID"]}.png`
          });
          locations.unshift({ID: 0, Label: "México", Division: "Country", Icon: "/icons/visualizations/Country/country_mex.png"});
          /*
          states.forEach(d => {
            d["id"] = d["ID"];
            d["name"] = d["Label"];
            delete d["ID"];
            delete d["Label"];
          });
          */

          const data_country_historical = resp2.data.data;
          const data_state_historical = resp3.data.data;
          const data_country = data_country_historical.find(d => d["Time ID"] === date["Time ID"]);
          const data_state = data_state_historical.filter(d => d["Time ID"] === date["Time ID"]);

          res.json({
            locations,
            data_country,
            data_state,
            data_country_historical,
            data_state_historical
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

};
