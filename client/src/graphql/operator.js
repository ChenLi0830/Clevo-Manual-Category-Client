import {gql}from 'react-apollo';

const getOperator = gql`
query($cellphone: String){
  operator(cellphone:$cellphone){
  	id
    cellphone
    categorizedFileNames,
    speechCount,
    sentenceCount,
    rawSpeech{
      fileName,
      transcribedAt,
      transcriptionText,
      categorizedCount
    }
	}
}
`;

const upsertOperator = gql`
mutation($cellphone: ID){
  operatorUpsert(cellphone: $cellphone){
    id,
    cellphone,
    categorizedFileNames,
    speechCount,
    sentenceCount,
    rawSpeech{
      fileName,
      transcribedAt,
      transcriptionText,
      categorizedCount
    }
  }
}
`;

export {
  getOperator,
  upsertOperator,
}