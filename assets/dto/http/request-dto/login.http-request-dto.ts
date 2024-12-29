import { Expose } from "class-transformer";
import { IsString, MinLength, MaxLength, Matches } from "class-validator";

import { ApiProperty } from "@nestjs/swagger";

const passwordRegex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*[0-9])(?=.*[a-zа-яё])(?=.*[A-ZА-ЯЁ]).*$/;



export class LoginHttpRequestDto {
  @ApiProperty({
    description: 'Login', 
    example: 'peter999', 
    type: 'string', 
    minLength: 6, 
    maxLength: 32
  })
  @Expose()
  @IsString()
  @MinLength(6)
  @MaxLength(32)
  login: string;

  @ApiProperty({
    description: 'Password', 
    example: '@Aaa123456', 
    type: 'string', 
    minLength: 6, 
    maxLength: 20, 
    pattern: String(passwordRegex)
  })
  @Expose()
  @IsString()
  @MinLength(6)
  @MaxLength(20)
  @Matches(passwordRegex)
  password: string;
}
