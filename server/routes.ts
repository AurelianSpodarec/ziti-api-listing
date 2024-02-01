// server/routes.ts

import express from 'express'

const router = express.Router()

// Default route
router.get('/', (req, res) => {
  console.log('\x1b[32m204 No Content.\x1b[0m')
  res.status(204).end()
})

export default router
