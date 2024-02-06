// server/utils/redis.ts

import { createClient, type RedisClientType } from 'redis'
import { getRequiredEnvVariable } from './getRequiredEnvVariable'

// Retrieve environment variables
const host = getRequiredEnvVariable('REDIS_HOST')
const port = Number(getRequiredEnvVariable('REDIS_PORT'))
const password = getRequiredEnvVariable('REDIS_PASSWORD')

// Create Redis client
const redisClient: RedisClientType = createClient({
  url: `redis://${host}:${port}`,
  password
})

// Connect to Redis and add event listeners
const connectToRedis = async (): Promise<void> => {
  try {
    await redisClient.connect()
    console.log('\x1b[32mRedis client connected.\x1b[0m')

    const reply = await redisClient.ping()
    console.log('\x1b[32mRedis server is responding:', reply, '\x1b[0m')
  } catch (err) {
    console.log('\x1b[31mRedis server is not responding.\x1b[0m')
  }

  // Event listener for errors
  redisClient.on('error', err => {
    console.error('\x1b[31mRedis error:', err, '\x1b[0m')
  })
}

// Initialize Redis connection
connectToRedis()
  .then(() => { console.log('\x1b[32mRedis connection initialized successfully.\x1b[0m') })
  .catch((err) => { console.error('\x1b[31mFailed to initialize Redis connection:', err, '\x1b[0m') })

// Custom Store Type
export interface CustomStore {
  client: typeof redisClient
  prefix: string
}

export const cacheStore: CustomStore = {
  client: redisClient,
  prefix: 'propertyCache:'
}
