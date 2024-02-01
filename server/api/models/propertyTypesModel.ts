// server/api/listings/models/propertyTypesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Listing from './listingModel'

class PropertyType extends Model {
  declare id: number
  declare land: boolean
  declare landDetails: Record<string, any> | null
  declare apartment: boolean
  declare apartmentDetails: Record<string, any> | null
  declare house: boolean
  declare houseDetails: Record<string, any> | null

  // Add other fields as needed

  // Static method to define associations
  public static associate (models: {
    Listing: typeof Listing
  }): void {
    PropertyType.hasMany(models.Listing, {
      foreignKey: 'propertyTypeId', // This should match the foreign key in the Listings table
      as: 'Listings' // An alias to access the associated Listings
    })
  }
}

export const initPropertyType = (sequelize: Sequelize): typeof PropertyType => {
  PropertyType.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    land: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    landDetails: {
      type: DataTypes.JSON,
      allowNull: true
    },
    apartment: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    apartmentDetails: {
      type: DataTypes.JSON,
      allowNull: true
    },
    house: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    houseDetails: {
      type: DataTypes.JSON,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'PropertyTypes'
  })

  return PropertyType
}

export default PropertyType
