const express = require("express");

const router = express.Router();

const Controller = require("../controllers/movieController");

const movieRouter = require("./movie");

router.get("/", Controller.home);

router.use("/movies", movieRouter);

module.exports = router;