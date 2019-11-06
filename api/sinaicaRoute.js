const Sequelize = require("sequelize"),
      axios = require("axios");

const BASE_URL = "https://api.datos.gob.mx/v2/sinaica";

module.exports = function(app) {

  app.get("/api/sinaica/data?:id", (req, res) => {
    // &date>=2018-04-19&date<=2018-04-20
    const date = new Date();
    const today = date.toISOString().split("T")[0];
    date.setDate(date.getDate() - 1);
    const yesterday = date.toISOString().split("T")[0];
    date.setDate(date.getDate() - 1);
    const beforeYesterday = date.toISOString().split("T")[0];
    console.log(today, yesterday);
    const {id} = req.params;
    const time = undefined;

    const query = [];
    if (time && time === "today") {
      query.push(`date>=${yesterday}&date<=${today}`);
    }
    else if (time && time === "yesterday") {
      query.push(`date>=${beforeYesterday}&date<=${yesterday}`);
    }

    axios.get(`${BASE_URL}?pageSize=5000&date>=${yesterday}&date<=${today}`).then(resp => {
      const data = resp.data;
      res.json({data: data.results}).end();
    });

  });

};
