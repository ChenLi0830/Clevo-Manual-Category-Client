import {gql} from 'react-apollo';

const submitSpeech = gql`
mutation($fileName: String, $operatorId: String, $needReverseSpeaker: Boolean, $sentenceList: [SentenceInput]){
  speechSubmit(fileName: $fileName, operatorId: $operatorId, needReverseSpeaker:$needReverseSpeaker, sentenceList: $sentenceList){
    id,
    fileName,
    operatorId,
    needReverseSpeaker,
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
`;

export {
  submitSpeech
}