import { ApiProperty } from '@nestjs/swagger';

export class EventByIdParams {
  @ApiProperty()
  id: number;
}
