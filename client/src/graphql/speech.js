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

export { getCallBySkip }
