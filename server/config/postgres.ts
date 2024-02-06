// server/config/postgres.ts

import { getRequiredEnvVariable } from '../utils/getRequiredEnvVariable'

function parseIntSafe (value: string, defaultValue: number): number {
  const parsedValue = parseInt(value.trim(), 10)
  return isNaN(parsedValue) ? defaultValue : parsedValue
}

const propertyDBConfig = {
  HOST: getRequiredEnvVariable('PROPERTYDB_HOST'),
  PORT: parseIntSafe(getRequiredEnvVariable('PROPERTYDB_PORT'), 5432),
  USER: getRequiredEnvVariable('PROPERTYDB_USER'),
  PASSWORD: getRequiredEnvVariable('PROPERTYDB_PASSWORD'),
  DB: getRequiredEnvVariable('PROPERTYDB_DATABASE'),
  dialect: 'postgres' as const,
  pool: {
    max: parseIntSafe(getRequiredEnvVariable('DB_POOL_MAX'), 10),
    min: parseIntSafe(getRequiredEnvVariable('DB_POOL_MIN'), 0),
    acquire: parseIntSafe(getRequiredEnvVariable('DB_POOL_ACQUIRE'), 10000),
    idle: parseIntSafe(getRequiredEnvVariable('DB_POOL_IDLE'), 10000)
  }
}

export default { propertyDBConfig }
