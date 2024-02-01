// server/api/listings/services/locationService.ts

import { Op } from 'sequelize'
import Country from '../models/location/countriesModel'
import Province from '../models/location/provincesModel'
import Municipality from '../models/location/municipalitiesModel'
import Sector from '../models/location/sectorsModel'

export async function getCountries (): Promise<{ Countries: Country[] | null }> {
  try {
    const countries = await Country.findAll({
      attributes: ['id', 'name'],
      where: {
        supported: true
      }
    })

    if (countries.length === 0) {
      console.log('\x1b[31m%s\x1b[0m', 'Countries not found or not supported, returning null')
      return { Countries: null }
    }

    return { Countries: countries }
  } catch (error) {
    console.error('Error fetching countries from the database:', error)
    throw error
  }
}

export async function getCountry (id: string): Promise<{ Country: Country | null }> {
  try {
    const country = await Country.findOne({
      attributes: ['id', 'name'],
      where: {
        id,
        supported: true
      }
    })

    if (country === null) {
      console.log(
        '\x1b[31m%s\x1b[0m',
        'Country not found or not supported, returning null'
      )
      return { Country: null } // Return null when country is not found
    }

    return { Country: country }
  } catch (error) {
    console.error('Error fetching country from the database:', error)
    throw error
  }
}

export async function getProvinces (countryId: string): Promise<{ Provinces: Province[] | null }> {
  try {
    const provinces = await Province.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Country,
        as: 'Country',
        attributes: [], // No need to fetch any attributes from the Country
        where: { supported: true } // Condition for supported countries
      }],
      where: {
        country_id: countryId
      }
    })

    if (provinces.length === 0) {
      console.log('\x1b[31m%s\x1b[0m', 'Provinces not found or not in a supported country, returning null')
      return { Provinces: null }
    }

    return { Provinces: provinces }
  } catch (error) {
    console.error('Error fetching provinces from the database:', error)
    throw error
  }
}

export async function getProvince (id: string): Promise<{ Province: Province | null }> {
  try {
    const province = await Province.findOne({
      attributes: ['id', 'name'],
      include: [{
        model: Country,
        as: 'Country',
        attributes: [], // No need to fetch any attributes from the Country
        where: { supported: true } // Condition for supported countries
      }],
      where: {
        id
      }
    })

    if (province === null) {
      console.log('\x1b[31m%s\x1b[0m', 'Province not found or not in a supported country, returning null')
      return { Province: null } // Return null when province is not found
    }

    return { Province: province }
  } catch (error) {
    console.error('Error fetching provinces from the database:', error)
    throw error
  }
}

export async function getMunicipalities (provinceId: string): Promise<{ Municipalities: Municipality[] | null }> {
  try {
    const municipalities = await Municipality.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Province,
        as: 'Province',
        attributes: [],
        where: {
          id: provinceId
          // Alternatively, if you don't want to filter by provinceId here,
          // you can remove this where clause and filter only by Country.supported
        },
        include: [{
          model: Country,
          as: 'Country',
          attributes: [],
          where: { supported: true }
        }]
      }]
    })

    if (municipalities.length === 0) {
      console.log('\x1b[31m%s\x1b[0m', 'Municipalities not found or not in a supported country, returning null')
      return { Municipalities: null }
    }

    return { Municipalities: municipalities }
  } catch (error) {
    console.error('Error fetching municipalities from the database:', error)
    throw error
  }
}

export async function getMunicipality (id: string): Promise<{ Municipality: { id: number, name: string } | null }> {
  try {
    const municipality = await Municipality.findOne({
      attributes: ['id', 'name'],
      include: [{
        model: Province,
        as: 'Province',
        attributes: ['id', 'name'],
        include: [{
          model: Country,
          as: 'Country',
          attributes: ['id', 'name', 'supported'],
          where: { supported: true }
        }]
      }],
      where: {
        id
      }
    })

    if (municipality?.Province?.Country === undefined) {
      console.log('\x1b[31m%s\x1b[0m', 'Municipality not found or not in a supported country, returning null')
      return { Municipality: null } // Return null when municipality is not found or not supported
    }

    // return { Municipality: municipality };
    return { Municipality: { id: municipality.id, name: municipality.name } }
  } catch (error) {
    console.error('Error fetching provinces from the database:', error)
    throw error
  }
}

