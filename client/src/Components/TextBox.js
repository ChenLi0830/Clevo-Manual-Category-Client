import React from 'react'
import {compose, lifecycle, withHandlers, withState, branch, renderComponent} from 'recompose'
import {Button, Cascader, Dropdown, Icon, Menu, message, Table, Tag, Radio} from 'antd'
import {graphql, withApollo} from 'react-apollo'
import {validatorByName, validatorValidateCall} from '../graphql/operator'
import {getCallBySkip} from '../graphql/speech'
import {connect} from 'react-redux'

const RadioGroup = Radio.Group

const styles = {
  btn: {
    marginLeft: 'auto',
    marginRight: 'auto',
    display: 'block'
  },
  businessDropdown: {
    width: 240,
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto'
  }
}

const keyToCategory = {
  //
  'intro': '开头语',
  'check-cell': '手机号核实',
  'leading-question': '引导性提问',
  'answer-question': '解答用户问题',
  'please-wait': '等待提示',
  'thanks-4-wait': '等待感谢/致歉',
  'end': '结束语',
  'service-others': '其他',

  'charge': '查询扣款',
  'send-sms': '补发短信',
  'pay-failed': '付款失败',
  'customer-others': '其他'
}

const options = [{
  value: 'huafubao',
  label: '话付宝',
  children: [
    {
      value: 'reasonToBeCharged',
      label: '查询扣款'
    },
    {
      value: 'sendSMS',
      label: '补发短信'
    },
    {
      value: 'paymentFailed',
      label: '付款失败'
    },
    {
      value: 'others',
      label: '其他'
    }
  ]
}, {
  value: 'xiaoeSMS',
  label: '小额短信业务',
  children: [
    {
      value: 'reasonToBeCharged',
      label: '查询扣款'
    },
    {
      value: 'sendSMS',
      label: '补发短信'
    },
    {
      value: 'paymentFailed',
      label: '付款失败'
    },
    {
      value: 'others',
      label: '其他'
    }
  ]
}]

const TextBox = (props) => {
  console.log('EmotionAnalyzer props', props)
  
  let tableData = []
  let title = () => <span>尚未获取文本</span>
  
  // console.log("EmotionAnalyzer props.summaryList", props.summaryList);
  
  // get table data source
  if (props.operatorCellphone && !props.data.loading) {
    const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech
    const {speechCount, sentenceCount, categorizedFileNames} = props.data.operator
    
    console.log('file name:', fileName)
    
    const transcriptList = JSON.parse(transcriptionText)
    
    // console.log("transcriptList", transcriptList);
    console.log('transcriptList', JSON.stringify(transcriptList))
    tableData = transcriptList.map((transcript, index) => {
      let categoryName = props.categorizeResult[index] &&
          props.categorizeResult[index].categoryName
      let categoryKey = props.categorizeResult[index] && props.categorizeResult[index].categoryKey
      return {
        key: transcript.bg,
        bg: transcript.bg,
        ed: transcript.ed,
        speaker: transcript.speaker,
        speakerRole: transcript.speaker === '1' ? '客服' : '顾客',
        text: transcript.onebest,
        categoryName: categoryName || "non-categorized",
        categoryKey: categoryKey || null,
        fileNameBeginTime: `${fileName}-${transcript.bg}`,
        fileName: fileName,
        operatorId: props.operatorCellphone
      }
    })
    
    title = () => <div>
      你的战绩：
      <Tag color='green'>分类对话总计 {~~speechCount} 篇</Tag>
      <Tag color='blue'>分类句子总计 {~~sentenceCount} 句</Tag>
    </div>
  }

  // get table column
  const serviceMenu = (index) => {
    return <Menu onClick={(event) => props.onChooseCategory(event, index)}>
      <Menu.Item key='intro'>开头语 (样例：您好！621号为您服务)</Menu.Item>
      <Menu.Item key='check-cell'>手机号核实（样例：要办理业务的是来电号码吗）</Menu.Item>
      <Menu.Item key='leading-question'>引导性提问（样例：您是想用话费充QQ币，然后想咨询能不能充是吗？）</Menu.Item>
      <Menu.Item key='answer-question'>解答用户问题</Menu.Item>
      <Menu.Item key='please-wait'>等待提示 (样例：请您稍等，我帮您查询一下)</Menu.Item>
      <Menu.Item key='thanks-4-wait'>等待感谢/致歉 (样例：感谢您耐心等待/抱歉让您久等了)</Menu.Item>
      <Menu.Item key='end'>结束语（还有其他能为您服务的吗/请您稍候评价）</Menu.Item>
      <Menu.Item key='service-others'>其他</Menu.Item>
    </Menu>
  }
  
  const customerMenu = (index) => {
    return <Menu onClick={(event) => props.onChooseCategory(event, index)}>
      <Menu.Item key='charge'>查询扣款</Menu.Item>
      <Menu.Item key='send-sms'>补发短信</Menu.Item>
      <Menu.Item key='pay-failed'>付款失败</Menu.Item>
      <Menu.Item key='customer-others'>其他</Menu.Item>
    </Menu>
  }
  
  
  const columns = [{
    title: '说话人',
    dataIndex: 'speakerRole',
    key: 'speakerRole',
    width: '10%'
    // render: text => <a href="#">{text}</a>,
  }, {
    title: '转译内容',
    dataIndex: 'text',
    key: 'text',
    width: '60%'
  }, {
    title: '分类',
    dataIndex: 'categoryName',
    key: 'categoryName',
    width: '10%'
  }, {
    title: 'Action',
    key: 'action',
    width: '20%',
    render: (text, record, index) => (
      <span>
          <a >Action 一 {record.name}</a>
          <span className='ant-divider' />
          <Dropdown overlay={tableData[index].speakerRole === '客服' ? serviceMenu(index)
          : customerMenu(index)}>
        <a className='ant-dropdown-link'>
          分类 <Icon type='down' />
        </a>
      </Dropdown>
        </span>
    )
  }]
  
  return <div>
    <div style={{backgroundColor: 'white', margin: '30px 0'}}>
      <Table columns={columns}
          // rowKey={record => record.key}
        dataSource={tableData}
          // scroll={{y: 240}}
        title={title}
        pagination={false}
        loading={props.data.loading}
        footer={() => <Cascader style={styles.businessDropdown} options={options}
               onChange={props.onBusiDropdownChange}
               placeholder='请选择：该次电话业务类别' />}
        bordered
      />
    </div>

    {/* <Input placeholder="Basic usage" />*/}

    <Button onClick={() => props.onSubmit(tableData)} style={styles.btn} type='primary'>
      提交分类结果
    </Button>

  </div>
}

