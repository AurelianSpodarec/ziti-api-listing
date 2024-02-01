// server/api/listings/routes/listingRoutes.ts

import { type Request, type Response, Router, type NextFunction } from 'express'
import { listings, listing, createListings } from '../controllers/listingsController'
import { cacheMiddleware } from '../../../../ziti-api/server/middleware/cacheMiddleware'
import verifyJWT from '../../../../ziti-api/server/middleware/auth/verifyJWT'

const listingRoutes: Router = Router()

// List all listings
listingRoutes.get('/', (req: Request, res: Response, next: NextFunction) => {
  listings(req, res).catch(next)
})

// Create a new listing
listingRoutes.post('/', verifyJWT, (req: Request, res: Response, next: NextFunction) => {
  createListings(req, res).catch(next)
})

// Get single listing by ID
listingRoutes.get('/:id', cacheMiddleware, (req: Request, res: Response, next: NextFunction) => {
  listing(req, res).catch(next)
})

export default listingRoutes
