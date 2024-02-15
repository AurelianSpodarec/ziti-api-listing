// server/api/models/favoriteCollectionModel.ts

import {
  Model,
  DataTypes,
  type Sequelize,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type HasManyGetAssociationsMixin,
  type HasManyAddAssociationMixin,
  type HasManySetAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyHasAssociationMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin
} from 'sequelize'
import type FavoriteProperty from './favoritePropertyModel' // Adjust the import path as necessary

class FavoriteCollection extends Model<InferAttributes<FavoriteCollection>, InferCreationAttributes<FavoriteCollection>> {
  declare id: CreationOptional<string>
  declare userId: string // UUID from auth database
  declare name: string

  // timestamps!
  declare readonly createdAt?: CreationOptional<Date>
  declare readonly updatedAt?: CreationOptional<Date>

  // Association methods
  declare getFavoriteProperties: HasManyGetAssociationsMixin<FavoriteProperty>
  declare addFavoriteProperty: HasManyAddAssociationMixin<FavoriteProperty, string>
  declare setFavoriteProperties: HasManySetAssociationsMixin<FavoriteProperty, string>
  declare removeFavoriteProperty: HasManyRemoveAssociationMixin<FavoriteProperty, string>
  declare hasFavoriteProperty: HasManyHasAssociationMixin<FavoriteProperty, string>
  declare countFavoriteProperties: HasManyCountAssociationsMixin
  declare createFavoriteProperty: HasManyCreateAssociationMixin<FavoriteProperty>

  public static associate (models: { FavoriteProperty: typeof FavoriteProperty }): void {
    FavoriteCollection.hasMany(models.FavoriteProperty, {
      foreignKey: 'favoriteCollectionId',
      as: 'favoriteProperties'
    })
  }
}

export const initFavoriteCollection = (sequelize: Sequelize): typeof FavoriteCollection => {
  FavoriteCollection.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'FavoriteCollection'
  })

  return FavoriteCollection
}

export default FavoriteCollection
