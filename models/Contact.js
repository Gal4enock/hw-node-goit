const mongoose = require('mongoose');
const { Schema } = mongoose;

const ContactSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: String,
    unique: true,
    validate: (value) => value.includes("@"),
  },
  phone: {
    type: Number,
    required: true
  }
})

const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;