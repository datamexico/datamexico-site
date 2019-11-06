const axios = require("axios");

const loadJSON = require("../utils/loadJSON");
const selfCity = loadJSON("/static/json/self_city.json");


module.exports = function(app) {

  app.get("/api/enoe/:id", (req, res) => {
    // &date>=2018-04-19&date<=2018-04-20
    const {params, query} = req;
    const {id} = params;

    const hierarchy = id * 1 <= 32 && id * 1 >= 1 ? "State" : "Municipality";
    const entId = (id - id % 1000) / 1000;
    const data = selfCity.filter(d => d.mun_id === id * 1);

    if (!("drilldowns" in query)) query.drilldowns = "";

    const ids = data.map(d => d.self_city_id);
    if (ids && ids.length > 0) {
      query["Self Represented City"] = ids.join(",");
      query.drilldowns += "Self Represented City";
    }
    else {
      query.State = entId;
      query.drilldowns += "State";
    }

    const _query = Object.keys(query).map(d => `${d}=${query[d]}`).join("&");

    const api = `https://api.datamexico.org/tesseract/data?cube=inegi_enoe&${_query}`;
    axios.get(api).then(resp => {
      res.json(resp.data).end();
    });

    // res.json({data}).end();

  });

};
