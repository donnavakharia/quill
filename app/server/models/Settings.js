var mongoose = require('mongoose');

/**
 * Settings Schema!
 *
 * Fields with select: false are not public.
 * These can be retrieved in controller methods.
 *
 * @type {mongoose}
 */
var schema = new mongoose.Schema({
  status: String,
  timeOpen: {
    type: Number,
    default: 1549952797000
  },
  timeClose: {
    type: Number,
    default: 1552460400000 // Add a year from now.
  },
  timeConfirm: {
    type: Number,
    default: 1552460400000 // Date of confirmation
  },
  whitelistedEmails: {
    type: [String],
    select: false,
    default: ['paypal.com'],
  },
  waitlistText: {
    type: String
  },
  acceptanceText: {
    type: String,
  },
  confirmationText: {
    type: String
  },
  allowMinors: {
    type: Boolean
  }
});

/**
 * Get the list of whitelisted emails.
 * Whitelist emails are by default not included in settings.
 * @param  {Function} callback args(err, emails)
 */
schema.statics.getWhitelistedEmails = function(callback){
  this
    .findOne({})
    .select('whitelistedEmails')
    .exec(function(err, settings){
      return callback(err, settings.whitelistedEmails);
    });
};

/**
 * Get the open and close time for registration.
 * @param  {Function} callback args(err, times : {timeOpen, timeClose, timeConfirm})
 */
schema.statics.getRegistrationTimes = function(callback){
  this
    .findOne({})
    .select('timeOpen timeClose timeConfirm')
    .exec(function(err, settings){
      callback(err, {
        timeOpen: settings.timeOpen,
        timeClose: settings.timeClose,
        timeConfirm: settings.timeConfirm
      });
    });
};

schema.statics.getPublicSettings = function(callback){
  this
    .findOne({})
    .exec(callback);
};

module.exports = mongoose.model('Settings', schema);
