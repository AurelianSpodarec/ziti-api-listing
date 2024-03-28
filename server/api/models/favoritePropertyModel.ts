// server/api/models/favoritePropertyModel.ts

import {
  Model,
  DataTypes,
  type Sequelize,
  type InferAttributes,
  type InferCreationAttributes,
  type CreationOptional,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type ForeignKey
} from 'sequelize'
import type FavoriteCollection from './favoriteCollectionModel'
import type Property from './propertyModel'

class FavoriteProperty extends Model<InferAttributes<FavoriteProperty>, InferCreationAttributes<FavoriteProperty>> {
  declare id: CreationOptional<string>
  declare favoriteCollectionId: string // Reference to FavoriteCollection
  declare propertyId: ForeignKey<string> // UUID for Property

  // timestamps!
  declare readonly createdAt?: CreationOptional<Date>
  declare readonly updatedAt?: CreationOptional<Date>

  // Association methods
  declare getFavoriteCollection: BelongsToGetAssociationMixin<FavoriteCollection>
  declare setFavoriteCollection: BelongsToSetAssociationMixin<FavoriteCollection, string>

  declare getProperty: BelongsToGetAssociationMixin<Property>
  declare setProperty: BelongsToSetAssociationMixin<Property, string>

  public static associate (models: { FavoriteCollection: typeof FavoriteCollection, Property: typeof Property }): void {
    // FavoriteProperty belongs to FavoriteCollection
    FavoriteProperty.belongsTo(models.FavoriteCollection, {
      foreignKey: 'favoriteCollectionId',
      as: 'favoriteCollection'
    })

    // FavoriteProperty belongs to Property
    FavoriteProperty.belongsTo(models.Property, {
      foreignKey: 'propertyId',
      as: 'property'
    })
  }
}

export const initFavoriteProperty = (sequelize: Sequelize): typeof FavoriteProperty => {
  FavoriteProperty.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false
      },
      favoriteCollectionId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'FavoriteCollections',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      },
      propertyId: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: 'Properties',
          key: 'id'
        },
        onDelete: 'CASCADE',
        onUpdate: 'CASCADE'
      }
    },
    {
      sequelize,
      modelName: 'FavoriteProperty'
    }
  )

  return FavoriteProperty
}

export default FavoriteProperty
