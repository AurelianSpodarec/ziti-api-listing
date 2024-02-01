// server/api/listings/models/listingModel.ts

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

class Listing extends Model<InferAttributes<Listing>, InferCreationAttributes<Listing>> {
  declare id: string
  declare title: string
  declare description: string | null
  declare address: string | null
  declare squareFeet: number | null
  declare bedrooms: number
  declare bathrooms: number
  declare parking: number
  declare backyard: boolean
  declare pool: boolean
  declare jacuzzi: boolean
  declare availabilityDate: Date | null
  declare constructionYear: Date | null
  declare price: number | null
  declare published: boolean
  declare reported: boolean
  declare disabled: boolean
  declare sectorId: number

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
  declare createPropertyStatus: HasManyCreateAssociationMixin<PropertyStatus>

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

  public PropertyTypes?: PropertyType[]
  public PropertyStatuses?: PropertyStatus[]
  public Currencies?: Currency[]
  public Sectors?: Sector[]

  declare static associations: {
    PropertyTypes: Association<Listing, PropertyType>
    PropertyStatuses: Association<Listing, PropertyStatus>
    Currencies: Association<Listing, Currency>
    Sectors: Association<Listing, Sector>
  }

  public static associate (models: {
    PropertyType: typeof PropertyType
    PropertyStatus: typeof PropertyStatus
    Currency: typeof Currency
    Sector: typeof Sector
  }): void {
    Listing.belongsTo(models.PropertyType, { foreignKey: 'propertyTypeId' })
    Listing.belongsTo(models.PropertyStatus, { foreignKey: 'propertyStatusId' })
    Listing.belongsTo(models.Currency, { foreignKey: 'currencyId' })
    Listing.belongsTo(models.Sector, { foreignKey: 'sectorId' })
  }
}

export const initListing = (sequelize: Sequelize): typeof Listing => {
  Listing.init({
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
      type: DataTypes.TEXT
    },
    address: {
      type: DataTypes.STRING
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
      allowNull: true
    },
    published: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    reported: { // Maybe we need a listings_reported table to map listings and users who have reported them
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    disabled: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    sectorId: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Listing'
  })

  return Listing
}

export default Listing
