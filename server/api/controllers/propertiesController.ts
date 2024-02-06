// server/api/properties/controllers/propertiesController.tsx

import { type Request, type Response } from 'express'
import { type UniqueConstraintError } from 'sequelize'
import { z } from 'zod'
import * as propertyService from '../services/propertyService'
import type Property from '../models/propertyModel'

export async function getProperties (req: Request, res: Response): Promise<void> {
  try {
    // Get a list of properties
    const result = await propertyService.getProperties()
    console.log('\x1b[32m200 OK. Sending properties data.\x1b[0m')
    res.json(result)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching properties.' })
  }
}

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

const ParamsSchema = z.object({
  id: z.string()
    .regex(uuidRegex, 'ID must be a valid UUID.')
})

export async function getProperty (req: Request, res: Response): Promise<void> {
  try {
    const { id } = ParamsSchema.parse(req.params)
    const result = await propertyService.getProperty(id)
    if (result.Property === null) {
      console.error('\x1b[31m404 Not Found.')
      res.status(404).json({ error: 'Not Found' })
      return
    }
    console.log('\x1b[32m200 OK. Sending property data.\x1b[0m')
    res.json(result.Property)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.error('\x1b[31m400 Bad Request. Validation error:', e.errors[0].message, '\x1b[0m')
      res.status(400).json({ error: e.errors[0].message })
    } else {
      const error = e as Error
      console.error(error.message)
      res.status(500).send({ error: 'Problem fetching property.' })
    }
  }
}

const dateStringSchema = z.union([
  z.string().transform((str) => new Date(str)),
  z.null()
])

const PropertySchema = z.object({
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
  availabilityDate: dateStringSchema.optional().refine(val => val !== undefined, 'Availability date must be a date or null.'),
  constructionYear: dateStringSchema.optional().refine(val => val !== undefined, 'Construction year must be a date or null.'),
  price: z.number().nonnegative('Price must be a non-negative number.'),
  published: z.boolean().refine(val => typeof val === 'boolean', 'Published must be a boolean.'),
  reported: z.boolean().refine(val => typeof val === 'boolean', 'Reported must be a boolean.'),
  disabled: z.boolean().refine(val => typeof val === 'boolean', 'Disabled must be a boolean.'),
  sectorId: z.number().nonnegative('Sector ID must be a non-negative number.')
})

export async function postProperty (req: Request, res: Response): Promise<void> {
  try {
    const propertyData = PropertySchema.parse(req.body)
    const newProperty = await propertyService.postProperty(propertyData as Property)
    console.log('\x1b[32m201 CREATED. Sending new property data.\x1b[0m')
    res.status(201).json(newProperty)
  } catch (e) {
    const error = e as UniqueConstraintError
    console.error(error.message)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const specificError = error.errors?.[0]?.message !== undefined && error.errors?.[0]?.message !== '' ? error.errors?.[0]?.message : 'Unique constraint error'
      res.status(409).send({ error: specificError })
    } else {
      res.status(500).send({ error: 'Problem creating property.' })
    }
  }
}
