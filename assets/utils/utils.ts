import * as bcrypt from 'bcrypt';
import { ClassConstructor, plainToInstance } from "class-transformer";



export const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
};

export const fillObject = <T, V>(someDto: ClassConstructor<T>, plainObject: V) => {
  return plainToInstance(someDto, plainObject);
};

export const bcryptHashPassword = async (password: string): Promise<string> => {
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(password, saltRounds);


  return hashedPassword;
};

export const bcryptComparePassword = async (password: string, hashedPassword: string): Promise<boolean> => {
  const match = await bcrypt.compare(password, hashedPassword);

  
  return match;
};
