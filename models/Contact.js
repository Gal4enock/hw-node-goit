const mongoose = require('mongoose');
const { Schema } = mongoose;
const mongoosePaginate = require('mongoose-paginate-v2');

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

ContactSchema.plugin(mongoosePaginate);
const Contact = mongoose.model("Contact", ContactSchema);

module.exports = Contact;