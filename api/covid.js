const axios = require("axios");

let {CANON_CMS_CUBES} = process.env;
if (CANON_CMS_CUBES.substr(-1) === "/") CANON_CMS_CUBES = CANON_CMS_CUBES.substr(0, CANON_CMS_CUBES.length - 1);

const BASE_URL = "/api/covid";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      // Gets the latest data of all the gobmx_covid datasets
      const DATASETS_DATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Updated Date";
      const LATEST_DATE = await axios.get(DATASETS_DATES).then(resp => resp.data.data.reverse()[0]);

      // Gets all the data from the mexican geo divisions
      const MEXICO_NATION = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Nation";
      const MEXICO_STATES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=State";
      const MEXICO_MUNICIPALITIES = CANON_CMS_CUBES + "/members?cube=gobmx_covid&level=Municipality";

      const LOCATIONS = await axios
        .all([axios.get(MEXICO_NATION), axios.get(MEXICO_STATES), axios.get(MEXICO_MUNICIPALITIES)])
        .then(axios.spread((...resp) => {
          resp[0].data.data.forEach(d => {
            d["Division"] = "Nation";
            d["Icon"] = "/icons/visualizations/Nation/svg/mexico-flag.svg";
          });
          resp[1].data.data.forEach(d => {
            d["Division"] = "State";
            d["Icon"] = `/icons/visualizations/State/png/white/${d["ID"]}.png`;
          });
          resp[2].data.data.forEach(d => {
            d["Division"] = "Municipality";
            d["Icon"] = `/icons/visualizations/State/png/white/${d["ID"].toString().slice(0, -3)}.png`;
          });
          const locationArray = resp.map(d => d.data.data.filter(d => d["Label"] !== "No Informado"));
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
              d["ID"] = d["Geography Nation ID"];
              d["Label"] = d["Geography Nation"];
              delete d["Geography Nation ID"];
              delete d["Geography Nation"];
            });
            resp[1].data.data.forEach(d => {
              d["ID"] = d["State ID"];
              d["Label"] = d["State"];
              delete d["State ID"];
              delete d["State"];
            })
            const dataArray = resp.map(d => d.data.data);
            return dataArray.flat();
          }))
          .catch(e => console.log(e));

        // Gets the most recent data from the gobmx_covid cube

      res.json({
        date: LATEST_DATE,
        locations: LOCATIONS,
        covid_stats: COVID_STATS_DATA
      });

      /*
      const COVID_STATS_HISTORICAL_COUNTRY = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time%2CNation&measures=Daily+Cases%2CDaily+Deaths%2CDays+Between+Ingress+and+Death%2CAccum+Cases%2CAccum+Deaths%2CRate+Daily+Cases%2CRate+Accum+Cases%2CRate+Daily+Deaths%2CRate+Accum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+Day%2CDeaths+Day%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_STATS_HISTORICAL_STATES = CANON_CMS_CUBES + "/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Time%2CState&measures=Daily+Cases%2CDaily+Deaths%2CDays+Between+Ingress+and+Death%2CAccum+Cases%2CAccum+Deaths%2CRate+Daily+Cases%2CRate+Accum+Cases%2CRate+Daily+Deaths%2CRate+Accum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CDays+from+50+Cases%2CDays+from+10+Deaths%2CCases+Day%2CDeaths+Day%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_MX_COUNTRY = CANON_CMS_CUBES + `/data.jsonrecords?Covid+Result=1&Updated+Date=${date["Time ID"]}&cube=gobmx_covid&drilldowns=Patient+Type%2CAge+Range%2CSex%2CUpdated+Date%2CCovid+Result%2CNation&measures=Cases&parents=false&sparse=false`;
      const COVID_MX_STATES = CANON_CMS_CUBES + `/data.jsonrecords?Covid+Result=1&Updated+Date=${date["Time ID"]}&cube=gobmx_covid&drilldowns=Patient+Type%2CAge+Range%2CSex%2CState%2CUpdated+Date%2CCovid+Result&measures=Cases&parents=false&sparse=false`;
      */

      /*
      await axios.all([
        axios.get(COVID_MX_COUNTRY),
        axios.get(COVID_MX_STATES)
      ]).then(
        axios.spread((resp4, resp5) => {
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
      */
    } catch (e) {
      console.log(e);
    }
  });

};
