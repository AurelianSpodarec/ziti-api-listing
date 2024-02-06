// server/api/properties/models/location/sectorsModel.ts

import { Model, DataTypes, type Sequelize } from 'sequelize'
import type Municipality from './municipalitiesModel'

class Sector extends Model {
  declare id: number
  declare name: string
  declare municipality_id: number
  declare Municipality: Municipality

  public static associate (models: {
    Municipality: typeof Municipality
  }): void {
    Sector.belongsTo(models.Municipality, {
      foreignKey: 'municipality_id',
      as: 'Municipality'
    })
  }
}

export const initSector = (sequelize: Sequelize): typeof Sector => {
  Sector.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false
    },
    municipality_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Municipalities',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'Sector'
  })

  return Sector
}

export default Sector
