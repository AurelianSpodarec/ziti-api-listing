// server/middleware/errorHandling.ts

import { type Request, type Response, type NextFunction } from 'express'

export function errorHandling (err: any, req: Request, res: Response, next: NextFunction): void {
  const errorMessage = err instanceof Error ? err.message : err.toString()

  if (errorMessage.startsWith('403:') === true) {
    console.error(`\x1b[31m403 Forbidden. ${errorMessage}\x1b[0m`) // Red text
    res.status(403).end() // Sends a 403 status code with no message
  } else {
    console.error(`\x1b[31m500 Internal Server Error. ${errorMessage}\x1b[0m`) // Red text
    res.status(500).send('Something went wrong.')
  }
}
