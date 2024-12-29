import { JwtPayload } from 'jsonwebtoken';

import { DataForJwtPayloadType } from "./data-for-jwt-payload.type";



export type JwtPayloadType = DataForJwtPayloadType & JwtPayload;
