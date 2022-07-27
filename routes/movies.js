const express = require("express");
const { movie, detail, } = require("../controller/movieController");

const router = express.Router();

router.route("/").get(movie)
router.route("/detail").get(detail)


module.exports = router;
