const mongoose = require('mongoose');

const gameSchema = new mongoose.Schema({
  title:              { type: String, required: true },
  developer:          { type: String, required: true },
  ESRB:               { type: String, default: 'E' },
  price:              { type: Number, required: true },
  originalPrice:      { type: Number },
  discountPercentage: { type: Number, default: 0 },
  genre:              { type: String },
  genres:             [{ type: String }],
  rating:             { type: Number, default: 0 },
  imageUrl:           { type: String },
  description:        { type: String },
  tags:               [{ type: String }],
  isActive:           { type: Boolean, default: true },
  releaseDate:        { type: Date }
});

module.exports = mongoose.model('Game', gameSchema);
