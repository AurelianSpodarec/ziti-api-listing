// server/api/properties/services/propertyService.ts

import Property from '@api/models/propertyModel'
import PropertyStatus from '@api/models/propertyStatusesModel'
import PropertyType from '@api/models/propertyTypesModel'
import Sector from '@api/models/location/sectorsModel'
import Currency from '@api/models/location/currenciesModel'
import Municipality from '@api/models/location/municipalitiesModel'
import Province from '@api/models/location/provincesModel'
import Country from '@api/models/location/countriesModel'

export async function listProperties (): Promise<{ Properties: Property[], SchemaData: Record<string, any> }> {
  try {
    // Query the database for properties with related information
    const properties = await Property.findAll({
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

export async function createProperty (propertyData: Property): Promise<Property> {
  try {
    const newProperty = await Property.create(propertyData)
    return newProperty
  } catch (error) {
    console.error('Error creating property:', error)
    throw error
  }
}
