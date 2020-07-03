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
      const COVID_STATS_HISTORICAL_COUNTRY = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time%2CNation&measures=Daily+Cases%2CDaily+Deaths%2CDays+Between+Ingress+and+Death%2CAccum+Cases%2CAccum+Deaths%2CRate+Daily+Cases%2CRate+Accum+Cases%2CRate+Daily+Deaths%2CRate+Accum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+Day%2CDeaths+Day%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_STATS_HISTORICAL_STATES = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time%2CState&measures=Daily+Cases%2CDaily+Deaths%2CDays+Between+Ingress+and+Death%2CAccum+Cases%2CAccum+Deaths%2CRate+Daily+Cases%2CRate+Accum+Cases%2CRate+Daily+Deaths%2CRate+Accum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+Day%2CDeaths+Day%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_MX_COUNTRY = CANON_CMS_CUBES + `/data.jsonrecords?Updated+Date=${date["Time ID"]}&cube=gobmx_covid&drilldowns=Patient+Type%2CAge+Range%2CSex%2CUpdated+Date%2CNation&measures=Cases&parents=false&sparse=false`;
      const COVID_MX_STATES = CANON_CMS_CUBES + `/data.jsonrecords?Updated+Date=${date["Time ID"]}&cube=gobmx_covid&drilldowns=Patient+Type%2CAge+Range%2CSex%2CState%2CUpdated+Date&measures=Cases&parents=false&sparse=false`;

      await axios.all([
        axios.get(MEXICO_STATES),
        axios.get(COVID_STATS_HISTORICAL_COUNTRY),
        axios.get(COVID_STATS_HISTORICAL_STATES),
        axios.get(COVID_MX_COUNTRY),
        axios.get(COVID_MX_STATES)
      ]).then(
        axios.spread((resp1, resp2, resp3, resp4, resp5) => {
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

          const data_stats_historical = [];
          const data_stats_country_historical = resp2.data.data;
          data_stats_country_historical.forEach(d => {
            d["Location ID"] = locations_country["Location ID"];
            d["Location"] = locations_country["Location"];
            d["Division"] = "Country";
            delete d["Nation ID"];
            delete d["Nation"];
          });

          const data_stats_state_historical = resp3.data.data;
          data_stats_state_historical.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            d["Division"] = "State";
            delete d["State ID"];
            delete d["State"];
          });
          data_stats_historical.push(data_stats_country_historical);
          data_stats_historical.push(data_stats_state_historical);

          const data_stats_actual = [];
          const data_stats_country_actual = data_stats_country_historical.find(d => d["Time ID"] === date["Time ID"]);
          const data_stats_state_actual = data_stats_state_historical.filter(d => d["Time ID"] === date["Time ID"]);
          data_stats_actual.push(data_stats_country_actual);
          data_stats_actual.push(data_stats_state_actual);

          const data_covid_mx = [];
          const data_covid_mx_country = resp4.data.data;
          data_covid_mx_country.forEach(d => {
            d["Location ID"] = locations_country["Location ID"];
            d["Location"] = locations_country["Location"];
            d["Division"] = "Country";
            delete d["Nation ID"];
            delete d["Nation"];
          });

          const data_covid_mx_states = resp5.data.data;
          data_covid_mx_states.forEach(d => {
            d["Location ID"] = d["State ID"];
            d["Location"] = d["State"];
            d["Division"] = "State";
            delete d["State ID"];
            delete d["State"];
          });
          data_covid_mx.push(data_covid_mx_country);
          data_covid_mx.push(data_covid_mx_states);

          res.json({
            data_covid_mx: data_covid_mx.flat(),
            data_stats_actual: data_stats_actual.flat(),
            data_stats_historical: data_stats_historical.flat(),
            locations: locations.flat()
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

};
