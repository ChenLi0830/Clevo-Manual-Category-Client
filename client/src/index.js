import React from 'react'
import { render } from 'react-dom'
import { Router, Route, hashHistory, IndexRoute } from 'react-router'
import { client } from './modules/apollo'
import { ApolloProvider } from 'react-apollo'
import store from './modules'
import 'babel-polyfill'
import App from './Components/App'

if (process.env.NODE_ENV === 'production') {
  console = console || {}
  console.log = function () {}
}

const AppWrapper = (props) => {
  return <ApolloProvider store={store} client={client}>
           {router}
         </ApolloProvider>
}

const router = (
  <Router history={hashHistory}>
    <Route path='/' component={App} />
  </Router>
)

render(
  <AppWrapper />,
  document.getElementById('app')
)
