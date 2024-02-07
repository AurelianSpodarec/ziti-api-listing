// server/api/countries/controllers/locationsController.tsx

import { type Request, type Response } from 'express'
import { z } from 'zod'
import { getCountries, getCountry, getProvinces, getProvince, getMunicipalities, getMunicipality, getSectors, getSector, searchSectors } from '../services/locationService'

const SMALLINT_MIN = -32768
const SMALLINT_MAX = 32767
const INT_MAX = 2147483647
const INT_MIN = -2147483648

export async function countries (req: Request, res: Response): Promise<void> {
  try {
    // Get a list of countries
    const result = await getCountries()
    console.log('\x1b[32m200 OK. Sending countries data.\x1b[0m')
    res.json(result.Countries)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching countries.' })
  }
}

const countryIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'Country ID must be a number')
    .transform(Number)
    .refine(num => num >= SMALLINT_MIN && num <= SMALLINT_MAX, {
      message: 'Country ID is not valid'
    })
})

export async function country (req: Request, res: Response): Promise<void> {
  try {
    const params = countryIdSchema.parse(req.params)
    const id = params.id

    const result = await getCountry(id)

    if (result.Country === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending country data.\x1b[0m')
    res.json(result.Country)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.errors[0].message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.errors[0].message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching country.' })
  }
}

const provincesQuerySchema = z.object({
  countryId: z.string()
    .regex(/^\d+$/, 'Country ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine(val => !isNaN(val), 'Country ID must be a number')
    .refine(val => Number.isInteger(val), 'Country ID must be an integer')
    .refine(val => val >= SMALLINT_MIN && val <= SMALLINT_MAX, 'Country ID must be within range')
})

export async function provinces (req: Request, res: Response): Promise<void> {
  try {
    const query = provincesQuerySchema.parse(req.query)
    const countryId = query.countryId
    const result = await getProvinces(countryId)

    if (result.Provinces === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending provinces data.\x1b[0m')
    res.json(result.Provinces)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.errors[0].message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.errors[0].message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching provinces.' })
  }
}

const provinceIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'Province ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine(val => !isNaN(val), 'Province ID must be a number')
    .refine(val => Number.isInteger(val), 'Province ID must be an integer')
    .refine(val => val >= INT_MIN && val <= INT_MAX, 'Province ID must be within integer range')
})

export async function province (req: Request, res: Response): Promise<void> {
  try {
    const params = provinceIdSchema.parse(req.params)
    const id: number = params.id

    const result = await getProvince(id)

    if (result.Province === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending province data.\x1b[0m')
    res.json(result.Province)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.errors[0].message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.errors[0].message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching province.' })
  }
}

const municipalitiesQuerySchema = z.object({
  provinceId: z.string()
    .regex(/^\d+$/, 'Province ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine(val => !isNaN(val), 'Province ID must be a number')
    .refine(val => Number.isInteger(val), 'Province ID must be an integer')
    .refine(val => val >= INT_MIN && val <= INT_MAX, 'Province ID must be within integer range')
})

export async function municipalities (req: Request, res: Response): Promise<void> {
  try {
    const query = municipalitiesQuerySchema.parse(req.query)
    const provinceId: number = (query.provinceId)

    const result = await getMunicipalities(provinceId)

    if (result.Municipalities === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending municipalities data.\x1b[0m')
    res.json(result.Municipalities)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.errors[0].message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.errors[0].message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching municipalities.' })
  }
}

const municipalityIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'Municipality ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine(val => !isNaN(val), 'Municipality ID must be a number')
    .refine(val => Number.isInteger(val), 'Municipality ID must be an integer')
    .refine(val => val >= INT_MIN && val <= INT_MAX, 'Municipality ID must be within integer range')
})

export async function municipality (req: Request, res: Response): Promise<void> {
  try {
    const params = municipalityIdSchema.parse(req.params)
    const id: number = params.id

    const result = await getMunicipality(id)

    if (result.Municipality === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending municipality data.\x1b[0m')
    res.json(result.Municipality)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching municipality.' })
  }
}

const sectorsQuerySchema = z.object({
  municipalityId: z.string()
    .regex(/^\d+$/, 'Municipality ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine(val => !isNaN(val), 'Municipality ID must be a number')
    .refine(val => Number.isInteger(val), 'Municipality ID must be an integer')
    .refine(val => val >= INT_MIN && val <= INT_MAX, 'Municipality ID must be within integer range').optional(),
  s: z.string()
    .regex(/^[a-zA-Z0-9 ]*$/, 'Only alphanumeric characters and spaces are allowed')
    .max(30, 'The string must be at most 30 characters long')
    .optional()
})

export async function sectors (req: Request, res: Response): Promise<void> {
  try {
    const query = sectorsQuerySchema.parse(req.query)
    const municipalityId = query.municipalityId
    const searchQuery = query.s

    let result: { Sectors: Array<{ id: number, name: string }> } |
    { Sectors: Array<{ sector_id: string, sector: string, municipalityId: string, municipality: string, provinceId: string, province: string }> } |
    { Sectors: null }

    if (municipalityId !== undefined) {
      result = await getSectors(municipalityId) as typeof result
    } else if (searchQuery !== undefined) {
      result = await searchSectors(searchQuery) as typeof result
    } else {
      res.status(400).send({ error: 'Missing query parameters.' })
      return
    }

    if (result.Sectors === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending sectors data.\x1b[0m')
    res.json(result.Sectors)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.errors[0].message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.errors[0].message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching sectors.' })
  }
}

const sectorIdSchema = z.object({
  id: z.string()
    .regex(/^\d+$/, 'Sector ID must be a number')
    .transform((val) => parseInt(val, 10))
    .refine(val => !isNaN(val), 'Sector ID must be a number')
    .refine(val => Number.isInteger(val), 'Sector ID must be an integer')
    .refine(val => val >= INT_MIN && val <= INT_MAX, 'Sector ID must be within integer range')
})

export async function sector (req: Request, res: Response): Promise<void> {
  try {
    const params = sectorIdSchema.parse(req.params)
    const id: number = params.id

    const result = await getSector(id)

    if (result.Sector === null) {
      console.log('\x1b[31m404 Not Found.\x1b[0m')
      res.status(404).send({ error: 'Not Found' })
      return
    }

    console.log('\x1b[32m200 OK. Sending sector data.\x1b[0m')
    res.json(result.Sector)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.errors[0].message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.errors[0].message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching sector.' })
  }
}
