import { gql } from 'react-apollo'

const validatorByName = gql`
query validatorByName($validatorName: String!){
  validatorByName(name: $validatorName) {
    _id
    name
    status
    validatedCalls {
      _id
      status
      format
      encoding
      source
      startedAt
      subject
      createdAt
      updatedAt
    }
  }
}
`

const validatorCreate = gql`
mutation validatorCreate($validatorName: String){
  validatorCreate(record: {
    name: $validatorName
  }) {
    recordId
    record{
      name
      status
    }
  }
}
`

const validatorValidateCall = gql`
mutation validatorValidateCall ($validatorId: ID!, $callId: ID!,  $rating: Int!){
  validatorValidateCall(
    validatorId:$validatorId
    callId: $callId
    rating: $rating
  ) {
    name
    validatedCalls {
      source
      _id
    }
    _id
  }
}
`

export { validatorByName, validatorCreate, validatorValidateCall }
