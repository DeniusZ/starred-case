var express = require("express");
var router = express.Router();
var db = require("../../db/db.js");

/* GET users listing. */
router.get("/", function (req, res, next) {
  db.all("SELECT * FROM user", (error, rows) => {
    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      data: rows,
      error: {},
    });
  });
});

module.exports = router;
