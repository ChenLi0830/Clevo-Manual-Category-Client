import React from 'react';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import {Button, Icon, Table, Upload} from 'antd';
import {graphql, withApollo} from 'react-apollo';
import {upsertOperator, getOperator} from '../graphql/operator';
import { Menu, Dropdown } from 'antd';

let options = {
  url: {
    tokenUrl: 'https://token.beyondverbal.com/token',
    // serverUrl: 'https://apiv3.beyondverbal.com/v1/recording/'
    serverUrl: 'https://apiv4.beyondverbal.com/v3/recording/',
  },
  apiKey: "70e0885c-2ade-48b8-bc69-556dc49417cd",
  token: ''
};

const styles = {
  btn: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  }
};

const EmotionAnalyzer = (props) => {
  const menu = (index) => {
    return <Menu onClick={(event) => props.onClick(event, index)}>
      <Menu.Item key="1">1st menu item</Menu.Item>
      <Menu.Item key="2">2nd memu item</Menu.Item>
      <Menu.Item key="3">3d menu item</Menu.Item>
    </Menu>
  };
  
  const columns = [{
    title: '说话人',
    dataIndex: 'speaker',
    key: 'speaker',
    width: '15%',
    // render: text => <a href="#">{text}</a>,
  }, {
    title: '转译内容',
    dataIndex: 'transcript',
    key: 'transcript',
    width: '60%',
  }, {
    title: 'Action',
    key: 'action',
    width: '25%',
    render: (text, record, index) => (
        <span>
      <a href="#">Action 一 {record.name}</a>
      <span className="ant-divider" />
      <a href="#">Delete</a>
      <span className="ant-divider" />
      <Dropdown overlay={menu(index)}>
        <a href="#" className="ant-dropdown-link">
          分类 <Icon type="down" />
        </a>
      </Dropdown>
    </span>
    ),
  }];
  
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
        speaker: transcript.speaker === "1" ? "客服" : "顾客",
        transcript: transcript.onebest,
      }
    });
    
    console.log("tableData", tableData);
  }
  
  
  
  return <div>
    <div style={{backgroundColor: "white", margin: "30px 0"}}>
      <Table columns={columns}
             // rowKey={record => record.key}
             dataSource={tableData}
             // scroll={{y: 240}}
             pagination={false}
             loading={props.data.loading}
             footer={() => ''}
             bordered={true}
          // onChange={this.handleTableChange}
      />
    </div>
  
    {/*<Table columns={columns}*/}
           {/*rowKey={record => record.name + record.time}*/}
           {/*dataSource={props.summaryList}*/}
           {/*scroll={{y: 240}}*/}
        {/*// pagination={this.state.pagination}*/}
        {/*//    loading={props.fileList.length > 0 && props.data.length === 0}*/}
        {/*// onChange={this.handleTableChange}*/}
    {/*/>*/}
  
    <Button onClick={props.startAnalyzeFiles} style={styles.btn}>
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
      onClick: props => (event, index) => {
        console.log("event", event);
        console.log("index", index);
      }
    }),
    // withState('token', 'updateToken', () => {
    //   return "123";
    // }),
    
    
    lifecycle({
      componentWillMount(){
      }
    }),
)(EmotionAnalyzer);