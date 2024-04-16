// server/middleware/cacheMiddleware.ts

import { type Request, type Response, type NextFunction } from 'express'
import { type CustomStore } from '../utils/redis'

const cacheTime = 10 * 60 // Ten minutes in seconds

interface CachedData {
  data: string
  contentType: string
}

export const cacheMiddleware = (cacheStore: CustomStore) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const cacheKey = `${req.method}-${req.originalUrl}`
    try {
      const data: string | null = await cacheStore.client.get(cacheKey)
      if (data !== null) {
        console.log('\x1b[32m%s\x1b[0m', 'Cache hit for URL: ' + cacheKey) // Green text
        const cachedObject: CachedData = JSON.parse(data)
        res.setHeader('Content-Type', cachedObject.contentType) // Correct content type is now safely set

        if (cachedObject.contentType === 'application/json') {
          res.json(JSON.parse(cachedObject.data)) // Use res.json to send data as JSON
        } else {
          res.send(cachedObject.data) // Send as plain text or other format
        }
        return
      } else {
        console.log('\x1b[33m%s\x1b[0m', 'Cache miss for URL: ' + cacheKey) // Yellow text
      }
    } catch (err) {
      if (err instanceof Error) {
        console.log('\x1b[31m%s\x1b[0m', 'Redis error: ' + err.message) // Red text, using err.message
      } else {
        console.log('\x1b[31m%s\x1b[0m', 'Redis error: An unknown error occurred')
      }
    }

    const originalSend = res.send.bind(res)
    res.send = (data: any) => {
      if (res.statusCode === 200) {
        const contentType = res.get('Content-Type') ?? 'application/json' // Nullish coalescing for safer fallback
        const responseData = typeof data === 'object' ? JSON.stringify(data) : data
        const cacheValue = JSON.stringify({
          data: responseData,
          contentType
        })

        cacheStore.client.setEx(cacheKey, cacheTime, cacheValue)
          .then(() => {
            console.log('\x1b[33m%s\x1b[0m', 'Cache updated for URL: ' + cacheKey) // Yellow text
          })
          .catch((error) => {
            console.error('\x1b[31m%s\x1b[0m', 'Cache update error: ' + error) // Red text
          })
      }
      return originalSend(data)
    }

    next()
  }
}
