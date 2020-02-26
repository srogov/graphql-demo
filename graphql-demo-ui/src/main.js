import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'
import ApolloClient from "apollo-boost"
import VueApollo from "vue-apollo"
import uuid from 'uuid/v4'

const apolloClient = new ApolloClient({
  uri: "http://localhost:4000"
})

Vue.config.productionTip = false

Vue.use(VueApollo)
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})

const visitorId = window.localStorage.getItem('visitorId');
if (!visitorId) {
  window.localStorage.setItem('visitorId',uuid());
}

new Vue({
  vuetify,
  render: h => h(App),
  apolloProvider
}).$mount('#app')