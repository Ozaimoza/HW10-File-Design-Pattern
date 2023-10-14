const pool = require("../config/connection");

class Movie {
    constructor(id, title, genres, year, photo){
        this.id = id
        this.title = title
        this.genres = genres
        this.year = year
        this.photo = photo

    }

    static showAllMovies (cb){
        pool.query(`SELECT * FROM movies ;`, (err, movies) => {
            if (err){
                callback(err, null)
            } else {
                movies = movies.rows.map(movie => new Movie(movie.id, movie.title, movie.genres, movie.year, movie.photo))

                cb(null, movies)
            }

        })
    }

    static addMovies(dataMovies, cb){
        let query = `
                INSERT INTO "movies" ("title", "genres", "year", "photo") VALUES ($1, $2, $3, $4);
            `;

            let arrData = [dataMovies.title, dataMovies.genres, dataMovies.year, dataMovies.photo];

            pool.query(query, arrData, (err, result) => {
                if(err){
                    cb(err, null);
                }
                else{
                    console.log(`${dataMovies.title} Input successfully`);
                    cb(null, null);
                }
            });
    }

    static editMoviesForm(id, cb){
        const query = `SELECT * FROM movies WHERE id = '${id}';`

        pool.query(query, (err, movies) =>{
            if(err){
                cb(err, null)
            }else{
                // console.log(movies.rows[0])
                cb(null, movies.rows[0]);
            }
        })
    }

    static editMovies(id, dataMovie, cb){
        const query = `UPDATE movies SET title = $1, genres = $2, year = $3, photo = $4 WHERE id = ${id} ;`
        let arrData = [dataMovie.title, dataMovie.genres, dataMovie.year, dataMovie.photo]

        pool.query (query, arrData, (err, result) => {
            if(err){
                cb(err, null)
            }else{
                console.log(`${dataMovie.title} updated successfully`)
                cb(null, null)
            }
        })
    }

    static deleteMovies(id, cb){
        const query = `DELETE FROM movies WHERE id = ${id};`

        pool.query(query, (err, result) =>{
            if(err){
                cb(err, null)
            }else{
                console.log(`Data From ID = ${id} deleted successfully`)
                cb(null, null)
            }
        })
    }

}

module.exports = Movie;
