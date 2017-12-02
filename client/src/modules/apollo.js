// import config from '../../exp.json'
import ApolloClient, { createNetworkInterface } from 'apollo-client'

// let uri = 'https://el9pqobs08.execute-api.us-west-2.amazonaws.com/dev/graphql'
let uri = 'http://clevo-server.c8689b5863ec444e5bba9a51e950e18fc.us-west-1.alicontainer.com/graphql'

const networkInterface = createNetworkInterface({
  uri: uri,
  opts: {
    // The "same-origin" value makes query behave similarly to
    // XMLHttpRequest with regards to cookies. Otherwise, cookies won't get sent, resulting in these
    // requests not preserving the authentication session.
    credentials: 'same-origin'
  }
})

const client = new ApolloClient({
  networkInterface: networkInterface,
  dataIdFromObject: o => {
    // console.log("object", o)
    if (o.id) {
      return `${o.__typename}-${o.id}`
    } else if (o._id) {
      return `${o.__typename}-${o._id}`
    } else if (o.restaurantId) {
      return `${o.__typename}-${o.restaurantId}`
    } else {
      return undefined
    }
  }
})

export { client }
