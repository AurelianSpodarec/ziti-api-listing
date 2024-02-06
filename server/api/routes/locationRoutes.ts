// server/api/listings/routes/locationRoutes.ts

import { type Request, type Response, Router, type NextFunction } from 'express'
import { countries, country, provinces, province, municipalities, municipality, sectors, sector } from '@api/controllers/locationsController'
import { asyncMiddleware } from '@utils/asyncMiddleware'
import { cacheMiddleware } from '@middleware/cacheMiddleware'
import { cacheStore } from '@utils/redis'

const locationRoutes: Router = Router()

// List all countries
locationRoutes.get('/countries', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  countries(req, res).catch(next)
})

// Get single country by id
locationRoutes.get('/countries/:id', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  country(req, res).catch(next)
})

// List all provinces by country_id
locationRoutes.get('/provinces', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  provinces(req, res).catch(next)
})

// Get a single province by id
locationRoutes.get('/provinces/:id', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  province(req, res).catch(next)
})

// List all municipalities by province_id
locationRoutes.get('/municipalities', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  municipalities(req, res).catch(next)
})

// Get a single municipality by id
locationRoutes.get('/municipalities/:id', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  municipality(req, res).catch(next)
})

// List all sectors by municipality_id
locationRoutes.get('/sectors', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  sectors(req, res).catch(next)
})

// Get a single sector by id
locationRoutes.get('/sectors/:id', asyncMiddleware(cacheMiddleware(cacheStore)), (req: Request, res: Response, next: NextFunction) => {
  sector(req, res).catch(next)
})

export default locationRoutes
