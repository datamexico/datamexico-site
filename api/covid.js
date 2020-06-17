const axios = require("axios");

const BASE_URL = "/api/covid";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      const MEMBERS = "https://api.datamexico.org/tesseract/members?cube=gobmx_covid&level=Updated%20Date";
      let date = {};
      await axios.get(MEMBERS).then(resp => {
        const recent = resp.data.data.reverse()[0];
        date["Reported Date ID"] = recent["ID"];
        date["Reported Date"] = recent["Label"];
      });

      const MEXICO_STATES = "https://api.datamexico.org/tesseract/members?cube=gobmx_covid&level=State";
      const COVID_HISTORICAL_COUNTRY = "https://api.datamexico.org/tesseract/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=Reported+Date&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";
      const COVID_HISTORICAL_STATES = "https://api.datamexico.org/tesseract/data.jsonrecords?cube=gobmx_covid_stats&drilldowns=State%2CReported+Date&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false";

      await axios.all([axios.get(MEXICO_STATES), axios.get(COVID_HISTORICAL_COUNTRY), axios.get(COVID_HISTORICAL_STATES)]).then(
        axios.spread((resp1, resp2, resp3) => {
          const states = resp1.data.data;
          states.forEach(d => {
            d["id"] = d["ID"];
            d["name"] = d["Label"];
            delete d["ID"];
            delete d["Label"];
          })
          states.unshift({id: 0, name: "Country"});

          const data_country_historical = resp2.data.data;
          const data_state_historical = resp3.data.data;
          const data_country = data_country_historical.filter(d => d["Reported Date ID"] === date["Reported Date ID"]);
          const data_state = data_state_historical.filter(d => d["Reported Date ID"] === date["Reported Date ID"]);

          res.json({
            states,
            data_country,
            data_state,
            data_country_historical,
            data_state_historical,
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

};
