// server/api/properties/models/location/municipalitiesModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Sector from './sectorsModel'
import type Province from './provincesModel'

class Municipality extends Model {
  declare id: number
  declare name: string
  declare province_id: number
  declare Province: Province

  public static associate (models: {
    Sector: typeof Sector
    Province: typeof Province
  }): void {
    Municipality.hasMany(models.Sector, {
      foreignKey: 'municipality_id',
      as: 'Sectors'
    })
    Municipality.belongsTo(models.Province, {
      foreignKey: 'province_id',
      as: 'Province'
    })
  }
}

export const initMunicipality = (sequelize: Sequelize): typeof Municipality => {
  Municipality.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    province_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Provinces',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Municipality'
  })

  return Municipality
}

export default Municipality
