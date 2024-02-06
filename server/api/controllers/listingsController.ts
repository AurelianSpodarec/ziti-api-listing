// server/api/listings/controllers/listingsController.tsx

import { type Request, type Response } from 'express'
import { type UniqueConstraintError } from 'sequelize'
import { z } from 'zod'
import { listListings, getListing, createListing } from '../services/listingService'
import type Listing from '../models/listingModel'

export async function listings (req: Request, res: Response): Promise<void> {
  try {
    // Get a list of listings
    const result = await listListings()
    console.log('\x1b[32m200 OK. Sending listings data.\x1b[0m')
    res.json(result)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching listings.' })
  }
}

const ParamsSchema = z.object({
  id: z.string().min(1, 'ID is required.')
})

export async function listing (req: Request, res: Response): Promise<void> {
  try {
    const { id } = ParamsSchema.parse(req.params)
    const result = await getListing(id)
    console.log('\x1b[32m200 OK. Sending listing data.\x1b[0m')
    res.json(result.Listing)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching listing.' })
  }
}

const ListingSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  address: z.string().min(1, 'Address is required.'),
  squareFeet: z.union([z.number(), z.null()]).optional().refine(val => val !== undefined, 'Square feet must be a number or null.'),
  bedrooms: z.number().nonnegative('Bedrooms must be a non-negative number.'),
  bathrooms: z.number().nonnegative('Bathrooms must be a non-negative number.'),
  parking: z.number().nonnegative('Parking must be a non-negative number.'),
  backyard: z.boolean().refine(val => typeof val === 'boolean', 'Backyard must be a boolean.'),
  pool: z.boolean().refine(val => typeof val === 'boolean', 'Pool must be a boolean.'),
  jacuzzi: z.boolean().refine(val => typeof val === 'boolean', 'Jacuzzi must be a boolean.'),
  availabilityDate: z.union([z.date(), z.null()])
    .optional()
    .transform((val) => val !== null && val !== undefined ? new Date(val) : val)
    .refine(val => val !== undefined, 'Availability date must be a date or null.'),
  constructionYear: z.union([z.date(), z.null()])
    .optional()
    .transform((val) => val !== null && val !== undefined ? new Date(val) : val)
    .refine(val => val !== undefined, 'Construction year must be a date or null.'),
  price: z.number().nonnegative('Price must be a non-negative number.'),
  published: z.boolean().refine(val => typeof val === 'boolean', 'Published must be a boolean.'),
  reported: z.boolean().refine(val => typeof val === 'boolean', 'Reported must be a boolean.'),
  disabled: z.boolean().refine(val => typeof val === 'boolean', 'Disabled must be a boolean.'),
  sectorId: z.number().nonnegative('Sector ID must be a non-negative number.')
})

export async function createListings (req: Request, res: Response): Promise<void> {
  try {
    const listingData = ListingSchema.parse(req.body)
    const newListing = await createListing(listingData as Listing)
    res.status(201).json(newListing)
  } catch (e) {
    const error = e as UniqueConstraintError
    console.error(error.message)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const specificError = error.errors?.[0]?.message !== undefined && error.errors?.[0]?.message !== '' ? error.errors?.[0]?.message : 'Unique constraint error'
      res.status(409).send({ error: specificError })
    } else {
      res.status(500).send({ error: 'Problem creating listing.' })
    }
  }
}
