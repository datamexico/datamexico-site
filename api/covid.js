const axios = require("axios");

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);

const BASE_URL = "/api/covid";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      /* Use if is's a problem with time.latest */
      /*
      const TIME = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time&measures=Daily+Cases&parents=false&sparse=false";
      let date = {};
      await axios.get(TIME).then(resp => {
        date = resp.data.data.slice().reverse()[1];
      });
      */
      const LATEST_TIME = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time&measures=Daily+Cases&parents=false&sparse=false&time=time.latest";
      let date = {};
      await axios.get(LATEST_TIME).then(resp => {
        date = resp.data.data[0];
      });

      const MEXICO_STATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid_stats&level=State";
      const COVID_HISTORICAL_COUNTRY = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_HISTORICAL_STATES = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time%2CState&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";

      await axios.all([axios.get(MEXICO_STATES), axios.get(COVID_HISTORICAL_COUNTRY), axios.get(COVID_HISTORICAL_STATES)]).then(
        axios.spread((resp1, resp2, resp3) => {
          const locations = [];
          const locations_country = {"Location ID": 0, Location: "México", Division: "Country", Icon: "/icons/visualizations/covid/mexico-flag.svg"};
          const locations_states = resp1.data.data.filter(d => d["Label"] !== "No Informado");
          locations_states.forEach(d => {
            d["Location ID"] = d["ID"];
            d["Location"] = d["Label"];
            d["Division"] = "State";
            d["Icon"] = `/icons/visualizations/State/png/white/${d["ID"]}.png`;
            delete d["ID"];
            delete d["Label"];
          });
          locations.push(locations_country);
          locations.push(locations_states);

          const data_historical = [];
          const data_country_historical = resp2.data.data;
          data_country_historical.forEach(d => {
            d["Location ID"] = locations_country["Location ID"];
            d["Location"] = locations_country["Location"];
            d["Division"] = "Country";
          });

          const data_state_historical = resp3.data.data;
          data_state_historical.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            d["Division"] = "State";
            delete d["State ID"];
            delete d["State"];
          });
          data_historical.push(data_country_historical);
          data_historical.push(data_state_historical);

          const data_actual = [];
          const data_country_actual = data_country_historical.find(d => d["Time ID"] === date["Time ID"]);
          const data_state_actual = data_state_historical.filter(d => d["Time ID"] === date["Time ID"]);
          data_actual.push(data_country_actual);
          data_actual.push(data_state_actual);

          res.json({
            locations: locations.flat(),
            data_actual: data_actual.flat(),
            data_historical: data_historical.flat()
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

};
