const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },

  description: {
    type: String,
    required: true,
    index: true,
    trim: true,
  },

  year: {
    type: Number,
    required: true,
    min: 1888,
    max: 2100,
    index: true,
  },

  genres: {
    type: String,
    required: true,
    trim: true,
  },

  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
    index: true,
  },

  director: {
    type: String,
    trim: true,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;