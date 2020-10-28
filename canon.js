/**
    The object that this file exports is used to set configurations for canon
    and it's sub-modules.
*/
module.exports = {
  db: [
    {
      host: process.env.CANON_DB_HOST,
      name: process.env.CANON_DB_NAME,
      user: process.env.CANON_DB_USER,
      pass: process.env.CANON_DB_PW,
      tables: [
        require("@datawheel/canon-core/models"),
        require("@datawheel/canon-cms/models")
      ]
    }
  ]
};
