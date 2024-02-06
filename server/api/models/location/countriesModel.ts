// server/api/properties/models/location/countriesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Province from './provincesModel'

class Country extends Model {
  declare id: number
  declare name: string
  declare alpha2Code: string
  declare alpha3Code: string
  declare numericCode: string
  declare supported: boolean

  public static associate (models: {
    Province: typeof Province
  }): void {
    // A country has many Province
    Country.hasMany(models.Province, {
      foreignKey: 'country_id', // This is the foreign key in the Province model
      as: 'Provinces'
    })
  }
}

export const initCountry = (sequelize: Sequelize): typeof Country => {
  Country.init({
    id: {
      type: DataTypes.SMALLINT,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    alpha2Code: {
      type: DataTypes.STRING(2),
      allowNull: false,
      unique: true
    },
    alpha3Code: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },
    numericCode: {
      type: DataTypes.STRING(3),
      allowNull: false,
      unique: true
    },
    supported: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'Country'
  })

  return Country
}

export default Country
