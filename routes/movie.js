const express = require("express");
const router = express.Router();
const movieController = require("../controllers/movieController");

router.get("/", movieController.showALLMovies);

router.route ('/add')
        .get( movieController.addMoviesForm)
        .post( movieController.addMovies)

router.route ('/:id/edit')
        .get( movieController.editMoviesForm)
        .put( movieController.editMovies)

router.delete('/:id/delete', movieController.deleteMovies)

module.exports = router;