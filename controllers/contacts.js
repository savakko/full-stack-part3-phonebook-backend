const contactsRouter = require('express').Router()
const Contact = require('../models/contact')

contactsRouter.get('/info', (request, response) => {
  Contact.count({})
    .then(count => response.send(`Phonebook has info for ${count} people<br><br>${new Date()}`))
})

contactsRouter.get('/', (request, response) => {
  Contact.find({})
    .then(contacts => response.json(contacts))
})

contactsRouter.post('/', (request, response, next) => {
  const body = request.body

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => response.json(savedContact))
    .catch(error => next(error))
})

contactsRouter.get('/:id', (request, response, next) => {
  Contact.findById(request.params.id)
    .then(contact => {
      if (!contact)
        return response.status(404).end()
      response.json(contact)
    })
    .catch(error => next(error))
})

contactsRouter.put('/:id', (request, response, next) => {
  const { name, number } = request.body

  Contact.findByIdAndUpdate(
    request.params.id,
    { name, number },
    { new: true, runValidators: true, context: 'query' }
  )
    .then(updatedContact => response.json(updatedContact))
    .catch(error => next(error))
})

contactsRouter.delete('/:id', (request, response, next) => {
  Contact.findByIdAndDelete(request.params.id)
    .then(() => response.status(204).end())
    .catch(error => next(error))
})

module.exports = contactsRouter
