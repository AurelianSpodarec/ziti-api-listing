// server/api/models/imageModel.ts

import {
  Model,
  DataTypes,
  type Sequelize,
  type InferAttributes,
  type InferCreationAttributes,
  type BelongsToGetAssociationMixin,
  type BelongsToSetAssociationMixin,
  type BelongsToCreateAssociationMixin,
  type CreationOptional,
  type ForeignKey
} from 'sequelize'
import type Property from './propertyModel'

class Image extends Model<InferAttributes<Image>, InferCreationAttributes<Image>> {
  declare id: CreationOptional<string>
  declare propertyId: ForeignKey<string>
  declare url: string
  declare description: string | null
  declare height: number | null
  declare width: number | null

  // timestamps!
  declare readonly createdAt?: CreationOptional<Date>
  declare readonly updatedAt?: CreationOptional<Date>

  // Associations
  declare getProperty: BelongsToGetAssociationMixin<Property>
  declare setProperty: BelongsToSetAssociationMixin<Property, string>
  declare createProperty: BelongsToCreateAssociationMixin<Property>

  public static associate (models: {
    Property: typeof Property
  }): void {
    Image.belongsTo(models.Property, { foreignKey: 'propertyId', as: 'property' })
  }
}

export const initImage = (sequelize: Sequelize): typeof Image => {
  Image.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    propertyId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    url: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING(120),
      allowNull: false,
      validate: {
        len: [0, 120]
      }
    },
    height: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    width: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Image'
  })

  return Image
}

export default Image
