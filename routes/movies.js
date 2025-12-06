const express = require('express');
const router = express.Router();
const Movie = require('../models/Movie');
const { isLoggedIn, isOwner } = require('../middleware/auth');
const { validateMovie } = require('../utils/validation');

router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find({});
    res.render('movies/index', { movies });
  } catch (err) {
    console.error("Error fetching movies:", err);
    res.status(500).send("Server error");
  }
});

router.get('/new', isLoggedIn, (req, res) => {
  res.render('movies/new', { errors: [] });
});

router.post('/', isLoggedIn, async (req, res) => {
  const { isValid, errors } = validateMovie(req.body);

  if (!isValid) {
    const errorMessages = Object.values(errors);
    return res.render('movies/new', {
      errors: errorMessages,
    });
  }

  try {
    const { name, description, year, genres, rating, director } = req.body;
    const newMovie = new Movie({
      name,
      description,
      year,
      genres,
      rating,
      director,
      user: req.session.user._id,
    });

    await newMovie.save();
    res.redirect('/movies');
  } catch (err) {
    console.error("Error creating movie:", err);
    res.status(500).send("Server error");
  }
});

router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.render('movies/show', { movie });
  } catch (err) {
    console.error("Error fetching movie:", err);
    res.status(500).send("Server error");
  }
});

router.get('/:id/edit', isLoggedIn, isOwner, async (req, res) => {
  try {
    const movie = req.movie || await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).send("Movie not found");
    }
    res.render('movies/edit', { movie, errors: [] });
  } catch (err) {
    console.error("Error loading edit page:", err);
    res.status(500).send("Server error");
  }
});

router.put('/:id', isLoggedIn, isOwner, async (req, res) => {
  const { isValid, errors } = validateMovie(req.body);

  if (!isValid) {
    const errorMessages = Object.values(errors);
    const movie = { ...req.body, _id: req.params.id };
    return res.render('movies/edit', {
      movie,
      errors: errorMessages,
    });
  }

  try {
    const { name, description, year, genres, rating, director } = req.body;

    await Movie.findByIdAndUpdate(
      req.params.id,
      { name, description, year, genres, rating, director },
      { new: true }
    );

    res.redirect(`/movies/${req.params.id}`);
  } catch (err) {
    console.error("Error updating movie:", err);
    res.status(500).send("Server error");
  }
});

router.delete('/:id', isLoggedIn, isOwner, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    res.redirect('/movies');
  } catch (err) {
    console.error("Error deleting movie:", err);
    res.status(500).send("Server error");
  }
});

module.exports = router;