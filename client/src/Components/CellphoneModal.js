import React from 'react'
import {Modal, Tag, Button} from 'antd'
import {compose, withState, withHandlers} from 'recompose'
import { Input } from 'antd'

const CellphoneModal = (props) => {
  console.log('CellphoneModal props', props)
  const modalFooter = <div>
    <Button key='finish' type='primary' size='large' onClick={props.onLogin} loading={props.loading}>
      登录
    </Button>
  </div>
  
  return <Modal
    title='快速登录'
    visible={props.visible}
    maskClosable={false}
    closable={false}
    footer={modalFooter}
  >
    <p>请输入你的手机号</p>
    <Input placeholder='例子：6044013925' value={props.cellphone} onChange={(event) => props.updateCell(event.target.value)} />

  </Modal>
}

export default compose(
    withState('loading', 'updateLoading', false),
    withState('cellphone', 'updateCell', ''),
    withHandlers({
      // onCancel: props => () => {
      //   props.updateModal(false);
      // },
      onLogin: props => async (event) => {
        props.updateLoading(true)
        await props.onSubmit(props.cellphone)
        // await new Promise((resolve) => setTimeout(resolve, 1000));
        props.updateLoading(false)

        // props.updateModal(false);
        // props.startRecording(event);
      }
    })
)(CellphoneModal)
