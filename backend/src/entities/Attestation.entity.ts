import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Attestation {
  @ApiProperty()
  @PrimaryGeneratedColumn('increment')
  id: number;

  @ApiProperty()
  @Column()
  uid: string;

  @ApiProperty()
  @Column({ length: 5000 })
  domainJSON: string;

  @ApiProperty()
  @Column({ length: 5000 })
  messageJSON: string;

  @ApiProperty()
  @Column({ length: 5000 })
  signatureJSON: string;

  @ApiProperty()
  @Column()
  primaryType: string;
}
