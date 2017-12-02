import { gql } from 'react-apollo'

const getCallBySkip = gql`
query getCallBySkip($skip: Int){
  calls(skip: $skip, limit: 1){
    _id
    riskyRatings {
      validator
      rating
      _id
    }
    breakdowns {
      begin
      end
      transcript
      intent
      speaker
    }
  }
}
`

const callUpdateRikyRatings = gql`
mutation callUpdateRikyRatings($callId: MongoID!, $riskyRatings: [CallCallRiskyRatingsInput]){
  callUpdate(record: {
    _id: $callId
    riskyRatings: $riskyRatings
    # validators
  }) {
    recordId
    record{
      riskyRatings {
        # validator
        rating
        # _id
      }
      validators {
        name
        status
        createdAt
        updatedAt
      }
    }
  }
}
`

export { getCallBySkip, callUpdateRikyRatings }
