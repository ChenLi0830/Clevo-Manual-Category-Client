import React from 'react';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import {Button, Icon, Table, Upload} from 'antd';
import {graphql, withApollo} from 'react-apollo';
import {upsertOperator, getOperator} from '../graphql/operator';

let options = {
  url: {
    tokenUrl: 'https://token.beyondverbal.com/token',
    // serverUrl: 'https://apiv3.beyondverbal.com/v1/recording/'
    serverUrl: 'https://apiv4.beyondverbal.com/v3/recording/',
  },
  apiKey: "70e0885c-2ade-48b8-bc69-556dc49417cd",
  token: ''
};



const columns = [{
  title: '说话人',
  dataIndex: 'speaker',
  key: 'speaker',
  // render: text => <a href="#">{text}</a>,
}, {
  title: '转译文本',
  dataIndex: 'transcript',
  key: 'transcript',
}, {
  title: 'Action',
  key: 'action',
  render: (text, record) => (
      <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <a href="#" className="ant-dropdown-link">
        More actions <Icon type="down" />
      </a>
    </span>
  ),
}];


const EmotionAnalyzer = (props) => {
  console.log("EmotionAnalyzer props", props);
  // console.log("EmotionAnalyzer props.summaryList", props.summaryList);
  
  let tableData = [];
  if (!props.data.loading) {
    const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech;
  
    const transcriptList = JSON.parse(transcriptionText);
  
    tableData = transcriptList.map(transcript => {
      console.log("transcript.bg", transcript.bg);
      return {
        key: transcript.bg,
        speaker: transcript.speaker,
        transcript: transcript.onebest,
      }
    });
    
    console.log("tableData", tableData);
  }
  
  
  
  return <div>
    <Table columns={columns}
           // rowKey={record => record.key}
           dataSource={tableData}
           scroll={{y: 240}}
        // pagination={this.state.pagination}
           loading={props.data.loading}
        // onChange={this.handleTableChange}
    />
  
    {/*<Table columns={columns}*/}
           {/*rowKey={record => record.name + record.time}*/}
           {/*dataSource={props.summaryList}*/}
           {/*scroll={{y: 240}}*/}
        {/*// pagination={this.state.pagination}*/}
        {/*//    loading={props.fileList.length > 0 && props.data.length === 0}*/}
        {/*// onChange={this.handleTableChange}*/}
    {/*/>*/}
  
    <Button onClick={props.startAnalyzeFiles}>
      Analyze
    </Button>

  </div>
};

export default compose(
    graphql(
        getOperator,
        {
          options: (props) => ({
            variables: {cellphone: "16044013925"},
            // variables: {id: props.userId},
          })
        }
    ),
    withHandlers({
      // initTranscript: props =>
    }),
    // withState('token', 'updateToken', () => {
    //   return "123";
    // }),
    
    
    lifecycle({
      componentWillMount(){
      }
    }),
)(EmotionAnalyzer);