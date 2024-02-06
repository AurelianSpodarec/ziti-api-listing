// server/api/properties/models/locations/currenciesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Property from '../propertyModel'

class Currency extends Model {
  declare id: number
  declare code: string
  declare name: string
  declare symbol: string

  // Static method to define associations
  public static associate (models: {
    Property: typeof Property
  }): void {
    Currency.hasMany(models.Property, {
      foreignKey: 'currencyId',
      as: 'Properties'
    })
  }
}

export const initCurrency = (sequelize: Sequelize): typeof Currency => {
  Currency.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    code: {
      type: DataTypes.STRING(3),
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    symbol: {
      type: DataTypes.STRING,
      allowNull: false
    }
    // Foreign key for countryId will be added in associations
  }, {
    sequelize,
    modelName: 'Currency'
  })

  return Currency
}

export default Currency
