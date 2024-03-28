// server/server.ts

// Ensure environment is configured before importing any other modules
import '@utils/configureEnvironment'

import cookieParser from 'cookie-parser'
import express from 'express'
import listingDB from './listingDB'
import { getRequiredEnvVariable } from './utils/getRequiredEnvVariable'
import './utils/redis'
import routes from './routes'
import customPoweredBy from './middleware/customPoweredBy'
import { consoleLogging } from './middleware/consoleLogging'
import { errorHandling } from './middleware/errorHandling'
import { handle404 } from './middleware/handle404'
import { initSentry, sentryErrorHandler } from '@utils/sentry'
import { corsMiddleware } from './middleware/corsMiddleware'

const server = express()

// Initialize Sentry
initSentry(server)

// Console logging middleware
server.use(consoleLogging)

// server.disable('x-powered-by');
server.use(customPoweredBy(getRequiredEnvVariable('POWERED_BY')))

// Apply custom CORS middleware
server.use(corsMiddleware)

// Parse incoming JSON payloads
server.use(express.json())

// Parse cookies
server.use(cookieParser())

// Standard DB Processing
listingDB.sequelizeProperty
  .sync({ force: false })
  .then(() => {
    console.log('\x1b[32mSynced listingDB.\x1b[0m')
  })
  .catch((err: Error) => {
    console.log('\x1b[31mFailed to sync listingDB: ' + err.message + '\x1b[0m')
  })

// Routes
server.use('/api/v1', routes)

// 404 logging
server.use(handle404)

const host = getRequiredEnvVariable('HOST')
const port = getRequiredEnvVariable('PORT')

server.listen(port, () => {
  const message = `[server]: Server is running at http://${host}:${port}`
  const greenMessage = `\x1b[32m${message}\x1b[0m`
  console.log(greenMessage)
}).on('error', (err) => {
  const errorMessage = `\x1b[31mFailed to start server: ${err.message}\x1b[0m` // Red text
  console.error(errorMessage)
})

// Use Sentry's error handler
server.use(sentryErrorHandler())

// Error handling middleware
server.use(errorHandling)
