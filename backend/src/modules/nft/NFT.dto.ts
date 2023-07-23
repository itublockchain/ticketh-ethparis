import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class NFTQueryDto {
  @ApiProperty()
  address: string;
}

export class HasNFTQueryDto {
  @ApiProperty()
  address: string;

  @ApiProperty()
  tokenId: number;
}

export class PasskitDto {
  @ApiProperty()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsNotEmpty()
  eventId: string;
}
