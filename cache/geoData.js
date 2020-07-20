const axios = require("axios");
const {CANON_CMS_CUBES} = process.env;
const BASE_API = `${CANON_CMS_CUBES}data`;


module.exports = async function() {

  const params = {
    cube: "inegi_population",
    drilldowns: "Municipality",
    measures: "Population",
    parents: true
  }
  const allData = await axios.get(BASE_API, {params})
    .then(resp => resp.data.data)
    .catch(error => []);

  return allData;

};
