import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  AttestationCreateDto,
  AttestationCreateParamDto,
  AttestationDto,
  AttestationParamDto,
} from 'src/modules/eas/Eas.dto';
import { EasService } from 'src/modules/eas/Eas.service';
import { GraphqlResponse } from 'src/modules/eas/EasGraphQLSchemas';
import { DefaultApiOperation } from 'src/utils/docs';

@ApiTags('EAS')
@Controller('eas')
export class EasController {
  constructor(private easService: EasService) {}

  @DefaultApiOperation('Get attestation by id')
  @Get('attestation/:id')
  public async genAttestationById(
    @Param() params: AttestationParamDto,
  ): Promise<GraphqlResponse<AttestationDto | null>> {
    return this.easService.genNullableAttestationById(params.id);
  }

  @DefaultApiOperation('Create a new attestation for event')
  @Post('attestation/:eventId')
  public async genCreateAttestation(
    @Param() param: AttestationCreateParamDto,
    @Body() body: AttestationCreateDto,
  ): Promise<AttestationDto | void> {
    return this.easService.genCreateAttestation(param.eventId, body);
  }
}
