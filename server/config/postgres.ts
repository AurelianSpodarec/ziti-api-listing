// server/config/postgres.ts

import { getRequiredEnvVariable } from '../utils/getRequiredEnvVariable'

function parseIntSafe (value: string, defaultValue: number): number {
  const parsedValue = parseInt(value.trim(), 10)
  return isNaN(parsedValue) ? defaultValue : parsedValue
}

const listingDBConfig = {
  HOST: getRequiredEnvVariable('LISTDB_HOST'),
  PORT: parseIntSafe(getRequiredEnvVariable('LISTDB_PORT'), 5432),
  USER: getRequiredEnvVariable('LISTDB_USER'),
  PASSWORD: getRequiredEnvVariable('LISTDB_PASSWORD'),
  DB: getRequiredEnvVariable('LISTDB_DATABASE'),
  dialect: 'postgres' as const,
  pool: {
    max: parseIntSafe(getRequiredEnvVariable('DB_POOL_MAX'), 10),
    min: parseIntSafe(getRequiredEnvVariable('DB_POOL_MIN'), 0),
    acquire: parseIntSafe(getRequiredEnvVariable('DB_POOL_ACQUIRE'), 10000),
    idle: parseIntSafe(getRequiredEnvVariable('DB_POOL_IDLE'), 10000)
  }
}

export default { listingDBConfig }
