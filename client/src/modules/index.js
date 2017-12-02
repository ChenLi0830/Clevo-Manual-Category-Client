import thunk from 'redux-thunk'
import {createStore, applyMiddleware} from 'redux'
import reducer from './reducer'
import * as appActions from './app'
import {client} from './apollo'
import {composeWithDevTools} from 'remote-redux-devtools'
// import logger from 'redux-logger'
// import {autoRehydrate, persistStore, createPersistor} from 'redux-persist';
// import {AsyncStorage} from 'react-native';

// const logger = createLogger();
const middleware = [
  client.middleware(),
  // __DEV__ && logger,
  thunk
].filter(Boolean)

const store = createStore(
    reducer,
    // undefined, //preloadedState
    composeWithDevTools(
      applyMiddleware(...middleware)
      // autoRehydrate(),
    )
)

export default store

export {appActions}
