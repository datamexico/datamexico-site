const axios = require("axios");
const tiles = require("../app/helpers/homeTiles");

module.exports = function(app) {

  app.get("/api/tiles", async(req, res) => {
    const origin = `${req.protocol}://${req.headers.host}`;
    const {query} = req;

    const output = {};
    const tileKeys = Object.keys(tiles);
    for (const tile of tileKeys) {
      output[tile] = [];
      const tileItem = tiles[tile];
      const locale = query.locale || "en";
      const {dimension} = tileItem;
      for (const item of tileItem.items) {
        const id = item;
        const data = await axios.get(`${origin}/api/search?id=${id}&dimension=${dimension}&locale=${locale}`)
          .then(resp => resp.data.results[0]);
        output[tile].push(data);
      }
    }

    res.json(output).end();
  });

};
