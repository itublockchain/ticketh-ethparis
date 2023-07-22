import { ApiProperty } from '@nestjs/swagger';

export class NFTQueryDto {
  @ApiProperty()
  address: string;
}
