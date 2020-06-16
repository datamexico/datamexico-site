const axios = require("axios");

const BASE_URL = "/api/covid";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      const MEMBERS = "https://api.datamexico.org/tesseract/members?cube=gobmx_covid&level=Updated%20Date";
      let date = {};
      await axios.get(MEMBERS).then(resp => {
        const today = resp.data.data.reverse()[0];
        date["Reported Date ID"] = today["ID"];
        date["Reported Date"] = today["Label"];
      });

      const COVID_ACTUAL_COUNTRY = `https://api.datamexico.org/tesseract/data.jsonrecords?Reported+Date=${date["Reported Date ID"]}&cube=gobmx_covid_stats&drilldowns=Reported+Date%2CNation&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CCases+Day%2CDeaths+Day%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false`;
      const COVID_ACTUAL_STATES = `https://api.datamexico.org/tesseract/data.jsonrecords?Reported+Date=${date["Reported Date ID"]}&cube=gobmx_covid_stats&drilldowns=Reported+Date%2CState&measures=Daily+Cases%2CDaily+Deaths%2CAccum+Cases%2CAccum+Deaths%2CAVG+7+Days+Daily+Cases%2CAVG+7+Days+Accum+Cases%2CAVG+7+Days+Daily+Deaths%2CAVG+7+Days+Accum+Deaths%2CCases+Day%2CDeaths+Day%2CCases+last+7+Days%2CDeaths+last+7+Days&parents=false&sparse=false`;

      await axios.all([axios.get(COVID_ACTUAL_COUNTRY), axios.get(COVID_ACTUAL_STATES)]).then(
        axios.spread((resp1, resp2) => {
          const data_country = resp1.data.data;
          const data_state = resp2.data.data;

          res.json({
            data_country,
            data_state
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

};
