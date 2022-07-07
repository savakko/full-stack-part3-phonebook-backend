const express = require('express')
const morgan = require('morgan')

const app = express()
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

let data = [
  {
    id: 1,
    name: 'Arto Hellas',
    number: '040-123456'
  },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523'
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345'
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122'
  }
]

const generateId = () => {
  const maxId = data.length > 0
    ? Math.max(...data.map(p => p.id))
    : 0
  return maxId + 1
}

app.get('/info', (req, res) => {
  res.send(`Phonebook has info for ${data.length} people<br><br>${new Date()}`)
})

app.get('/api/persons', (req, res) => {
  res.json(data)
})

app.post('/api/persons', (req, res) => {
  const body = req.body
  if (!body.name || !body.number)
    return res.status(400).json({ error: 'name or number missing' })
  if (data.some(p => p.name == body.name))
    return res.status(400).json({ error: 'name must be unique' })

  const person = {
    id: generateId(),
    name: body.name,
    number: body.number
  }

  data = data.concat(person)
  res.json(person)
})

app.get('/api/persons/:id', (req, res) => {
  const id = req.params.id
  const person = data.find(p => p.id == id)
  if (!person)
    return res.status(404).end()

  res.json(person)
})

app.delete('/api/persons/:id', (req, res) => {
  const id = req.params.id
  data = data.filter(p => p.id != id)
  res.status(204).end()
})
  
const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})