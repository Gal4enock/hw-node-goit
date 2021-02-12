const mongoose = require('mongoose');
const { Schema } = require('mongoose');
const bcrypt = require('bcryptjs');
const SALT_FACTOR = 6;

const UserSchema = new Schema({
  email: String,
  password: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String
})

UserSchema.pre('save', async function (next) {
  if (this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(SALT_FACTOR))
  next(); 
})

const User = mongoose.model("User", UserSchema);

module.exports = User