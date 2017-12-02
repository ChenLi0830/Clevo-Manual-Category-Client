import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import {withState, compose, withHandlers, lifecycle} from 'recompose'
import {graphql, withApollo} from 'react-apollo'
import {validatorByName, validatorCreate} from '../graphql/operator'
import {connect} from 'react-redux'
import {appActions} from '../modules'
import CellphoneModal from './CellphoneModal'
import { Tabs } from 'antd'

import TextBox from './TextBox'

const { Header, Content, Footer } = Layout
const TabPane = Tabs.TabPane

const styles = {
  wrapper: {
    background: 'none',
    minHeight: '100vh',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Helvetica, "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif'
  },
  logo: {
    color: '#fff',
    fontSize: '28px',
    fontWeight: 'normal',
    letterSpacing: '0.5px'
  },
  logout: {
    right: '10%',
    position: 'absolute',
    color: 'white'
  }
}

const App = (props) => {
  console.log('App props', props)
  return (
    <Layout style={styles.wrapper}>
      <Header style={{/* { position: 'fixed', width: '100%' } */}}>
        <span style={styles.logo}>Clevo</span>

        {
            props.operatorCellphone &&
            <a style={styles.logout} onClick={props.onLogout}>登出({props.operatorCellphone})</a>
          }
      </Header>

      <Content
        style={{
          marginLeft: '5%',
          width: '90%'
        }}
        >
        <Breadcrumb style={{ margin: '12px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>

        <div style={{ padding: 24, minHeight: '70vh'}}>
          <h1 id='analytics'>
            <span>电话文本分类处理</span>
            <a href='#analytics' className='anchor'>#</a>
          </h1>

          <CellphoneModal visible={props.showModal} onSubmit={props.onUpsertValidator} />
          {
            props.operatorCellphone
            &&
            <TextBox />
          }

        </div>
      </Content>
      <Footer style={{ textAlign: 'center', backgroundColor: '#f3f3f3' }}>
          ©2017 Created by Clevo Team
        </Footer>
    </Layout>
  )
}

// Container
export default compose(
    connect(
        (state) => ({
          showModal: state.app.showModal,
          operatorCellphone: state.app.operator
        }),
      {
        toggleModal: appActions.toggleModal,
        loginOperator: appActions.loginOperator,
        logout: appActions.resetState
      }
    ),
    withApollo,
    graphql(validatorCreate, { name: 'validatorCreateMutation' }), // define mutation
    withHandlers({
      onUpsertValidator: props => async (cellphone) => {
        console.log('cellphone', cellphone)

        try {
          let validator = await props.client.query({
            query: validatorByName,
            variables: { validatorName: cellphone }
          })
          console.log('login validator', validator)

          if (!validator.data || !validator.data.validatorByName) {
            validator = await props.validatorCreateMutation({
              variables: {
                validatorName: cellphone
              }
            })
            console.log('created validator', validator)
          }
          props.toggleModal(false)
          props.loginOperator(cellphone)
          localStorage.setItem('operator', cellphone)
        } catch (error) {
          console.error(error)
        }
      }
    }),
    withHandlers({
      loginOperatorLocalStorage: props => () => {
        let operator = localStorage.getItem('operator')
        if (operator) {
          props.onUpsertValidator(operator)
        } else {
          props.toggleModal(true)
        }
      }
    }),
    withHandlers({
      onLogout: props => () => {
        localStorage.clear()
        props.logout()
        props.loginOperator()
      }
    }),
    lifecycle({
      componentDidMount () {
        // Check if user is logged in
        this.props.loginOperatorLocalStorage()
      }
    })

)(App)
