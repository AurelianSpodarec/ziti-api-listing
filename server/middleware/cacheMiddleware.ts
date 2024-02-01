// server/middleware/cacheMiddleware.ts

import { type Request, type Response, type NextFunction } from 'express'
import { type CustomStore } from '@utils/redis'

export const cacheMiddleware = (cacheStore: CustomStore) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cacheKey = `${req.method}-${req.originalUrl}`
    try {
      const data: string | null = await cacheStore.client.get(cacheKey)
      if (data !== null) {
        console.log('\x1b[32m%s\x1b[0m', 'Cache hit for URL: ' + cacheKey) // Green text
        res.send(JSON.parse(data))
        return
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'Cache miss for URL: ' + cacheKey) // Yellow text
      }
    } catch (err) {
      // Check if err is an instance of Error
      if (err instanceof Error) {
        console.log('\x1b[31m%s\x1b[0m', 'Redis error: ' + err.message) // Red text, using err.message
      } else {
        // If it's not an Error instance, or you need a different way to handle it
        console.log('\x1b[31m%s\x1b[0m', 'Redis error: An unknown error occurred')
      }
    }

    const originalSend = res.send.bind(res)
    res.send = (data: any) => {
      if (res.statusCode === 200) {
        cacheStore.client.setEx(cacheKey, 60, JSON.stringify(data))
          .then(() => {
            console.log('\x1b[33m%s\x1b[0m', 'Cache updated for URL: ' + cacheKey) // Yellow text
          })
          .catch((error) => {
            console.error('\x1b[31m%s\x1b[0m', 'Cache update error: ' + error) // Red text, handle any error during cache set
          })
      }
      return originalSend(data)
    }

    next()
  }
}
