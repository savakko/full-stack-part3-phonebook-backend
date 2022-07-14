require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Contact = require('./models/contact')

const app = express()
app.use(cors())
app.use(express.static('build'))
app.use(express.json())

morgan.token('body', (req, _res) => JSON.stringify(req.body))
app.use(morgan((tokens, req, res) => {
  let body = ''
  if (req.method === 'POST')
    body = tokens.body(req, res)

  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    body
  ].join(' ')
}))


app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${data.length} people<br><br>${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  Contact.find({})
    .then(contacts => res.json(contacts))
})

app.post('/api/persons', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number)
    return res.status(400).json({ error: 'name or number missing' })

  // Deprecated overlap check -- should be refactored
  // if (data.some(p => p.name == body.name))
  //   return res.status(400).json({ error: 'name must be unique' })

  const contact = new Contact({
    name: body.name,
    number: body.number
  })

  contact.save()
    .then(savedContact => res.json(savedContact))
    .catch(error => next(error))
})

app.get('/api/persons/:id', (req, res, next) => {
  Contact.findById(req.params.id)
    .then(contact => {
      if (!contact)
        return res.status(404).end()
      res.json(contact)
    })
    .catch(error => next(error))
})

app.put('/api/persons/:id', (req, res, next) => {
  const body = req.body
  if (!body.name || !body.number)
    return res.status(400).json({ error: 'name or number missing' })

  const contact = {
    name: body.name,
    number: body.number
  }

  Contact.findByIdAndUpdate(req.params.id, contact, { new: true })
    .then(updatedContact => res.json(updatedContact))
    .catch(error => next(error))
})

app.delete('/api/persons/:id', (req, res, next) => {
  Contact.findByIdAndDelete(req.params.id)
    .then(result => res.status(204).end())
    .catch(error => next(error))
})

const errorHandler = (error, req, res, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return res.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})