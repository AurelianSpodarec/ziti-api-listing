// server/api/listings/services/listingService.ts

import Listing from '../models/listingModel'
import PropertyStatus from '../models/propertyStatusesModel'
import PropertyType from '../models/propertyTypesModel'
import Sector from '../models/location/sectorsModel'
import Organization from '../../../../ziti-api/server/api/blog/models/organizationsModel'
import Currency from '../models/location/currenciesModel'
import Municipality from '../models/location/municipalitiesModel'
import Province from '../models/location/provincesModel'
import Country from '../models/location/countriesModel'

export async function listListings (): Promise<{ Listings: Listing[], SchemaData: Record<string, any> }> {
  try {
    // Query the database for listings with related information
    const listings = await Listing.findAll({
      include: [
        { model: Currency, as: 'Currency', attributes: ['id', 'code', 'name', 'symbol'] },
        { model: PropertyStatus, as: 'PropertyStatus' },
        { model: PropertyType, as: 'PropertyType' },
        {
          model: Sector,
          as: 'Sector',
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
                attributes: ['id', 'name']
              }]
            }]
          }]
        }
      ],
      where: {
        published: true
      }
    })

    // Fetch organization
    const organization = await Organization.findOne()
    if (organization === null) {
      throw new Error('Organization information not found.')
    }

    // Generate the SchemaData object using the external function
    // const schemaData = generateSchemaData(listings, organization);
    const schemaData = {}

    return { Listings: listings, SchemaData: schemaData }
  } catch (error) {
    console.error('Error fetching listings from the database:', error)
    throw error
  }
}

export async function getListing (id: string): Promise<{ Listing: Listing | null }> {
  try {
    // Query the database for the listing
    const listing = await Listing.findOne({
      include: [
        { model: Currency, as: 'Currency', attributes: ['id', 'code', 'name', 'symbol'] },
        { model: PropertyStatus, as: 'PropertyStatus' },
        { model: PropertyType, as: 'PropertyType' },
        {
          model: Sector,
          as: 'Sector',
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
                attributes: ['id', 'name']
              }]
            }]
          }]
        }
      ],
      where: {
        id,
        published: true
      }
    })

    if (listing === null) {
      console.log(
        '\x1b[31m%s\x1b[0m',
        'Post not found, returning null'
      )
      return { Listing: null } // Return null when listing is not found
    }

    return { Listing: listing }
  } catch (error) {
    console.error('Error fetching listing from the database:', error)
    throw error
  }
}

export async function createListing (listingData: Partial<Listing>): Promise<Listing> {
  try {
    const newListing = await Listing.create(listingData)
    return newListing
  } catch (error) {
    console.error('Error creating listing:', error)
    throw error
  }
}
