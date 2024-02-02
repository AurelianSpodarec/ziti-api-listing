// server/types/authenticatedRequests.ts

import { type Request } from 'express'
import { type DecodedJWTPayload } from './decodedJWTPayload'

// Extend Request with a generic type for the body
export interface AuthenticatedRequest<T = any> extends Request {
  decodedToken?: DecodedJWTPayload
  body: T
}
