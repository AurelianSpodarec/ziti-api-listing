// server/api/listings/controllers/listingsController.tsx

import { type Request, type Response } from 'express'
import { type UniqueConstraintError } from 'sequelize'
import { z } from 'zod'
import { listListings, getListing, createListing } from '../services/listingService'
import type Listing from '../models/listingModel'

const ParamsSchema = z.object({
  id: z.string().min(1, 'ID is required.')
})

const ListingSchema = z.object({
  title: z.string().min(1, 'Title is required.'),
  description: z.string().min(1, 'Description is required.'),
  price: z.number().nonnegative()
})

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

export async function listing (req: Request, res: Response): Promise<void> {
  try {
    const { id } = ParamsSchema.parse(req.params)
    const result = await getListing(id as string)
    console.log('\x1b[32m200 OK. Sending listing data.\x1b[0m')
    res.json(result.Listing)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching listing.' })
  }
}

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
