// server/api/countries/controllers/locationsController.tsx

import { type Request, type Response } from 'express'
import { z } from 'zod'
import { getCountries, getCountry, getProvinces, getProvince, getMunicipalities, getMunicipality, getSectors, getSector, searchSectors } from '../services/locationService'

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
  id: z.string().regex(/^\d+$/, 'ID must be a number')
})

export async function country (req: Request, res: Response): Promise<void> {
  try {
    const params = countryIdSchema.parse(req.params)
    const id = params.id

    const result = await getCountry(id)
    console.log('\x1b[32m200 OK. Sending country data.\x1b[0m')
    res.json(result.Country)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching country.' })
  }
}

const provincesQuerySchema = z.object({
  countryId: z.string().regex(/^\d+$/, 'Country ID must be a number')
})

export async function provinces (req: Request, res: Response): Promise<void> {
  try {
    const query = provincesQuerySchema.parse(req.query)
    const countryId = query.countryId
    const result = await getProvinces(countryId)
    console.log('\x1b[32m200 OK. Sending provinces data.\x1b[0m')
    res.json(result.Provinces)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching provinces.' })
  }
}

const provinceIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Province ID must be a number')
})

export async function province (req: Request, res: Response): Promise<void> {
  try {
    const params = provinceIdSchema.parse(req.params)
    const id: string = params.id

    const result = await getProvince(id)
    console.log('\x1b[32m200 OK. Sending province data.\x1b[0m')
    res.json(result.Province)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching province.' })
  }
}

const municipalitiesQuerySchema = z.object({
  provinceId: z.string().regex(/^\d+$/, 'Province ID must be a number')
})

export async function municipalities (req: Request, res: Response): Promise<void> {
  try {
    const query = municipalitiesQuerySchema.parse(req.query)
    const provinceId: string = (query.provinceId)

    const result = await getMunicipalities(provinceId)
    console.log('\x1b[32m200 OK. Sending municipalities data.\x1b[0m')
    res.json(result.Municipalities)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching municipalities.' })
  }
}

const municipalityIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Municipality ID must be a number')
})

export async function municipality (req: Request, res: Response): Promise<void> {
  try {
    const params = municipalityIdSchema.parse(req.params)
    const id: string = params.id

    const result = await getMunicipality(id)
    console.log('\x1b[32m200 OK. Sending municipality data.\x1b[0m')
    res.json(result.Municipality)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching municipality.' })
  }
}

const sectorsQuerySchema = z.object({
  municipalityId: z.string().regex(/^\d+$/, 'Municipality ID must be a number').optional(),
  s: z.string().optional()
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

    console.log('\x1b[32m200 OK. Sending sectors data.\x1b[0m')
    res.json(result.Sectors)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching sectors.' })
  }
}

const sectorIdSchema = z.object({
  id: z.string().regex(/^\d+$/, 'Sector ID must be a number')
})

export async function sector (req: Request, res: Response): Promise<void> {
  try {
    const params = sectorIdSchema.parse(req.params)
    const id: string = params.id

    const result = await getSector(id)
    console.log('\x1b[32m200 OK. Sending sector data.\x1b[0m')
    res.json(result.Sector)
  } catch (e) {
    if (e instanceof z.ZodError) {
      console.log('\x1b[31m400 Bad Request. Validation error: ' + e.message + ' \x1b[0m')
      res.status(400).send({ error: 'Validation error: ' + e.message })
      return
    }

    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching sector.' })
  }
}
