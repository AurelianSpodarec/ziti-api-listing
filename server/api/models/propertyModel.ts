// server/api/properties/models/propertyModel.ts

import {
  Model,
  DataTypes,
  type Association,
  type CreationOptional,
  type InferAttributes,
  type InferCreationAttributes,
  type HasManyGetAssociationsMixin,
  type HasManyAddAssociationMixin,
  type HasManyAddAssociationsMixin,
  type HasManySetAssociationsMixin,
  type HasManyRemoveAssociationMixin,
  type HasManyRemoveAssociationsMixin,
  type HasManyHasAssociationMixin,
  type HasManyHasAssociationsMixin,
  type HasManyCountAssociationsMixin,
  type HasManyCreateAssociationMixin,
  // type HasOneGetAssociationMixin,
  // type HasOneSetAssociationMixin,
  // type HasOneCreateAssociationMixin,
  type Sequelize
} from 'sequelize'
import type PropertyType from '@api/models/propertyTypesModel'
import type PropertyStatus from '@api/models/propertyStatusesModel'
import type Currency from '@api/models/location/currenciesModel'
import type Sector from '@api/models/location/sectorsModel'
import type Image from './imageModel'
import type FavoriteProperty from './favoritePropertyModel'
import type ReportedListing from './reportedListingsModel'

class Property extends Model<InferAttributes<Property>, InferCreationAttributes<Property>> {
  declare id?: string
  declare title: string
  declare description: string
  declare address: string
  declare propertyTypeId: number
  declare squareFeet: number | null
  declare bedrooms: number
  declare bathrooms: number
  declare parking: number
  declare backyard: boolean
  declare pool: boolean
  declare jacuzzi: boolean
  declare balcony: boolean
  declare terrace: boolean
  declare elevator: boolean
  declare airConditioning: boolean
  declare availabilityDate: Date | null
  declare constructionYear: Date | null
  declare price: number
  declare published: boolean
  declare disabled?: boolean
  declare sectorId: number
  declare listingOwnerId: string

  // timestamps!
  declare readonly createdAt?: CreationOptional<Date>
  declare readonly updatedAt?: CreationOptional<Date>

  // PropertyType associations
  declare getPropertyTypes: HasManyGetAssociationsMixin<PropertyType>
  declare addPropertyType: HasManyAddAssociationMixin<PropertyType, number>
  declare addPropertyTypes: HasManyAddAssociationsMixin<PropertyType, number>
  declare setPropertyTypes: HasManySetAssociationsMixin<PropertyType, number>
  declare removePropertyType: HasManyRemoveAssociationMixin<PropertyType, number>
  declare removePropertyTypes: HasManyRemoveAssociationsMixin<PropertyType, number>
  declare hasPropertyType: HasManyHasAssociationMixin<PropertyType, number>
  declare hasPropertyTypes: HasManyHasAssociationsMixin<PropertyType, number>
  declare countPropertyTypes: HasManyCountAssociationsMixin
  declare createPropertyType: HasManyCreateAssociationMixin<PropertyType>

  // PropertyStatus associations
  declare getPropertyStatuses: HasManyGetAssociationsMixin<PropertyStatus>
  declare addPropertyStatus: HasManyAddAssociationMixin<PropertyStatus, number>
  declare addPropertyStatuses: HasManyAddAssociationsMixin<PropertyStatus, number>
  declare setPropertyStatuses: HasManySetAssociationsMixin<PropertyStatus, number>
  declare removePropertyStatus: HasManyRemoveAssociationMixin<PropertyStatus, number>
  declare removePropertyStatuses: HasManyRemoveAssociationsMixin<PropertyStatus, number>
  declare hasPropertyStatus: HasManyHasAssociationMixin<PropertyStatus, number>
  declare hasPropertyStatuses: HasManyHasAssociationsMixin<PropertyStatus, number>
  declare countPropertyStatuses: HasManyCountAssociationsMixin
  declare createPropertytatus: HasManyCreateAssociationMixin<PropertyStatus>

  // Currency associations
  declare getCurrencies: HasManyGetAssociationsMixin<Currency>
  declare addCurrency: HasManyAddAssociationMixin<Currency, number>
  declare addCurrencies: HasManyAddAssociationsMixin<Currency, number>
  declare setCurrencies: HasManySetAssociationsMixin<Currency, number>
  declare removeCurrency: HasManyRemoveAssociationMixin<Currency, number>
  declare removeCurrencies: HasManyRemoveAssociationsMixin<Currency, number>
  declare hasCurrency: HasManyHasAssociationMixin<Currency, number>
  declare hasCurrencies: HasManyHasAssociationsMixin<Currency, number>
  declare countCurrencies: HasManyCountAssociationsMixin
  declare createCurrency: HasManyCreateAssociationMixin<Currency>

