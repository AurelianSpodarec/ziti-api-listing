// server/listingDB.ts

import { Sequelize } from 'sequelize'
import config from './config/postgres'

// Property
import { initProperty } from '@api/models/propertyModel'
import { initPropertyStatus } from '@api/models/propertyStatusesModel'
import { initPropertyType } from '@api/models/propertyTypesModel'
import { initCurrency } from '@api/models/location/currenciesModel'
import { initCountry } from '@api/models/location/countriesModel'
import { initProvince } from '@api/models/location/provincesModel'
import { initMunicipality } from '@api/models/location/municipalitiesModel'
import { initSector } from '@api/models/location/sectorsModel'
import { initImage } from '@api/models/imageModel'
import { initFavoriteCollection } from '@api/models/favoriteCollectionModel'
import { initFavoriteProperty } from '@api/models/favoritePropertyModel'
import { initReportedListing } from '@api/models/reportedListingsModel'

// Initialize Sequelize instance
const sequelizeProperty = new Sequelize(
  config.listingDBConfig.DB,
  config.listingDBConfig.USER,
  config.listingDBConfig.PASSWORD,
  {
    host: config.listingDBConfig.HOST,
    port: config.listingDBConfig.PORT,
    dialect: config.listingDBConfig.dialect,
    pool: {
      max: config.listingDBConfig.pool.max,
      min: config.listingDBConfig.pool.min,
      acquire: config.listingDBConfig.pool.acquire,
      idle: config.listingDBConfig.pool.idle
    }
  }
)

// console.log("\nsequelizeProperty: ", sequelizeProperty.config);

// Initialize the models
const Country = initCountry(sequelizeProperty)
const Province = initProvince(sequelizeProperty)
const Municipality = initMunicipality(sequelizeProperty)
const Sector = initSector(sequelizeProperty)
const Image = initImage(sequelizeProperty)
const PropertyStatus = initPropertyStatus(sequelizeProperty)
const PropertyType = initPropertyType(sequelizeProperty)
const Currency = initCurrency(sequelizeProperty)
const Property = initProperty(sequelizeProperty)
const FavoriteCollection = initFavoriteCollection(sequelizeProperty)
const FavoriteProperty = initFavoriteProperty(sequelizeProperty)
const ReportedListing = initReportedListing(sequelizeProperty)

// Define associations (order is important)
// Country, Province, Municipality, Sector
Country.associate({ Province })
Province.associate({ Municipality, Country })
Municipality.associate({ Sector, Province })
Sector.associate({ Municipality })
// Image
Image.associate({ Property })
// PropertyStatus, PropertyType, Currency
PropertyStatus.associate({ Property })
PropertyType.associate({ Property })
Currency.associate({ Property })
// Favorite Collection
FavoriteCollection.associate({ FavoriteProperty })
// Favorite Property
FavoriteProperty.associate({ FavoriteCollection, Property })
// Reported Listing
ReportedListing.associate({ Property })
// Property
Property.associate({ PropertyStatus, PropertyType, Currency, Sector, Image, FavoriteProperty, ReportedListing })

// Initialize the db object
const listingDB: any = {
  Sequelize,
  sequelizeProperty,
  Country,
  Province,
  Municipality,
  Sector,
  PropertyStatus,
  PropertyType,
  Currency,
  Property,
  FavoriteCollection,
  FavoriteProperty,
  ReportedListing
}

export default listingDB
