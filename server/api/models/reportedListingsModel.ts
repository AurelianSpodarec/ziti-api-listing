// server/api/models/reportedListingsModel.ts

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
import type Property from './propertyModel'

class ReportedListing extends Model<InferAttributes<ReportedListing>, InferCreationAttributes<ReportedListing>> {
  declare id?: CreationOptional<string>
  declare listingId: ForeignKey<string> // UUID for the Property being reported
  declare reporterUserId: string // UUID from the auth database, no direct association
  declare reason: string // Reason for the report
  declare details?: string | null // Additional details about the report, if any
  declare resolved?: boolean

  // Timestamps
  declare readonly createdAt?: CreationOptional<Date>
  declare readonly updatedAt?: CreationOptional<Date>

  // Association methods for Property
  declare getListing: BelongsToGetAssociationMixin<Property>
  declare setListing: BelongsToSetAssociationMixin<Property, string>

  public static associate (models: { Property: typeof Property }): void {
    ReportedListing.belongsTo(models.Property, {
      foreignKey: 'listingId',
      as: 'listing'
    })
  }
}

export const initReportedListing = (sequelize: Sequelize): typeof ReportedListing => {
  ReportedListing.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false
    },
    listingId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: 'Properties',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    reporterUserId: {
      type: DataTypes.STRING, // Keeping as STRING to match UUID format from authDB
      allowNull: false
    },
    reason: {
      type: DataTypes.STRING,
      allowNull: false
    },
    details: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    resolved: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'ReportedListings'
  })

  return ReportedListing
}

export default ReportedListing
