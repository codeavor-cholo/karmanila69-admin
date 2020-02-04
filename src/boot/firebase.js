import VueFirestore from 'vue-firestore'
import firebase from 'firebase'
require('firebase/firestore')
  
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCs5dY5G6zI6Jbah_T4yzvhcJ2hI4JaDe0",
    authDomain: "karmanila69-f7a2a.firebaseapp.com",
    databaseURL: "https://karmanila69-f7a2a.firebaseio.com",
    projectId: "karmanila69-f7a2a",
    storageBucket: "karmanila69-f7a2a.appspot.com",
    messagingSenderId: "800808399521",
    appId: "1:800808399521:web:d5909141a210f7061476e0",
    measurementId: "G-624EM0263Z"
  };

  export var firebase2 = firebase.initializeApp(firebaseConfig, 'firebase')
  export var AUTH = firebase2.auth()
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  export var messaging = firebase.messaging()


  messaging.usePublicVapidKey('BIAvTTMk_aiCy31ibVTQ1BfvuhYt0FJCx04tJHkYZPzE3JBc5Zv5ET-ZJQYjgdCO3D6EpGM2sV3zOo2Wttg14dc');

  messaging.onMessage(payload => {
    console.log('Message received.', payload);
    });
  // "async" is optional
  export default async ({ Vue }) => {
    // something to do
    Vue.prototype.$firebase = firebase2
    Vue.prototype.$firebase2 = firebase
    Vue.prototype.$firestoreApp = firebase2.firestore()
    Vue.prototype.$auth = AUTH
    Vue.prototype.$messaging = messaging
    Vue.use(VueFirestore)
    Vue.use(firebase)
  }