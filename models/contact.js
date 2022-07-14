const mongoose = require('mongoose')

const url = process.env.MONGODB_URI

console.log('connecting to', url)
mongoose.connect(url)
	.then(res => console.log('connected to MongoDB'))
	.catch(error => console.log('error connecting to MongoDB:', error.Message))

const contactSchema = new mongoose.Schema({
	name: String,
	number: String
})

contactSchema.set('toJSON', {
	transform: (document, contact) => {
		contact.id = contact._id.toString()
		delete contact._id
		delete contact.__v
	}
})

module.exports = mongoose.model('Contact', contactSchema)
