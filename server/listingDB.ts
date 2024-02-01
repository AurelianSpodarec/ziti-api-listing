// server/listingDB.ts

import { Sequelize } from 'sequelize'
import config from './config/postgres'

// Listing
import { initListing } from '@api/models/listingModel'
import { initPropertyStatus } from '@api/models/propertyStatusesModel'
import { initPropertyType } from '@api/models/propertyTypesModel'
import { initCurrency } from '@api/models/location/currenciesModel'
import { initCountry } from '@api/models/location/countriesModel'
import { initProvince } from '@api/models/location/provincesModel'
import { initMunicipality } from '@api/models/location/municipalitiesModel'
import { initSector } from '@api/models/location/sectorsModel'

// Initialize Sequelize instance
const sequelizeListing = new Sequelize(
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

// console.log("\nsequelizeListing: ", sequelizeListing.config);

// Initialize the models
const Country = initCountry(sequelizeListing)
const Province = initProvince(sequelizeListing)
const Municipality = initMunicipality(sequelizeListing)
const Sector = initSector(sequelizeListing)
const PropertyStatus = initPropertyStatus(sequelizeListing)
const PropertyType = initPropertyType(sequelizeListing)
const Currency = initCurrency(sequelizeListing)
const Listing = initListing(sequelizeListing)

// Define associations (order is important)
// Country, Province, Municipality, Sector
Country.associate({ Province })
Province.associate({ Municipality, Country })
Municipality.associate({ Sector, Province })
Sector.associate({ Municipality })
// PropertyStatus, PropertyType, Currency
PropertyStatus.associate({ Listing })
PropertyType.associate({ Listing })
Currency.associate({ Listing })
// Listing
Listing.associate({ PropertyStatus, PropertyType, Currency, Sector })

// Initialize the db object
const listingDB: any = {
  Sequelize,
  sequelizeListing,
  Country,
  Province,
  Municipality,
  Sector,
  PropertyStatus,
  PropertyType,
  Currency,
  Listing
}

export default listingDB
