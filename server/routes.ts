// server/routes.ts

import express from 'express'
import listingRoutes from '@api/routes/listingRoutes'
import locationRoutes from '@api/routes/locationRoutes'

const router = express.Router()

router.use('/listings', listingRoutes)
router.use('/locations', locationRoutes)

// Default route
router.get('/', (req, res) => {
  console.log('\x1b[32m204 No Content.\x1b[0m')
  res.status(204).end()
})

export default router
