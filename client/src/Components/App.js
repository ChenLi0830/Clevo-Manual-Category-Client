import React from 'react'
import { Layout, Menu, Breadcrumb } from 'antd'
import {withState, compose, withHandlers, lifecycle} from 'recompose'
import {graphql, withApollo} from 'react-apollo'
import {upsertOperator, getOperator} from '../graphql/operator'
import {connect} from 'react-redux'
import {appActions} from '../modules'
import CellphoneModal from './CellphoneModal'
import { Tabs } from 'antd'

import EmotionAnalyzer from './EmotionAnalyzer'
import Particles from 'react-particles-js'

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
  particles: {
    backgroundColor: '#fff',
    top: 0,
    bottom: 0,
    position: 'fixed',
    zIndex: -1,
    width: '100vw',
    height: '100vh'
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
        <Particles style={styles.particles} params={{
          'particles': {
            'number': {
              'value': 20,
              'density': {
                'enable': true,
                'value_area': 800
              }
            },
            'color': {
              'value': '#1c385f'
            },
            'shape': {
              'type': 'circle',
              'stroke': {
                'width': 0,
                'color': '#000000'
              },
              'polygon': {
                'nb_sides': 5
              },
              'image': {
                'src': 'img/github.svg',
                'width': 100,
                'height': 100
              }
            },
            'opacity': {
              'value': 0.5,
              'random': false,
              'anim': {
                'enable': false,
                'speed': 1,
                'opacity_min': 0.1,
                'sync': false
              }
            },
            'size': {
              'value': 4,
              'random': true,
              'anim': {
                'enable': false,
                'speed': 40,
                'size_min': 0.1,
                'sync': false
              }
            },
            'line_linked': {
              'enable': true,
              'distance': 100,
              'color': '#1c385f',
              'opacity': 0.4,
              'width': 1
            },
            'move': {
              'enable': true,
              'speed': 2,
              'direction': 'none',
              'random': false,
              'straight': false,
              'out_mode': 'out',
              'bounce': false,
              'attract': {
                'enable': false,
                'rotateX': 600,
                'rotateY': 1200
              }
            }
          },
          'interactivity': {
            'detect_on': 'canvas',
            'events': {
              'onhover': {
                'enable': false,
                'mode': 'repulse'
              },
              'onclick': {
                'enable': false,
                'mode': 'push'
              },
              'resize': true
            },
            'modes': {
              'grab': {
                'distance': 400,
                'line_linked': {
                  'opacity': 1
                }
              },
              'bubble': {
                'distance': 400,
                'size': 40,
                'duration': 2,
                'opacity': 8,
                'speed': 3
              },
              'repulse': {
                'distance': 200,
                'duration': 0.4
              },
              'push': {
                'particles_nb': 4
              },
              'remove': {
                'particles_nb': 2
              }
            }
          },
          'retina_detect': true
        }} />

        <Header style={{/*{ position: 'fixed', width: '100%' } */}}>
          <span style={styles.logo}>Clevo</span>

          {
            props.operatorCell                &&
            <a style={styles.logout} onClick={props.onLogout}>登出({props.operatorCell})</a>
          }
        </Header>

        <Content
          style= {{
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

            <CellphoneModal visible={props.showModal} onSubmit={props.onSubmitCell} />
            <EmotionAnalyzer />

          </div>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#f3f3f3' }}>
          ©2017 Created by Clevo Team
        </Footer>
      </Layout>
  )
};

// Container
export default compose(
    connect(
        (state) => ({
          showModal: state.app.showModal,
          operatorCell: state.app.operator
        }),
      {
        toggleModal: appActions.toggleModal,
        loginOperator: appActions.loginOperator,
        logout: appActions.resetState
      }
    ),
    graphql(upsertOperator),
    withHandlers({
      onSubmitCell: props => async (cellphone) => {
        console.log('cellphone', cellphone)
        await props.mutate({
          variables: {
            cellphone
          }
        })
        
        props.toggleModal(false)
        props.loginOperator(cellphone)
        localStorage.setItem('operator', cellphone)
      }
    }),
    withHandlers({
      loginOperator: props => () => {
        let operator = localStorage.getItem('operator')
        if (operator) {
          props.onSubmitCell(operator)
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
        this.props.loginOperator()
      }
    })

)(App)
