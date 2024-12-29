import { fillObject } from "assets/utils/utils";

import { validate } from "class-validator";

import { Injectable, PipeTransform, ArgumentMetadata, BadRequestException } from "@nestjs/common";



@Injectable()
export class HttpBodyValidationPipe implements PipeTransform {
  constructor (
    private readonly classDto: new () => any,
  ) { }


  async transform(value: any, metadata: ArgumentMetadata) {
    const targetObj = fillObject(this.classDto, value);
    const validateErrors = await validate(targetObj);

    if (validateErrors.length > 0) {
      console.error(validateErrors);

      throw new BadRequestException(validateErrors.toString());
    }


    return value;
  }

}

