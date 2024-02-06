// server/propertyDB.ts

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

// Initialize Sequelize instance
const sequelizeProperty = new Sequelize(
  config.propertyDBConfig.DB,
  config.propertyDBConfig.USER,
  config.propertyDBConfig.PASSWORD,
  {
    host: config.propertyDBConfig.HOST,
    port: config.propertyDBConfig.PORT,
    dialect: config.propertyDBConfig.dialect,
    pool: {
      max: config.propertyDBConfig.pool.max,
      min: config.propertyDBConfig.pool.min,
      acquire: config.propertyDBConfig.pool.acquire,
      idle: config.propertyDBConfig.pool.idle
    }
  }
)

// console.log("\nsequelizeProperty: ", sequelizeProperty.config);

// Initialize the models
const Country = initCountry(sequelizeProperty)
const Province = initProvince(sequelizeProperty)
const Municipality = initMunicipality(sequelizeProperty)
const Sector = initSector(sequelizeProperty)
const PropertyStatus = initPropertyStatus(sequelizeProperty)
const PropertyType = initPropertyType(sequelizeProperty)
const Currency = initCurrency(sequelizeProperty)
const Property = initProperty(sequelizeProperty)

// Define associations (order is important)
// Country, Province, Municipality, Sector
Country.associate({ Province })
Province.associate({ Municipality, Country })
Municipality.associate({ Sector, Province })
Sector.associate({ Municipality })
// PropertyStatus, PropertyType, Currency
PropertyStatus.associate({ Property })
PropertyType.associate({ Property })
Currency.associate({ Property })
// Property
Property.associate({ PropertyStatus, PropertyType, Currency, Sector })

// Initialize the db object
const propertyDB: any = {
  Sequelize,
  sequelizeProperty,
  Country,
  Province,
  Municipality,
  Sector,
  PropertyStatus,
  PropertyType,
  Currency,
  Property
}

export default propertyDB
