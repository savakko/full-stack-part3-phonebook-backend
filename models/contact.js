const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    minlength: 3,
    required: true,
    unique: true
  },
  number: {
    type: String,
    minlength: 8,
    validate: { validator: (num) => /\b\d{2,3}-\d{6}/.test(num) },
    required: true
  }
})

contactSchema.plugin(uniqueValidator)

contactSchema.set('toJSON', {
  transform: (document, contact) => {
    contact.id = contact._id.toString()
    delete contact._id
    delete contact.__v
  }
})

module.exports = mongoose.model('Contact', contactSchema)
