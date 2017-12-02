import { gql } from 'react-apollo'

const submitSpeech = gql`
mutation($fileName: String, $operatorId: String, $needReverseSpeaker: Boolean, $sentenceList: [SentenceInput], $businessType:[String]){
  speechSubmit(fileName: $fileName, operatorId: $operatorId, needReverseSpeaker:$needReverseSpeaker, sentenceList: $sentenceList, businessType:$businessType){
    id,
    fileName,
    operatorId,
    needReverseSpeaker,
    businessType,
    sentenceList{
      id,
      categoryName,
      fileNameBeginTime,
      operatorId,
      fileName,
      text,
      bg,
      ed,
      speaker
    }
  }
}
`

export { submitSpeech }
