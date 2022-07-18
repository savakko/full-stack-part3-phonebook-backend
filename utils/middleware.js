const logger = require('./logger')

/* // morgan logging middleware - not currently in use --->
const morgan = require('morgan')
morgan.token('body', (req) => JSON.stringify(req.body))
const morganLog = morgan(':method :url :status :res[content-length] - :response-time ms :body')
// <--- morgan logging middleware */

const requestLogger = (request, response, next) => {
  logger.info(`--- New request at ${new Date()} ---`)
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError')
    return response.status(400).send({ error: 'malformatted id' })
  if (error.name === 'ValidationError')
    return response.status(400).json({ error: error.message })

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}
