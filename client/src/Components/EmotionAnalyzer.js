import React from 'react';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import {Button, Icon, Table, Upload} from 'antd';
import {graphql, withApollo} from 'react-apollo';
import {upsertOperator, getOperator} from '../graphql/operator';
import {submitSpeech} from '../graphql/speech';
import { Menu, Dropdown } from 'antd';
import {connect} from 'react-redux';
import {appActions} from '../modules';

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

const keyToCategory = {
  //
  "intro": "开头语",
  "check-cell": "手机号核实",
  "leading-question": "引导性提问",
  "answer-question": "解答用户问题",
  "please-wait": "等待提示",
  "thanks-4-wait": "等待感谢/致歉",
  "service-others": "其他",
  
  "charge": "查询扣款",
  "send-sms": "补发短信",
  "pay-failed": "付款失败",
  "customer-others": "其他",
};


const EmotionAnalyzer = (props) => {
  let tableData = [];
  
  console.log("EmotionAnalyzer props", props);
  // console.log("EmotionAnalyzer props.summaryList", props.summaryList);
  
  // get table data source
  if (props.operatorCell && !props.data.loading) {
    const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech;
  
    const transcriptList = JSON.parse(transcriptionText);
  
    console.log("transcriptList", transcriptList);
    tableData = transcriptList.map((transcript,index) => {
      let categoryName = props.categorizeResult[index] && props.categorizeResult[index].categoryName;
      let categoryKey = props.categorizeResult[index] && props.categorizeResult[index].categoryKey;
      return {
        key: transcript.bg,
        bg: transcript.bg,
        ed: transcript.ed,
        speaker: transcript.speaker,
        speakerRole: transcript.speaker === "1" ? "客服" : "顾客",
        text: transcript.onebest,
        categoryName: categoryName ? categoryName : "non-categorized",
        categoryKey: categoryKey ? categoryKey : null,
        fileNameBeginTime: `${fileName}-${transcript.bg}`,
        fileName: fileName,
        operatorId: props.operatorCell,
      }
    });
  }
  
  // get table column
  const serviceMenu = (index) => {
    return <Menu onClick={(event) => props.onChooseCategory(event, index)}>
      <Menu.Item key="intro">开头语(样例：您好！621号为您服务)</Menu.Item>
      <Menu.Item key="check-cell">手机号核实（样例：要办理业务的是来电号码吗）</Menu.Item>
      <Menu.Item key="leading-question">引导性提问（样例：您是想用话费充QQ币，然后想咨询能不能充是吗？）</Menu.Item>
      <Menu.Item key="answer-question">解答用户问题</Menu.Item>
      <Menu.Item key="please-wait">等待提示: (样例：请您稍等，我帮您查询一下)</Menu.Item>
      <Menu.Item key="thanks-4-wait">等待感谢/致歉: (样例：感谢您耐心等待/抱歉让您久等了)</Menu.Item>
      <Menu.Item key="end">结束语（还有其他能为您服务的吗/请您稍候评价）</Menu.Item>
      <Menu.Item key="service-others">其他</Menu.Item>
    </Menu>
  };
  
  const customerMenu = (index) => {
    return <Menu onClick={(event) => props.onChooseCategory(event, index)}>
      <Menu.Item key="charge">查询扣款</Menu.Item>
      <Menu.Item key="send-sms">补发短信</Menu.Item>
      <Menu.Item key="pay-failed">付款失败</Menu.Item>
      <Menu.Item key="customer-others">其他</Menu.Item>
    </Menu>
  };
  
  const columns = [{
    title: '说话人',
    dataIndex: 'speakerRole',
    key: 'speakerRole',
    width: '10%',
    // render: text => <a href="#">{text}</a>,
  }, {
    title: '转译内容',
    dataIndex: 'text',
    key: 'text',
    width: '60%',
  }, {
    title: '分类',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: '10%',
  }, {
    title: 'Action',
    key: 'action',
    width: '20%',
    render: (text, record, index) => (
      <span>
        <a >Action 一 {record.name}</a>
      <span className="ant-divider" />
      <Dropdown overlay={tableData[index].speakerRole === "客服" ? serviceMenu(index) : customerMenu(index)}>
        <a className="ant-dropdown-link">
          分类 <Icon type="down" />
        </a>
      </Dropdown>
    </span>
    ),
  }];
  
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
  
    <Button onClick={() => props.onSubmit(tableData)} style={styles.btn} type="primary">
      Submit
    </Button>

  </div>
};

export default compose(
    connect(
        (state) => ({
          operatorCell: state.app.operator,
        })
    ),
    graphql(
        getOperator,
        {
          options: (props) => ({
            variables: {cellphone: props.operatorCell},
            // variables: {id: props.userId},
          })
        }
    ),
    
    graphql(submitSpeech),
    withState('categorizeResult', 'updateCateResult', {}),
    withHandlers({
      onChooseCategory: props => (event, index) => {
        let newResult = props.categorizeResult;
        
        newResult[index] = {categoryName: keyToCategory[event.key], categoryKey: event.key};
        props.updateCateResult(newResult);
      },
      
      onSubmit: props => async (tableData) => {
        console.log("tableData", tableData);
        console.log("props.categorizeResult", props.categorizeResult);
        if (Object.keys(props.categorizeResult).length === 0) {
          return alert("分类未完成");
        }
        const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech;
  
        props.updateCateResult({});
        
        await props.mutate({
          variables: {
            fileName: fileName,
            operatorId: props.operatorCell,
            needReverseSpeaker: false, // todo change this
            sentenceList: tableData.map(record => ({
              "categoryName": record.categoryName,
              "fileNameBeginTime": record.fileNameBeginTime,
              "operatorId": record.operatorId,
              "fileName": record.fileName,
              "text": record.text,
              "bg": record.bg,
              "ed": record.ed,
              "speaker": record.speaker,
            })),
          },
          refetchQueries: [{query: getOperator, variables: {cellphone: props.operatorCell},}]
        });
        
        
      },
    }),
    lifecycle({
      componentWillMount(){
      }
    }),
)(EmotionAnalyzer);