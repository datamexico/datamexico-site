const path = require("path");
const spawn = require("child_process").spawn;

module.exports = function(app) {

  app.get("/api/eci", (req, res) => {
    const pyFilePath = path.join(__dirname, "..", "calc/rcas.py");
    const py = spawn(
      "python3",
      ["-W", "ignore", pyFilePath, JSON.stringify(req.query), "https://api.datamexico.org/tesseract/data"]
    );
    let respString = "";

    // build response string based on results of python script
    py.stdout.on("data", data => respString += data.toString());
    // catch errors
    py.stderr.on("data", data => console.error(`\nstderr:\n${data}`));
    // return response
    py.stdout.on("end", () => {
      try {
        const dataResult = JSON.parse(respString);
        return res.json(dataResult);
      }
      catch (e) {
        console.error(`Caught Error in ${"entityType"} Prediciton JSON conversion:\n${e}`);
        console.log(`\nrespString:\n${respString}`);
        return res.json({error: e});
      }
    });
  });

  app.get("/api/density", (req, res) => {
    const pyFilePath = path.join(__dirname, "..", "calc/test.py");
    const py = spawn(
      "python3",
      ["-W", "ignore", pyFilePath, JSON.stringify(req.query), "https://api.datamexico.org/tesseract/data"]
    );
    let respString = "";

    // build response string based on results of python script
    py.stdout.on("data", data => respString += data.toString());
    // catch errors
    py.stderr.on("data", data => console.error(`\nstderr:\n${data}`));
    // return response
    py.stdout.on("end", () => {
      try {
        const dataResult = JSON.parse(respString);
        return res.json(dataResult);
      }
      catch (e) {
        console.error(`Caught Error in ${"entityType"} Prediciton JSON conversion:\n${e}`);
        console.log(`\nrespString:\n${respString}`);
        return res.json({error: e});
      }
    });
  });

};
