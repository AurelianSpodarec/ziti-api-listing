// server/api/properties/models/propertyTypesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Property from './propertyModel'

class PropertyType extends Model {
  declare id: number
  declare name: string

  // Add other fields as needed

  // Static method to define associations
  public static associate (models: {
    Property: typeof Property
  }): void {
    PropertyType.hasMany(models.Property, {
      foreignKey: 'propertyTypeId', // This should match the foreign key in the Properties table
      as: 'Properties' // An alias to access the associated Properties
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
    name: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'PropertyTypes'
  })

  return PropertyType
}

export default PropertyType
