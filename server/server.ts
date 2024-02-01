// server/server.ts

// Ensure environment is configured before importing any other modules
import '@utils/configureEnvironment'

import cors from 'cors'
import cookieParser from 'cookie-parser'
import express from 'express'
import listingDB from './listingDB'
import { getRequiredEnvVariable } from './utils/getRequiredEnvVariable'
import routes from './routes'
import customPoweredBy from './middleware/customPoweredBy'
import { consoleLogging } from './middleware/consoleLogging'
import { errorHandling } from './middleware/errorHandling'
import { handle404 } from './middleware/handle404'

// CORS options configuration
const corsOptions = {
  // Function to dynamically set allowed origins based on incoming request
  origin: (
    origin: string | undefined,
    callback: (error: Error | null, allow?: boolean) => void
  ) => {
    // Retrieve list of allowed domains from an environment variable
    const allowedDomains = getRequiredEnvVariable('ALLOWED_ORIGINS').split(',')

    if (process.env.NODE_ENV !== 'production') {
      // Allow all origins in non-production environments
      console.log(`\x1b[32mAllowed origin (non-production): ${origin}\x1b[0m`)
      callback(null, true)
    } else if (origin !== undefined && allowedDomains.includes(origin)) {
      // In production, check against the list of allowed origins
      console.log(`\x1b[32mAllowed origin: ${origin}\x1b[0m`)
      callback(null, true)
    } else {
      // Block origins not in the allowed list
      console.log(`\x1b[31mBlocked origin: ${origin}\x1b[0m`)
      callback(new Error('403: Origin not permitted by CORS policy'), false)
    }
  },
  // Enable credentials (cookies) for CORS requests
  credentials: true
}

const server = express()

// Console logging middleware
server.use(consoleLogging)

// server.disable('x-powered-by');
server.use(customPoweredBy(getRequiredEnvVariable('POWERED_BY')))

// Apply CORS middleware with custom options
server.use(cors(corsOptions))

// Handle preflight requests (OPTIONS)
server.options('*', cors(corsOptions))

// Parse incoming JSON payloads
server.use(express.json())

// Parse cookies
server.use(cookieParser())

// Standard DB Processing
listingDB.sequelizeAuth
  .sync({ force: false })
  .then(() => {
    console.log('\x1b[32mSynced ListingDB.\x1b[0m')
  })
  .catch((err: Error) => {
    console.log('\x1b[31mFailed to sync db: ' + err.message + '\x1b[0m')
  })

// Routes
server.use(routes)

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

// Error handling middleware
server.use(errorHandling)