export async function getSectors (municipalityId: string): Promise<{ Sectors: Array<{ sector_id: string, sector: string, municipalityId: string, municipality: string, provinceId: string, province: string }> } | { Sectors: null }> {
  try {
    const sectors = await Sector.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Municipality,
        as: 'Municipality',
        attributes: ['id', 'name'],
        where: { id: municipalityId },
        include: [{
          model: Province,
          as: 'Province',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'Country',
            attributes: ['id', 'name', 'supported'],
            where: { supported: true }
          }]
        }]
      }]
    })

    // Filter out sectors that are not in supported countries
    const filteredSectors = sectors.filter(sector =>
      sector?.Municipality?.Province?.Country
    )

    if (filteredSectors.length === 0) {
      console.log('\x1b[31m%s\x1b[0m', 'Sectors not found or not in a supported country, returning null')
      return { Sectors: null }
    }

    const formattedSectors = sectors.map(sector => ({
      sector_id: sector.id.toString(),
      sector: sector.name,
      municipalityId: sector.Municipality.id.toString(),
      municipality: sector.Municipality.name,
      provinceId: sector.Municipality.Province.id.toString(),
      province: sector.Municipality.Province.name
    }))

    return { Sectors: formattedSectors }
  } catch (error) {
    console.error('Error fetching sectors from the database:', error)
    throw error
  }
}

export async function getSector (id: string): Promise<{ Sector: { sector_id: string, sector: string, municipalityId: string, municipality: string, provinceId: string, province: string } | null }> {
  try {
    const sector = await Sector.findOne({
      attributes: ['id', 'name'],
      include: [{
        model: Municipality,
        as: 'Municipality',
        attributes: ['id', 'name'],
        include: [{
          model: Province,
          as: 'Province',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'Country',
            attributes: ['id', 'name', 'supported'],
            where: { supported: true }
          }]
        }]
      }],
      where: {
        id
      }
    })

    if (sector?.Municipality?.Province?.Country === undefined) {
      console.log('\x1b[31m%s\x1b[0m', 'Sector not found or not in a supported country, returning null')
      return { Sector: null }
    }

    const formattedSector = {
      sector_id: sector.id.toString(),
      sector: sector.name,
      municipalityId: sector.Municipality.id.toString(),
      municipality: sector.Municipality.name,
      provinceId: sector.Municipality.Province.id.toString(),
      province: sector.Municipality.Province.name
    }

    // return { Sector: sector };
    return { Sector: formattedSector }
  } catch (error) {
    console.error('Error fetching provinces from the database:', error)
    throw error
  }
}

export async function searchSectors (s: string): Promise<{ Sectors: Array<{ sector_id: string, sector: string, municipalityId: string, municipality: string, provinceId: string, province: string }> | null }> {
  try {
    const sectors = await Sector.findAll({
      attributes: ['id', 'name'],
      include: [{
        model: Municipality,
        as: 'Municipality',
        attributes: ['id', 'name'],
        include: [{
          model: Province,
          as: 'Province',
          attributes: ['id', 'name'],
          include: [{
            model: Country,
            as: 'Country',
            attributes: ['id', 'name', 'supported'],
            where: { supported: true }
          }]
        }]
      }],
      where: {
        name: {
          [Op.iLike]: `%${s}%`
        }
      }
    })

    // Filter out sectors without valid Municipality, Province, and Country
    const filteredSectors = sectors.filter(sector =>
      sector?.Municipality?.Province?.Country
    )

    if (filteredSectors.length === 0) {
      console.log('\x1b[31m%s\x1b[0m', 'Sectors not found or not in a supported country, returning null')
      return { Sectors: null }
    }

    const formattedSectors = filteredSectors.map(sector => ({
      sector_id: sector.id.toString(),
      sector: sector.name,
      municipalityId: sector.Municipality.id.toString(),
      municipality: sector.Municipality.name,
      provinceId: sector.Municipality.Province.id.toString(),
      province: sector.Municipality.Province.name
    }))

    return { Sectors: formattedSectors }
  } catch (error) {
    console.error('Error fetching sectors from the database:', error)
    throw error
  }
}
