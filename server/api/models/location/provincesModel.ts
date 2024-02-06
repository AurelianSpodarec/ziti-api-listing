// server/api/properties/models/location/provincesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Municipality from './municipalitiesModel'
import type Country from './countriesModel'

class Province extends Model {
  declare id: number
  declare name: string
  declare country_id: number
  declare Country: Country

  public static associate (models: {
    Municipality: typeof Municipality
    Country: typeof Country
  }): void {
    Province.hasMany(models.Municipality, {
      foreignKey: 'province_id',
      as: 'Municipalities'
    })
    Province.belongsTo(models.Country, {
      foreignKey: 'country_id',
      as: 'Country'
    })
  }
}

export const initProvince = (sequelize: Sequelize): typeof Province => {
  Province.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false
    },
    country_id: {
      type: DataTypes.SMALLINT,
      allowNull: false,
      references: {
        model: 'Countries',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Province'
  })

  return Province
}

export default Province
