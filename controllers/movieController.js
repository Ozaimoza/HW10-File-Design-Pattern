const Movie = require('../models/movieModel.js')
const multerConfig = require('../config/multerConfig.js');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

class movieController {

    static home(req, res){
        res.send("<h1>Welcome to my app</h1>")
    }

    static showALLMovies(req, res){
        Movie.showAllMovies((err, movies) =>{
            if(err){
                res.status(500).send(err)
            }else{
                res.status(200).render("showAllMovies", {movies})
            }
        })
    }

    static addMoviesForm(req, res){
        res.status(200).render("addMovies");
    }

    static addMovies(req, res) {
        
        multerConfig.upload.single('photo')(req, res, (err) => {
            if (err instanceof multer.MulterError) {
                // Handle error dari Multer
                return res.status(500).send(err.message);
            } else if (err) {
                // Handle error lainnya
                return res.status(500).send(err.message);
            }
        
            // Dapatkan file info dari req.file jika berhasil
            const { title, genres, year } = req.body;
            const photopath = req.file ? req.file.path : ''; // Path foto dari Multer
            const photo = photopath.replace(/public\\img\\/, 'img/')
            const dataMovie = {
                title,
                genres,
                year,
                photo
            };
            // console.log(dataMovie)
            Movie.addMovies(dataMovie, (err, movies) => {
                if (err) {
                  res.status(500).send(err)
                } else {
                res.status(200).redirect("/movies");
                }
            });
        });
    }

    static editMoviesForm(req, res){
        Movie.editMoviesForm(req.params.id, (err, movies) => {
            if(err){
                res.status(500).send(err)
            }else{
                res.status(200).render("editMovies", {movies})
            }
        })
    }
    

    static editMovies(req, res) {
        
      multerConfig.upload.single('photo')(req, res, (err) => {
        if (err instanceof multer.MulterError) {
            // Handle error dari Multer
            return res.status(500).send(err.message);
        } else if (err) {
            // Handle error lainnya
            return res.status(500).send(err.message);
        }
    
        // Dapatkan file info dari req.file jika berhasil
        const id = req.params.id
        const { title, genres, year } = req.body;
        const photopath = req.file ? req.file.path : ''; // Path foto dari Multer
        const photo = photopath.replace(/public\\img\\/, 'img/') // replace path default ('\') menjadi ('/')
        const updateData = {
            title,
            genres,
            year,
            photo
        };

          // Lanjutkan dengan proses berikutnya, pengecekan gambar lama
          if (req.file) {
            // Menghapus gambar lama sebelum menyimpan gambar baru
            Movie.editMoviesForm(id, (err, oldMovie) => {
              if (err) {
                return res.status(500).send(err);
              }
    
              if (oldMovie && oldMovie.photo) {
                const oldPhotoPath = path.join('public/', oldMovie.photo);
    
                // Menghapus gambar lama
                fs.unlink(oldPhotoPath, (unlinkErr) => {
                  if (unlinkErr) {
                    console.error('Error deleting old photo:', unlinkErr);
                  }
    
                  // Setelah menghapus gambar lama, update data film dengan gambar baru
                  updateMovieAndRedirect();
                });
              } else {
                // Jika tidak ada gambar lama, langsung update data film dengan gambar baru
                updateMovieAndRedirect();
              }
            });
          } else {
            // Jika tidak ada gambar baru, langsung update data film tanpa penghapusan gambar lama
            updateMovieAndRedirect();
          }

          // Fungsi untuk update data dan redirect
          function updateMovieAndRedirect() {
            // console.log(updateData)
            Movie.editMovies(id, updateData, (err, result) => {
              if (err) {
                res.status(500).send(err)
              } else {
                res.status(200).redirect("/movies");
              }
            });
          }
        });
    }
    


    static deleteMovies(req, res) {
      const id = req.params.id;
  
      // Dapatkan data film sebelum dihapus
      Movie.editMoviesForm(id, (err, movieToDelete) => {
        if (err) {
          return res.status(500).send(err);
        }
  
        // Hapus foto jika ada
        if (movieToDelete && movieToDelete.photo) {
          const photoPath = path.join('public/img', movieToDelete.photo);
  
          // Hapus file foto dari sistem file
          fs.unlink(photoPath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting photo:', unlinkErr);
            }
  
            // Setelah menghapus foto, lanjutkan dengan menghapus data film dari database
            deleteMovieFromDatabase(id);
          });
        } else {
          // Jika tidak ada foto, langsung lanjutkan dengan menghapus data film dari database
          deleteMovieFromDatabase(id);
        }
      });
  
      // Fungsi untuk menghapus data film dari database dan redirect
      function deleteMovieFromDatabase(id) {
        Movie.deleteMovies(id, (err, result) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.status(200).redirect("/movies");
          }
        });
      }
    }



}

module.exports = movieController