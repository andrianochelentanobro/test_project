import { Expose } from "class-transformer";

import { ApiProperty } from "@nestjs/swagger";



export class LoginHttpResponseDto {
  @ApiProperty({
    description: 'JWT Access Token', 
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJjMjg4ZDE4ZC0wNzVkLTQ5MTEtYjU4OC1jZGQ0MTJjMzAzODgiLCJ1c2VybmFtZSI6ImhvbWVyIiwiaWF0IjoxNzM1NDY1NTU3LCJleHAiOjE3MzU0NjU2Nzd9.XA9cfLy28ecssoCFRtZm3Y5SsNO6yQLyZeJeZod4aGQ', 
    type: 'string',
    format: 'jwt token'
  })
  @Expose()
  access_token: string;
}
