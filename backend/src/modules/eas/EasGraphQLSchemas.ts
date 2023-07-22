import { gql } from 'graphql-request';

export type GraphqlResponse<T> = {
  data: T;
};

export const AttestationByIdQuerySchema = gql`
  query Attestation($id: String!) {
    attestation(where: { id: $id }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
    }
  }
`;

export const CreateAttestationMutation = gql`
  query Attestation($id: String!) {
    attestation(where: { id: $id }) {
      id
      attester
      recipient
      refUID
      revocable
      revocationTime
      expirationTime
      data
    }
  }
`;
