import 'express';

import { JwtPayloadType } from 'assets/type/jwt/jwt-payload.type';




declare module 'express' {
  export interface Request {
    user?: JwtPayloadType;
  }
}