export default compose(
    connect(
        (state) => ({
          operatorCellphone: state.app.operator
        })
    ),
    graphql(
      validatorByName,
      {
        name: 'validator',
        options: (props) => ({
          variables: {validatorName: props.operatorCellphone}
        })
      }
    ),
    branch(
      props => {
        console.log('props.validator', props.validator)
        return props.validator.loading
      },
      renderComponent(props => <h1>Loading</h1>)
    ),
    graphql(
      getCallBySkip,
      {
        name: 'call',
        options: (props) => ({
          variables: {
            skip: props.validator.validatorByName.validatedCalls.length
          }
        })
      }
    ),
    branch(
      props => {
        console.log('props.call', props.call)
        return props.call.loading
      },
      renderComponent(props => <h1>Loading</h1>)
    ),
    // graphql(),
    // withState('categorizeResult', 'updateCateResult', {}),
    withState('riskyValue', 'updateRiskyValue', null),
    withApollo,
    graphql(validatorValidateCall, { name: 'validateCallMutation' }), // define mutation
    withHandlers({
      onChangeRiskyValue: props => (e) => {
        console.log('radio checked', e.target.value)
        props.updateRiskyValue(e.target.value)
      },

      onSubmit: props => async () => {
        console.log('onSubmit props', props)
        if (props.riskyValue === null) {
          return message.error('请选择危险级别')
        }

        try {
          let callId = props.call.calls[0]._id
          let validatorId = props.validator.validatorByName._id

          await props.validateCallMutation({
            variables: {
              validatorId: validatorId,
              callId: callId,
              rating: props.riskyValue
            },
            refetchQueries: [
              { query: getCallBySkip, variables: {skip: props.validator.validatorByName.validatedCalls.length + 1} },
              { query: validatorByName, variables: {validatorName: props.operatorCellphone} }
            ]
          })

          props.updateRiskyValue(null)
        } catch (error) {
          console.error(error)
        }
        // // validatorUpdateMutation
        // // callUpdateMutation
        // const {transcriptionText, fileName, transcribedAt, categorizedCount} = props.data.operator.rawSpeech

        // props.updateCateResult({})

        // await props.mutate({
        //   variables: {
        //     fileName: fileName,
        //     operatorId: props.operatorCellphone,
        //     needReverseSpeaker: false, // todo change this
        //     businessType: props.businessType,
        //     sentenceList: tableData.map(record => ({
        //       'categoryName': record.categoryName,
        //       'fileNameBeginTime': record.fileNameBeginTime,
        //       'operatorId': record.operatorId,
        //       'fileName': record.fileName,
        //       'text': record.text,
        //       'bg': record.bg,
        //       'ed': record.ed,
        //       'speaker': record.speaker
        //     }))
        //   },
        //   refetchQueries: [{query: getOperator, variables: {cellphone: props.operatorCellphone} }]
        // })
      }
    })
  )(props => {
    console.log('TextBox props', props)

    let call = props.call.calls[0]
    let transcript = call.breakdowns.map(sentence => sentence.transcript).join('|')
    console.log('transcript', transcript)

    // return <RadioGroup name='radiogroup'>
    //   <Radio value={0}>正常</Radio>
    //   <Radio value={1}>比较正常</Radio>
    //   <Radio value={2}>不确定</Radio>
    //   <Radio value={3}>有违法倾向</Radio>
    //   <Radio value={4}>违法</Radio>
    // </RadioGroup>
    return <div>
      <h1>{transcript}</h1>
      <RadioGroup name='radiogroup' onChange={props.onChangeRiskyValue} value={props.riskyValue}>
        <Radio value={0}>正常</Radio>
        <Radio value={1}>比较正常</Radio>
        <Radio value={2}>可能违法</Radio>
        <Radio value={3}>违法</Radio>
      </RadioGroup>

      <Button onClick={props.onSubmit}>
        提交
      </Button>
    </div>
  })
// )(TextBox)
