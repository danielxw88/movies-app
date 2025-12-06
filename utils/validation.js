function validateMovie(body) {
  const errors = {};

  if (!body.name || body.name.trim() === "") {
    errors.name = "Movie name is required.";
  }

  if (!body.description || body.description.trim() === "") {
    errors.description = "Description is required.";
  }

  if (!body.year) {
    errors.year = "Year is required.";
  } else if (isNaN(body.year) || body.year < 1900 || body.year > new Date().getFullYear()) {
    errors.year = "Please enter a valid year.";
  }

  if (!body.genres || body.genres.trim() === "") {
    errors.genres = "At least one genre is required.";
  }

  if (!body.rating) {
    errors.rating = "Rating is required.";
  } else if (isNaN(body.rating) || body.rating < 0 || body.rating > 10) {
    errors.rating = "Rating must be between 0 and 10.";
  }

  if (!body.director || body.director.trim() === "") {
    errors.director = "Director is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateRegister(body) {
  const errors = {};

  if (!body.name || body.name.trim() === "") {
    errors.name = "Name is required.";
  }

  if (!body.email || body.email.trim() === "") {
    errors.email = "Email is required.";
  } else if (!/^\S+@\S+\.\S+$/.test(body.email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (!body.password) {
    errors.password = "Password is required.";
  } else if (body.password.length < 6) {
    errors.password = "Password must be at least 6 characters long.";
  }

  if (!body.confirmPassword) {
    errors.confirmPassword = "Please confirm your password.";
  } else if (body.password !== body.confirmPassword) {
    errors.confirmPassword = "Passwords do not match.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

function validateLogin(body) {
  const errors = {};

  if (!body.email || body.email.trim() === "") {
    errors.email = "Email is required.";
  }

  if (!body.password) {
    errors.password = "Password is required.";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

module.exports = {
  validateMovie,
  validateRegister,
  validateLogin,
};