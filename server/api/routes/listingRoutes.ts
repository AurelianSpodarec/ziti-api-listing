// server/api/listings/routes/listingRoutes.ts

import { type Request, type Response, Router, type NextFunction } from 'express'
import { listings, listing, createListings } from '../controllers/listingsController'
import { cacheMiddleware } from '../../../../ziti-api/server/middleware/cacheMiddleware'
import { cacheStore, type CustomStore } from '../../../../ziti-api/server/utils/redis'
import verifyJWT from '../../../../ziti-api/server/middleware/auth/verifyJWT'

const listingRoutes: Router = Router()

const asyncCacheMiddleware = (cacheStore: CustomStore) => {
  return (req: Request, res: Response, next: NextFunction) => {
    cacheMiddleware(cacheStore)(req, res, next).catch(next)
  }
}

// List all listings
listingRoutes.get('/', (req, res, next) => {
  listings(req, res).catch(next)
})

// Create a new listing
listingRoutes.post('/', verifyJWT, (req, res, next) => {
  createListings(req, res).catch(next)
})

// Get single listing by ID
listingRoutes.get('/:id', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  listing(req, res).catch(next)
})

export default listingRoutes
