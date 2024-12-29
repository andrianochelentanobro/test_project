import { Expose } from "class-transformer";

import { UserInterface } from "assets/interface/user/user.interface";
import { ApiProperty } from "@nestjs/swagger";



export class GetMeHttpResponseDto implements Partial<UserInterface> {
  @ApiProperty({
    description: 'UUID v4', 
    example: '6784dc3d-19a3-47c8-a2cf-a154fce7eda4', 
    type: 'string',
    format: 'uuid v4'
  })
  @Expose()
  id: string;

  @ApiProperty({
    description: 'Username', 
    example: 'peteryahoo', 
    type: 'string'
  })
  @Expose()
  username: string;

  @ApiProperty({
    description: 'The date when the user was created',
    example: '2024-12-29T14:45:30.000Z',
    type: 'string',
    format: 'date-time',
  })
  @Expose()
  createdAt: Date;
}
