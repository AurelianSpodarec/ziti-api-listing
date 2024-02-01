// server/api/listings/models/propertyStatusesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Listing from './listingModel'

class PropertyStatus extends Model {
  declare id: number
  declare statusName: string // e.g., 'pre-construction', 'available', 'new', 'pre-owned'
  declare deliveryDate?: Date // Optional, mainly for 'pre-construction' status
  // Other specific fields for property status if needed

  // Static method to define associations
  public static associate (models: {
    Listing: typeof Listing
  }): void {
    PropertyStatus.hasMany(models.Listing, {
      foreignKey: 'propertyTypeId', // This should match the foreign key in the Listings table
      as: 'Listings' // An alias to access the associated Listings
    })
  }
}

export const initPropertyStatus = (sequelize: Sequelize): typeof PropertyStatus => {
  PropertyStatus.init({
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    statusName: {
      type: new DataTypes.STRING(128),
      allowNull: false
    },
    deliveryDate: {
      type: DataTypes.DATE,
      allowNull: true // Since it's only relevant for 'pre-construction'
    }
    // Other fields initialization
  }, {
    sequelize,
    tableName: 'PropertyStatuses'
  })

  return PropertyStatus
}

export default PropertyStatus
