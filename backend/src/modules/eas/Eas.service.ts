import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { HttpStatusCode } from 'axios';
import { Attestation } from 'src/entities/Attestation.entity';
import { AttestationCreateDto, AttestationDto } from 'src/modules/eas/Eas.dto';
import { GraphqlResponse } from 'src/modules/eas/EasGraphQLSchemas';
import { EasGraphQLService } from 'src/modules/eas/EasGraphQLService';
import { EventService } from 'src/modules/event/Event.service';
import { Repository } from 'typeorm';

@Injectable()
export class EasService {
  constructor(
    private eventService: EventService,

    @InjectRepository(Attestation)
    private attestationRepository: Repository<Attestation>,
  ) {}

  public async genNullableAttestationById(
    attestationId: string,
    isGraphQL = false,
  ): Promise<GraphqlResponse<AttestationDto>> {
    if (isGraphQL) {
      return await EasGraphQLService.genAttestation(attestationId);
    } else {
      const attestation = await this.attestationRepository.findOne({
        where: {
          uid: attestationId,
        },
      });

      if (attestation == null) {
        return { data: null };
      }

      const parsed: AttestationDto = JSON.parse(attestation.messageJSON);

      return {
        data: parsed,
      };
    }
  }

  public async genCreateAttestation(
    eventId: string,
    attestationDto: AttestationCreateDto,
    isGraphQL = false,
  ): Promise<AttestationDto | void> {
    if (isGraphQL) {
      return await EasGraphQLService.genCreateAttestation(attestationDto);
    } else {
      const event = await this.eventService.genNullableEventById(
        Number(eventId),
      );

      if (event == null) {
        throw new HttpException(
          'Event does not exist',
          HttpStatusCode.BadRequest,
        );
      }

      const signedOffChainAttestation =
        await EasGraphQLService.genSignedOffChainAttestation(
          eventId,
          attestationDto,
        );

      const formattedAttestation: Partial<Attestation> = {
        domainJSON: JSON.stringify(signedOffChainAttestation.domain),
        messageJSON: JSON.stringify(signedOffChainAttestation.message),
        uid: signedOffChainAttestation.uid,
        signatureJSON: JSON.stringify(signedOffChainAttestation.signature),
        primaryType: String(signedOffChainAttestation.primaryType),
      };

      const newAttestation =
        this.attestationRepository.create(formattedAttestation);

      const savedAttestation = await this.attestationRepository.save(
        newAttestation,
      );

      const parsed: AttestationDto = {
        uid: savedAttestation.uid,
        ...JSON.parse(savedAttestation.messageJSON),
      };

      return parsed;
    }
  }
}
