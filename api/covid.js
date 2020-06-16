const axios = require("axios");

const BASE_URL = "/api/covid";
const COVID_DAY_ACTUAL = "https://api.datamexico.org/tesseract/data.jsonrecords?Updated+Date=20200610&cube=gobmx_covid&drilldowns=Covid+Result%2CIs+Dead&measures=Cases&parents=false&sparse=false";
const COVID_DAY_BEFORE = "https://api.datamexico.org/tesseract/data.jsonrecords?Updated+Date=20200609&cube=gobmx_covid&drilldowns=Covid+Result%2CIs+Dead&measures=Cases&parents=false&sparse=false";
const COVID_ACTUAL_STATES = "https://api.datamexico.org/tesseract/data.jsonrecords?Updated+Date=20200610&cube=gobmx_covid&drilldowns=Covid+Result%2CState&measures=Cases&parents=false&sparse=false";

module.exports = function (app) {
  app.get(BASE_URL, async (req, res) => {
    try {
      await axios.all([axios.get(COVID_DAY_ACTUAL), axios.get(COVID_DAY_BEFORE), axios.get(COVID_ACTUAL_STATES)]).then(
        axios.spread((resp1, resp2, resp3) => {
          const data_actual = resp1.data.data;
          const data_before = resp2.data.data;

          const data_actual_positive = [...new Set(data_actual.filter(d => d["Covid Result ID"] === 1))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_actual_nonpositive = [...new Set(data_actual.filter(d => d["Covid Result ID"] === 2))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_actual_pending = [...new Set(data_actual.filter(d => d["Covid Result ID"] === 3))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_actual_notdead = [...new Set(data_actual.filter(d => d["Is Dead ID"] === 0))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_actual_dead = [...new Set(data_actual.filter(d => d["Is Dead ID"] === 1))].reduce((acc, item) => acc += item["Cases"], 0);

          const data_before_positive = [...new Set(data_before.filter(d => d["Covid Result ID"] === 1))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_before_nonpositive = [...new Set(data_before.filter(d => d["Covid Result ID"] === 2))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_before_pending = [...new Set(data_before.filter(d => d["Covid Result ID"] === 3))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_before_notdead = [...new Set(data_before.filter(d => d["Is Dead ID"] === 0))].reduce((acc, item) => acc += item["Cases"], 0);
          const data_before_dead = [...new Set(data_before.filter(d => d["Is Dead ID"] === 1))].reduce((acc, item) => acc += item["Cases"], 0);

          const summary = {
            "Total Positive": data_actual_positive,
            "Total Non Positive": data_actual_nonpositive,
            "Total Pending": data_actual_pending,
            "Total Not Dead": data_actual_notdead,
            "Total Dead": data_actual_dead,
            "New Positive": data_actual_positive - data_before_positive,
            "New Non Positive": data_actual_nonpositive - data_before_nonpositive,
            "New Pending": data_actual_pending - data_before_pending,
            "New Not Dead": data_actual_notdead - data_before_notdead,
            "New Dead": data_actual_dead - data_before_dead
          };

          res.json({
            summary: summary,
            geodata: resp3.data.data
          });
        })
      );
    } catch (e) {
      console.log(e);
    }
  });

};
