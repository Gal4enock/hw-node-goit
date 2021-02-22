const mongoose = require('mongoose');
const { Schema } = require('mongoose');

const UserSchema = new Schema({
  email: String,
  password: String,
  avatarURL: String,
  subscription: {
    type: String,
    enum: ["free", "pro", "premium"],
    default: "free"
  },
  token: String
})

// UserSchema.pre('save', async function (next) {
//   if (this.isModified('password')) return next();
//   this.password = await bcrypt.hash(this.password, bcrypt.genSaltSync(SALT_FACTOR))
//   next(); 
// })

const User = mongoose.model("User", UserSchema);

module.exports = User