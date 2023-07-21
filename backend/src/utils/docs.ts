import { applyDecorators } from '@nestjs/common';
import type { ApiOperationOptions } from '@nestjs/swagger';
import { ApiOperation } from '@nestjs/swagger';

export const DefaultApiOperation = (
  summary: string,
  rest: Omit<Partial<ApiOperationOptions>, 'summary'> = {},
): (<TFunction extends Function, Y>(
  target: object | TFunction,
  propertyKey?: string | symbol,
  descriptor?: TypedPropertyDescriptor<Y>,
) => void) => {
  return applyDecorators(
    ApiOperation({
      summary,
      ...rest,
    }),
  );
};
