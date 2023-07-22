import { RequestDocument, Variables, request } from 'graphql-request';
import {
  AttestationByIdQuerySchema,
  GraphqlResponse,
} from 'src/modules/eas/EasGraphQLSchemas';

import {
  EAS,
  OffchainAttestationParams,
  SchemaEncoder,
  SignedOffchainAttestation,
} from '@ethereum-attestation-service/eas-sdk';
import { Environment } from 'src/utils/Environment';
import { getRpcProvider } from 'src/utils/getRPCProvider';
import { AttestationCreateDto, AttestationDto } from 'src/modules/eas/Eas.dto';
import { getSigner } from 'src/utils/getSigner';
import { v4 as uuid } from 'uuid';
import { getTimestamp } from 'src/utils/getTimestamp';

export class EasGraphQLService {
  public static async genAttestation(
    attestationId: string,
  ): Promise<GraphqlResponse<AttestationDto>> {
    return await this.graphqlRequest(AttestationByIdQuerySchema, {
      id: attestationId,
    });
  }

  public static async genCreateAttestation(
    attestation: AttestationCreateDto,
  ): Promise<void> {
    // const eas = this.getEasInstance();
    // const offchain = await eas.getOffchain();
    // const signer = getSigner();
    // const encodedData = this.getEncodedData('-1', '-1');

    // const offchainAttestation = await offchain.signOffchainAttestation(
    //   {
    //     recipient: '0xFD50b031E778fAb33DfD2Fc3Ca66a1EeF0652165',
    //     expirationTime: 0,
    //     time: 1671219636,
    //     revocable: true,
    //     nonce: 0,
    //     schema:
    //       '0xb16fa048b0d597f5a821747eba64efa4762ee5143e9a80600d0005386edfc995',
    //     refUID:
    //       '0x0000000000000000000000000000000000000000000000000000000000000000',
    //     data: encodedData,
    //     version: 0,
    //   },
    //   signer,
    // );

    // console.log(offchainAttestation);

    return;
  }

  public static async genSignedOffChainAttestation(
    eventId: string,
    attestation: AttestationCreateDto,
  ): Promise<SignedOffchainAttestation> {
    const eas = this.getEasInstance();
    const offchain = await eas.getOffchain();
    const signer = getSigner();

    const dataAppendedAttestation: OffchainAttestationParams = {
      recipient: attestation.recipient,
      expirationTime: attestation.expirationTime,
      time: getTimestamp(),
      revocable: attestation.revocable,
      nonce: eventId,
      schema: Environment.EAS_SCHEMA_UID,
      refUID:
        attestation.refUID ??
        '0x0000000000000000000000000000000000000000000000000000000000000000',
      data: this.getEncodedData(eventId, uuid()),
      version: 0,
    };

    const offchainAttestation = await offchain.signOffchainAttestation(
      dataAppendedAttestation,
      signer,
    );

    return offchainAttestation;
  }

  public static getEncodedData(eventId: string, ticketId: string): string {
    const schemaEncoder = new SchemaEncoder('string eventId, string ticketId');
    const encodedData = schemaEncoder.encodeData([
      { name: 'eventId', value: eventId, type: 'string' },
      { name: 'ticketId', value: ticketId, type: 'string' },
    ]);
    return encodedData;
  }

  public static getEasInstance(): EAS {
    const eas = new EAS(Environment.EAS_CONTRACT);
    const provider = getRpcProvider();
    eas.connect(provider);
    return eas;
  }

  public static async graphqlRequest<T>(
    document: RequestDocument,
    variables?: Variables,
  ): Promise<T> {
    return request(this.getGraphQLUrl(), document, variables);
  }

  public static getGraphQLUrl(): string {
    return 'https://easscan.org/graphql';
  }
}
