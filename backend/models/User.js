const mongoose = require("mongoose");
const Joi = require('joi');

const libHelper = require('../lib/helper');
const helper = new libHelper();

const Schema = mongoose.Schema;
const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    unique: true,
    dropDups: true,
    match: /.+\@.+\..+/,
    minlength: 5,
    maxlength: 255
  },
  dob: {
    type: Date | String,
    required: false,
    default: ''
  },
  country_code: {
    type: String,
    minlength: 3,
    maxlength: 3,
  },
  mobile_number: {
    type: String,
    minlength: 10,
    maxlength: 12
  },
  avatar: {
    type: String,
    required: false
  },
  is_deleted: {
    type: Number,
    default: 0
  },
  created_at: {
    type: Date,
    default: helper.convertDate()
  },
  updated_at: {
    type: Date,
    default: helper.convertDate()
  }
});

const User = mongoose.model("User", userSchema);

function validateUser(user) {
  const schema = Joi.object({
    username: Joi.string().min(5).max(50).required().messages({
      'string.empty': `Please enter first name.`,
      'string.min': `First name should have at least 5 characters.`,
      'string.max': `First name should have at most 50 characters.`,
      'any.required': `First name field is required.`
    }),
    email: Joi.string().min(5).max(255).required().email().messages({
      'string.empty': `Please enter email.`,
      'string.min': `Email should have at least 5 characters.`,
      'string.max': `Email should have at most 255 characters.`,
      'string.email': `Please enter valid email.`,
      'any.required': `Email field is required.`
    }),
    dob: Joi.allow(),
    country_code: Joi.allow(),
    mobile_number: Joi.allow()
  }).options({ abortEarly: false });
  const validation = schema.validate(user);
  return validation;
}

exports.User = User;
exports.validate = validateUser;
