import {
  Body,
  Controller,
  Get,
  HttpException,
  Param,
  Post,
  Req,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { HttpStatusCode } from 'axios';
import { Request } from 'express';
import {
  AttestationCreateDto,
  AttestationCreateParamDto,
  AttestationDto,
  AttestationParamDto,
} from 'src/modules/eas/Eas.dto';
import { EasService } from 'src/modules/eas/Eas.service';
import { GraphqlResponse } from 'src/modules/eas/EasGraphQLSchemas';
import { DefaultApiOperation } from 'src/utils/docs';
import { verifyAddress } from 'src/utils/verifyAddress';

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
    @Req() req: Request,
  ): Promise<AttestationDto | void> {
    const authorization = req.headers.authorization;
    const isVerified = verifyAddress(authorization, body.recipient);

    if (!isVerified) {
      throw new HttpException('Unauthorized', HttpStatusCode.Unauthorized);
    }

    return this.easService.genCreateAttestation(param.eventId, body);
  }
}
