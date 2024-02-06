// server/api/properties/routes/propertyRoutes.ts

import { type Request, type Response, Router, type NextFunction } from 'express'
import { properties, property, createProperty } from '../controllers/propertiesController'
import { asyncMiddleware } from '@utils/asyncMiddleware'
import { cacheMiddleware } from '@middleware/cacheMiddleware'
import { cacheStore } from '@utils/redis'
import verifyJWT from '@middleware/auth/verifyJWT'

const propertyRoutes: Router = Router()

// List all properties
propertyRoutes.get('/', (req: Request, res: Response, next: NextFunction) => {
  properties(req, res).catch(next)
})

// Create a new property
propertyRoutes.post('/', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
  createProperty(req, res).catch(next)
})

// Get single property by ID
propertyRoutes.get('/:id', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  property(req, res).catch(next)
})

export default propertyRoutes