  // Sector associations
  declare getSectors: HasManyGetAssociationsMixin<Sector>
  declare addSector: HasManyAddAssociationMixin<Sector, number>
  declare addSectors: HasManyAddAssociationsMixin<Sector, number>
  declare setSectors: HasManySetAssociationsMixin<Sector, number>
  declare removeSector: HasManyRemoveAssociationMixin<Sector, number>
  declare removeSectors: HasManyRemoveAssociationsMixin<Sector, number>
  declare hasSector: HasManyHasAssociationMixin<Sector, number>
  declare hasSectors: HasManyHasAssociationsMixin<Sector, number>
  declare countSectors: HasManyCountAssociationsMixin
  declare createSector: HasManyCreateAssociationMixin<Sector>

  // FavoriteProperty associations
  declare getFavoriteProperties: HasManyGetAssociationsMixin<FavoriteProperty>
  declare addFavoriteProperty: HasManyAddAssociationMixin<FavoriteProperty, string>
  declare removeFavoriteProperty: HasManyRemoveAssociationMixin<FavoriteProperty, string>
  declare hasFavoriteProperty: HasManyHasAssociationMixin<FavoriteProperty, string>
  declare countFavoriteProperties: HasManyCountAssociationsMixin

  // ReportedListing associations
  declare getReportsMade: HasManyGetAssociationsMixin<ReportedListing>
  declare addReportMade: HasManyAddAssociationMixin<ReportedListing, string>
  declare setReportsMade: HasManySetAssociationsMixin<ReportedListing, string>
  declare removeReportMade: HasManyRemoveAssociationMixin<ReportedListing, string>
  declare hasReportsMade: HasManyHasAssociationMixin<ReportedListing, string>
  declare countReportsMade: HasManyCountAssociationsMixin
  declare createReportMade: HasManyCreateAssociationMixin<ReportedListing>

  // Image associations
  declare getImages: HasManyGetAssociationsMixin<Image>
  declare addImage: HasManyAddAssociationMixin<Image, string>
  declare removeImage: HasManyRemoveAssociationMixin<Image, string>
  declare createImage: HasManyCreateAssociationMixin<Image>

  public PropertyTypes?: PropertyType[]
  public PropertyStatuses?: PropertyStatus[]
  public Currencies?: Currency[]
  public Sectors?: Sector[]
  public FavoriteProperties?: FavoriteProperty[]
  public ReportedProperties?: ReportedListing[]

  declare static associations: {
    PropertyTypes: Association<Property, PropertyType>
    PropertyStatuses: Association<Property, PropertyStatus>
    Currencies: Association<Property, Currency>
    Sectors: Association<Property, Sector>
    Images: Association<Property, Image>
    FavoriteProperties: Association<Property, FavoriteProperty>
    ReportedProperties: Association<Property, ReportedListing>
  }

  public static associate (models: {
    PropertyType: typeof PropertyType
    PropertyStatus: typeof PropertyStatus
    Currency: typeof Currency
    Sector: typeof Sector
    Image: typeof Image
    FavoriteProperty: typeof FavoriteProperty
    ReportedListing: typeof ReportedListing
  }): void {
    Property.belongsTo(models.PropertyType, { foreignKey: 'propertyTypeId' })
    Property.belongsTo(models.PropertyStatus, { foreignKey: 'propertyStatusId' })
    Property.belongsTo(models.Currency, { foreignKey: 'currencyId' })
    Property.belongsTo(models.Sector, { foreignKey: 'sectorId' })
    Property.hasMany(models.Image, { foreignKey: 'propertyId', as: 'images' })
    Property.hasMany(models.FavoriteProperty, { foreignKey: 'propertyId', as: 'favoriteProperties' })
    Property.hasMany(models.ReportedListing, { foreignKey: 'listingId', as: 'reportedListings' })
  }
}

export const initProperty = (sequelize: Sequelize): typeof Property => {
  Property.init({
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
      unique: true
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    address: {
      type: DataTypes.STRING,
      allowNull: false
    },
    propertyTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'PropertyTypes',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    squareFeet: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    bedrooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    bathrooms: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    parking: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    backyard: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    pool: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    jacuzzi: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    balcony: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    terrace: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    elevator: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    airConditioning: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    availabilityDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    constructionYear: {
      type: DataTypes.DATE,
      allowNull: true
    },
    price: {
      type: DataTypes.FLOAT,
      allowNull: false
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sectorId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Sectors',
        key: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    },
    listingOwnerId: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Property'
  })

  return Property
}

export default Property
