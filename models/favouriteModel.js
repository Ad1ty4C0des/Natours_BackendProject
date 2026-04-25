const mongoose = require('mongoose');

const favouriteSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjectId,
    ref: 'Tour',
    required: [true, 'Favourite must belong to a tour!'],
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Favourite must belong to a user!'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Each user can only favourite a tour once
favouriteSchema.index({ tour: 1, user: 1 }, { unique: true });

favouriteSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'tour',
    select: 'name slug imageCover duration difficulty maxGroupSize price summary ratingsAverage startDates startLocation locations',
  });
  next();
});

const Favourite = mongoose.model('Favourite', favouriteSchema);

module.exports = Favourite;
