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
    .then(resp => {
      const geoData = resp.data.data.reduce((acc, d) => {
        acc[d["Municipality ID"]] = {"State ID": d["State ID"], "State": d["State"]}
        return acc;
      }, {});
      return geoData;
    })
    .catch(error => {});

  return allData;

};
