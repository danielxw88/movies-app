const Movie = require("../models/Movie");

function isLoggedIn(req, res, next) {
  if (!req.session || !req.session.user) {
    return res.redirect("/auth/login");
  }
  next();
}

async function isOwner(req, res, next) {
  try {
    const movieId = req.params.id;
    const movie = await Movie.findById(movieId);

    if (!movie) {
      return res.status(404).send("Movie not found");
    }

    if (
      !req.session.user ||
      !movie.user ||
      movie.user.toString() !== req.session.user._id.toString()
    ) {
      return res.status(403).send("You are not allowed to modify this movie.");
    }

    req.movie = movie; // store movie for next middleware
    next();
  } catch (err) {
    console.error("isOwner error:", err);
    res.status(500).send("Server error");
  }
}





module.exports = {
  isLoggedIn,
  isOwner,
};