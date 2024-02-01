// server/api/countries/controllers/locationsController.tsx

import { type Request, type Response } from 'express'
import { getCountries, getCountry, getProvinces, getProvince, getMunicipalities, getMunicipality, getSectors, getSector, searchSectors } from '../services/locationService'
import { isNumeric } from '../../../../ziti-api/server/utils/isNumber'

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

export async function country (req: Request, res: Response): Promise<void> {
  const id = req.params.id

  // Check if the necessary query parameters are provided
  if (id === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required parameters.' })
    return
  }

  if (!isNumeric(id)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${id} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
    const result = await getCountry(id)
    console.log('\x1b[32m200 OK. Sending country data.\x1b[0m')
    res.json(result.Country)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching country.' })
  }
}

export async function provinces (req: Request, res: Response): Promise<void> {
  const countryId: string = req.query.countryId as string

  // Check if the necessary query parameters are provided
  if (countryId === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required query parameters.' })
    return
  }

  if (!isNumeric(countryId)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${countryId} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
    const result = await getProvinces(countryId)
    console.log('\x1b[32m200 OK. Sending provinces data.\x1b[0m')
    res.json(result.Provinces)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching provinces.' })
  }
}

export async function province (req: Request, res: Response): Promise<void> {
  const id: string = req.params.id

  // Check if the necessary query parameters are provided
  if (id === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required parameters.' })
    return
  }

  if (!isNumeric(id)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${id} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
    const result = await getProvince(id)
    console.log('\x1b[32m200 OK. Sending province data.\x1b[0m')
    res.json(result.Province)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching province.' })
  }
}

export async function municipalities (req: Request, res: Response): Promise<void> {
  const provinceId: string = (req.query.provinceId as string)

  // Check if the necessary query parameters are provided
  if (provinceId === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required query parameters.' })
    return
  }

  if (!isNumeric(provinceId)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${provinceId} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
    const result = await getMunicipalities(provinceId)
    console.log('\x1b[32m200 OK. Sending municipalities data.\x1b[0m')
    res.json(result.Municipalities)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching municipalities.' })
  }
}

export async function municipality (req: Request, res: Response): Promise<void> {
  const id: string = req.params.id

  // Check if the necessary query parameters are provided
  if (id === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required parameters.' })
    return
  }

  if (!isNumeric(id)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${id} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
    const result = await getMunicipality(id)
    console.log('\x1b[32m200 OK. Sending municipality data.\x1b[0m')
    res.json(result.Municipality)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching municipality.' })
  }
}

export async function sectors (req: Request, res: Response): Promise<void> {
  const municipalityId = req.query.municipalityId as string
  const searchQuery = req.query.s as string

  // Check if the necessary query parameters are provided
  if (municipalityId === undefined && searchQuery === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required query parameters.' })
    return
  }

  if (municipalityId !== undefined && !isNumeric(municipalityId)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${municipalityId} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
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
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching sectors.' })
  }
}

export async function sector (req: Request, res: Response): Promise<void> {
  const id: string = req.params.id

  // Check if the necessary query parameters are provided
  if (id === undefined) {
    console.log('\x1b[31m400 Bad Request. Missing required parameters. \x1b[0m')
    res.status(400).send({ error: 'Missing required parameters.' })
    return
  }

  if (!isNumeric(id)) {
    // id is not a number
    console.log(`\x1b[31m400 Bad Request. Not a number: ${id} \x1b[0m`)
    res.status(400).send({ error: 'Invalid request.' })
    return
  }

  try {
    const result = await getSector(id)
    console.log('\x1b[32m200 OK. Sending sector data.\x1b[0m')
    res.json(result.Sector)
  } catch (e) {
    const error = e as Error
    console.error(error.message)
    res.status(500).send({ error: 'Problem fetching sector.' })
  }
}
