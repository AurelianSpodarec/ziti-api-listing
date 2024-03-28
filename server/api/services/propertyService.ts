// server/api/properties/services/propertyService.ts

import Property from '@api/models/propertyModel'
import PropertyStatus from '@api/models/propertyStatusesModel'
import PropertyType from '@api/models/propertyTypesModel'
import Sector from '@api/models/location/sectorsModel'
import Currency from '@api/models/location/currenciesModel'
import Municipality from '@api/models/location/municipalitiesModel'
import Province from '@api/models/location/provincesModel'
import Country from '@api/models/location/countriesModel'
import ReportedListing from '@api/models/reportedListingsModel'

export async function getProperties (propertyType?: string): Promise<{ Properties: Property[], SchemaData: Record<string, any> }> {
  const whereClause = {
    published: true,
    ...(propertyType !== undefined && propertyType !== '' ? { '$PropertyType.type$': propertyType } : {}) // Filter by property type if provided
  }

  try {
    // Query the database for properties with related information
    const properties = await Property.findAll({
      include: [
        { model: Currency, as: 'Currency', attributes: ['id', 'code', 'name', 'symbol'] },
        { model: PropertyStatus, as: 'PropertyStatus' },
        {
          model: PropertyType,
          as: 'PropertyType',
          where: propertyType !== undefined && propertyType !== '' ? { type: propertyType } : undefined,
          required: false
        },
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
      where: whereClause
    })

    // Generate the SchemaData object using the external function
    // const schemaData = generateSchemaData(properties, organization);
    const schemaData = {}

    return { Properties: properties, SchemaData: schemaData }
  } catch (error) {
    console.error('Error fetching properties from the database:', error)
    throw error
  }
}

export async function getProperty (id: string): Promise<{ Property: Property | null }> {
  try {
    // Query the database for the property
    const property = await Property.findOne({
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

    if (property === null) {
      return { Property: null } // Return null when property is not found
    }

    return { Property: property }
  } catch (error) {
    console.error('Error fetching property from the database:', error)
    throw error
  }
}

// Define a type that matches the input fields for creating a property
export interface PropertyInput {
  title: string
  description: string
  address: string
  propertyTypeId: number
  squareFeet?: number | null
  bedrooms: number
  bathrooms: number
  parking: number
  backyard: boolean
  pool: boolean
  jacuzzi: boolean
  balcony: boolean
  terrace: boolean
  elevator: boolean
  airConditioning: boolean
  availabilityDate?: Date | null
  constructionYear?: Date | null
  price: number
  published: boolean
  disabled?: boolean
  sectorId: number
  listingOwnerId: string
}

export async function postProperty (propertyData: PropertyInput): Promise<Property> {
  try {
    const newProperty = await Property.create(propertyData)
    return newProperty
  } catch (error) {
    console.error('Error creating property:', error)
    throw error
  }
}

export interface ReportInput {
  listingId: string
  reporterUserId: string
  reason: string
  details?: string
}

export async function postReportListing (reportData: ReportInput): Promise<boolean> {
  try {
    // Retrieve the property instance
    const propertyInstance = await Property.findByPk(reportData.listingId)
    if (propertyInstance === null) {
      console.error('Property not found')
      return false // Or handle as appropriate
    }

    // Use the instance method to create the report
    await ReportedListing.create({
      listingId: reportData.listingId,
      reporterUserId: reportData.reporterUserId,
      reason: reportData.reason,
      details: reportData.details
    })

    console.log('Report created successfully')
    return true
  } catch (error) {
    console.error('Error creating report:', error)
    throw error
  }
}
