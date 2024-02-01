// server/api/listings/routes/locationRoutes.ts

import { type Request, type Response, Router, type NextFunction } from 'express'
import { countries, country, provinces, province, municipalities, municipality, sectors, sector } from '@api/controllers/locationsController'
import { cacheMiddleware } from '@middleware/cacheMiddleware'
import { cacheStore, type CustomStore } from '@utils/redis'

const locationRoutes: Router = Router()

const asyncCacheMiddleware = (cacheStore: CustomStore) => {
  return (req: Request, res: Response, next: NextFunction) => {
    cacheMiddleware(cacheStore)(req, res, next).catch(next)
  }
}

// List all countries
locationRoutes.get('/countries', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  countries(req, res).catch(next)
})

// Get single country by id
locationRoutes.get('/countries/:id', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  country(req, res).catch(next)
})

// List all provinces by country_id
locationRoutes.get('/provinces', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  provinces(req, res).catch(next)
})

// Get a single province by id
locationRoutes.get('/provinces/:id', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  province(req, res).catch(next)
})

// List all municipalities by province_id
locationRoutes.get('/municipalities', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  municipalities(req, res).catch(next)
})

// Get a single municipality by id
locationRoutes.get('/municipalities/:id', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  municipality(req, res).catch(next)
})

// List all sectors by municipality_id
locationRoutes.get('/sectors', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  sectors(req, res).catch(next)
})

// Get a single sector by id
locationRoutes.get('/sectors/:id', asyncCacheMiddleware(cacheStore), (req, res, next) => {
  sector(req, res).catch(next)
})

export default locationRoutes
