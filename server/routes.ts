// server/routes.ts

import express from 'express'
import propertyRoutes from '@api/routes/propertyRoutes'
import locationRoutes from '@api/routes/locationRoutes'

const router = express.Router()

router.use('/properties', propertyRoutes)
router.use('/locations', locationRoutes)

// Default route
router.get('/', (req, res) => {
  console.log('\x1b[32m204 No Content.\x1b[0m')
  res.status(204).end()
})

// Health check endpoint
router.get('/health', (req, res) => {
  // Here you can add checks for your app's health (e.g., database connection)
  res.status(200).send('OK')
})

export default router
