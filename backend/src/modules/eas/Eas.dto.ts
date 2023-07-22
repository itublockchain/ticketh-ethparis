import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty } from 'class-validator';

export class AttestationDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uid: string;

  @ApiProperty()
  attester: string;

  @ApiProperty()
  recipient: string;

  @ApiProperty()
  refUID: string;

  @ApiProperty()
  revocable: string;

  @ApiProperty()
  revocationTime: string;

  @ApiProperty()
  expirationTime: string;

  @ApiProperty()
  data: string;

  @ApiProperty()
  version: number;
}

export class AttestationCreateDto {
  @ApiProperty()
  @IsNotEmpty()
  uid: string;

  @ApiProperty()
  @IsNotEmpty()
  attester: string;

  @ApiProperty()
  @IsNotEmpty()
  recipient: string;

  @ApiProperty()
  refUID: string;

  @ApiProperty()
  @IsNotEmpty()
  revocable: boolean;

  @ApiProperty()
  @IsNotEmpty()
  revocationTime: number;

  @ApiProperty()
  @IsNotEmpty()
  expirationTime: number;

  @ApiProperty()
  @IsNotEmpty()
  version: number;
}

export class AttestationParamDto {
  @ApiProperty()
  id: string;
}

export class AttestationCreateParamDto {
  @ApiProperty()
  eventId: string;
}
