// server/api/properties/controllers/propertiesController.tsx

import { type Request, type Response } from 'express'
import { type AuthenticatedRequest } from '../../types/authenticatedRequest'
import { type UniqueConstraintError } from 'sequelize'
import { z } from 'zod'
import * as propertyService from '../services/propertyService'

// Define a Zod schema for the query parameters
const QuerySchema = z.object({
  propertyType: z.enum(['house', 'apt']).optional(),
  sector: z.string().optional(),
  squareFeet: z.number().optional(),
  bedrooms: z.number().optional(),
  bathrooms: z.number().optional(),
  parking: z.number().optional(),
  backyard: z.boolean().optional(),
  pool: z.boolean().optional(),
  jacuzzi: z.boolean().optional(),
  balcony: z.boolean().optional(),
  terrace: z.boolean().optional(),
  elevator: z.boolean().optional(),
  airConditioning: z.boolean().optional(),
  availabilityDate: z.string().optional(), // Use appropriate date handling
  constructionYear: z.string().optional(), // Use appropriate date handling
  price: z.number().optional()
})

export async function getProperties (req: Request, res: Response): Promise<void> {
  try {
    const queryParams = QuerySchema.parse(req.query)

    // Get a list of properties
    const result = await propertyService.getProperties(queryParams)
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
  propertyTypeId: z.number().nonnegative('propertyTypeId must be a non-negative number.'),
  squareFeet: z.union([z.number(), z.null()]).optional().refine(val => val !== undefined, 'Square feet must be a number or null.'),
  bedrooms: z.number().nonnegative('Bedrooms must be a non-negative number.'),
  bathrooms: z.number().nonnegative('Bathrooms must be a non-negative number.'),
  parking: z.number().nonnegative('Parking must be a non-negative number.'),
  backyard: z.boolean().refine(val => typeof val === 'boolean', 'Backyard must be a boolean.'),
  pool: z.boolean().refine(val => typeof val === 'boolean', 'Pool must be a boolean.'),
  jacuzzi: z.boolean().refine(val => typeof val === 'boolean', 'Jacuzzi must be a boolean.'),
  balcony: z.boolean().refine(val => typeof val === 'boolean', 'Balcony must be a boolean.'),
  terrace: z.boolean().refine(val => typeof val === 'boolean', 'Terrace must be a boolean.'),
  elevator: z.boolean().refine(val => typeof val === 'boolean', 'Elevator must be a boolean.'),
  airConditioning: z.boolean().refine(val => typeof val === 'boolean', 'Air Conditioning must be a boolean.'),
  availabilityDate: dateStringSchema.optional().refine(val => val !== undefined, 'Availability date must be a date or null.'),
  constructionYear: dateStringSchema.optional().refine(val => val !== undefined, 'Construction year must be a date or null.'),
  price: z.number().nonnegative('Price must be a non-negative number.'),
  published: z.boolean().refine(val => typeof val === 'boolean', 'Published must be a boolean.'),
  reported: z.boolean().refine(val => typeof val === 'boolean', 'Reported must be a boolean.'),
  disabled: z.boolean().refine(val => typeof val === 'boolean', 'Disabled must be a boolean.'),
  sectorId: z.number().nonnegative('Sector ID must be a non-negative number.'),
  listingOwnerId: z.string().regex(uuidRegex, 'Listing Owner ID must be a valid UUID.')
})

export async function postProperty (req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const propertyData = PropertySchema.parse(req.body)
    const newProperty = await propertyService.postProperty(propertyData as propertyService.PropertyInput)
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

const ReportSchema = z.object({
  reason: z.string().min(1, 'Reason is required.'),
  details: z.string().optional()
})

export async function postReportListing (req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    if (req.decodedToken === undefined) {
      console.log('\x1b[31m401 Unauthorized. Invalid token.\x1b[0m')
      res.status(401).json({ message: 'Invalid token.' })
      return
    }

    // Extract the user ID from the decoded token and validate listingId
    const reporterUserId = req.decodedToken.id
    const { id: listingId } = ParamsSchema.parse({ id: req.params.id })

    // Validate the report body
    const reportBody = ReportSchema.parse(req.body)

    // Construct the report data with all necessary fields
    const reportData = {
      listingId,
      reporterUserId,
      ...reportBody
    }

    const newReport = await propertyService.postReportListing(reportData as propertyService.ReportInput)
    console.log('\x1b[32m201 CREATED. Listing has been reported.\x1b[0m')
    res.status(201).json(newReport)
  } catch (e) {
    // Error handling remains unchanged
    const error = e as UniqueConstraintError
    console.error(error.message)

    if (error.name === 'SequelizeUniqueConstraintError') {
      const specificError = error.errors?.[0]?.message !== undefined && error.errors?.[0]?.message !== '' ? error.errors?.[0]?.message : 'Unique constraint error'
      res.status(409).send({ error: specificError })
    } else {
      res.status(500).send({ error: 'Problem reporting listing.' })
    }
  }
}
