import React from 'react';
import {compose, lifecycle, withHandlers, withState} from 'recompose';
import {Button, Cascader, Dropdown, Icon, Menu, message, Table, Tag} from 'antd';
import {graphql} from 'react-apollo';
import {getOperator} from '../graphql/operator';
import {submitSpeech} from '../graphql/speech';
import {connect} from 'react-redux';

const styles = {
  btn: {
    marginLeft: "auto",
    marginRight: "auto",
    display: "block",
  },
  businessDropdown: {
    width: 240,
    display: "block",
    marginLeft: "auto",
    marginRight: "auto",
  },
};

const keyToCategory = {
  //
  "intro": "开头语",
  "check-cell": "手机号核实",
  "leading-question": "引导性提问",
  "answer-question": "解答用户问题",
  "please-wait": "等待提示",
  "thanks-4-wait": "等待感谢/致歉",
  "end": "结束语",
  "service-others": "其他",
  
  "charge": "查询扣款",
  "send-sms": "补发短信",
  "pay-failed": "付款失败",
  "customer-others": "其他",
};

const options = [{
  value: 'huafubao',
  label: '话付宝',
  children: [
    {
      value: 'reasonToBeCharged',
      label: '查询扣款',
    },
    {
      value: 'sendSMS',
      label: '补发短信',
    },
    {
      value: 'paymentFailed',
      label: '付款失败',
    },
    {
      value: 'others',
      label: '其他',
    }
  ],
}, {
  value: 'xiaoeSMS',
  label: '小额短信业务',
  children: [
    {
      value: 'reasonToBeCharged',
      label: '查询扣款',
    },
    {
      value: 'sendSMS',
      label: '补发短信',
    },
    {
      value: 'paymentFailed',
      label: '付款失败',
    },
    {
      value: 'others',
      label: '其他',
    }
  ],
}];

const EmotionAnalyzer = (props) => {
  console.log("EmotionAnalyzer props", props);
  
  let tableData = [];
  let title = () => <span>尚未获取文本</span>;
  
  // console.log("EmotionAnalyzer props.summaryList", props.summaryList);
  
  // get table data source
  if (props.operatorCell && !props.data.loading) {
    const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech;
    const {speechCount, sentenceCount, categorizedFileNames} = props.data.operator;
    
    const transcriptList = JSON.parse(transcriptionText);
    
    console.log("transcriptList", transcriptList);
    tableData = transcriptList.map((transcript, index) => {
      let categoryName = props.categorizeResult[index] &&
          props.categorizeResult[index].categoryName;
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
    
    
    title = () => <div>
      你的战绩：
      <Tag color="green">分类对话总计 {~~speechCount} 篇</Tag>
      <Tag color="blue">分类句子总计 {~~sentenceCount} 句</Tag>
    </div>;
  }
  
  // get table column
  const serviceMenu = (index) => {
    return <Menu onClick={(event) => props.onChooseCategory(event, index)}>
      <Menu.Item key="intro">开头语 (样例：您好！621号为您服务)</Menu.Item>
      <Menu.Item key="check-cell">手机号核实（样例：要办理业务的是来电号码吗）</Menu.Item>
      <Menu.Item key="leading-question">引导性提问（样例：您是想用话费充QQ币，然后想咨询能不能充是吗？）</Menu.Item>
      <Menu.Item key="answer-question">解答用户问题</Menu.Item>
      <Menu.Item key="please-wait">等待提示 (样例：请您稍等，我帮您查询一下)</Menu.Item>
      <Menu.Item key="thanks-4-wait">等待感谢/致歉 (样例：感谢您耐心等待/抱歉让您久等了)</Menu.Item>
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
      <span className="ant-divider"/>
      <Dropdown overlay={tableData[index].speakerRole === "客服" ? serviceMenu(index) :
          customerMenu(index)}>
        <a className="ant-dropdown-link">
          分类 <Icon type="down"/>
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
             title={title}
             pagination={false}
             loading={props.data.loading}
             footer={() => <Cascader style={styles.businessDropdown} options={options}
                                     onChange={props.onBusiDropdownChange}
                                     placeholder="请选择：该次电话业务类别"/>}
             bordered={true}
      />
    </div>
    
    {/*<Input placeholder="Basic usage" />*/}
    
    <Button onClick={() => props.onSubmit(tableData)} style={styles.btn} type="primary">
      提交分类结果
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
    withState('businessType', 'updateBusinessType', []),
    withHandlers({
      onChooseCategory: props => (event, index) => {
        let newResult = props.categorizeResult;
        
        newResult[index] = {categoryName: keyToCategory[event.key], categoryKey: event.key};
        props.updateCateResult(newResult);
      },
      
      onSubmit: props => async (tableData) => {
        console.log("tableData", tableData);
        console.log("props.categorizeResult", props.categorizeResult);
        if (props.businessType.length === 0) {
          return message.error('请选择业务类型');
        } else if (Object.keys(props.categorizeResult).length < tableData.length) {
          return message.error('请完成每句话的分类再提交');
        }
        
        const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech;
        
        props.updateCateResult({});
        
        await props.mutate({
          variables: {
            fileName: fileName,
            operatorId: props.operatorCell,
            needReverseSpeaker: false, // todo change this
            businessType: props.businessType,
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
      
      onBusiDropdownChange: props => (value) => {
        props.updateBusinessType(value);
      }
    }),
    lifecycle({
      componentWillMount(){
      }
    }),
)(EmotionAnalyzer);