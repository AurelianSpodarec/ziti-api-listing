// server/api/properties/models/propertyStatusesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Property from './propertyModel'

class PropertyStatus extends Model {
  declare id: number
  declare statusName: string // e.g., 'pre-construction', 'available', 'new', 'pre-owned'
  declare deliveryDate?: Date // Optional, mainly for 'pre-construction' status
  // Other specific fields for property status if needed

  // Static method to define associations
  public static associate (models: {
    Property: typeof Property
  }): void {
    PropertyStatus.hasMany(models.Property, {
      foreignKey: 'propertyTypeId', // This should match the foreign key in the Properties table
      as: 'Properties' // An alias to access the associated Properties
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
