
<template>
  <q-layout view="hHh LpR fFf">

    <q-header class="bg-black text-white">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
            <q-img src="statics/karmanila69.png" style="height:1.5em;width:1.5em;"></q-img>
            KARMANILA69
        </q-toolbar-title>
        <q-toggle
        v-model="value"
        label="Notifications"
        color="amber"
        />
        <q-btn dense flat round icon="message"/>
        <q-btn dense flat round icon="notifications"/>
        <q-btn-dropdown dense flat :label="userEmail" icon="account_circle" split>
            <q-list class="text-grey-8">
                <q-item clickable v-close-popup >
                <q-item-section>
                    <q-item-label>Account Settings</q-item-label>
                </q-item-section>
                </q-item>

                <q-item clickable v-close-popup @click.native="logout()">
                <q-item-section>
                    <q-item-label> Log Out </q-item-label>
                </q-item-section>
                </q-item>


            </q-list>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="left" side="left" overlay         
        show-if-above
        :width="300"
        :breakpoint="300"
        elevated>
      <!-- drawer content -->
        <q-scroll-area class="fit">
          <q-list class="text-grey-8" padding>

            <q-item clickable v-ripple active-class="text-grey-8 bg-grey-2" to="/dashboard">
              <q-item-section avatar>
                <q-icon name="dashboard" />
              </q-item-section>
              <q-item-section>
                Dashboard
              </q-item-section>
            </q-item>

           <q-separator />

            <q-item clickable v-ripple active-class="text-grey-8 bg-grey-2" to="/products">
              <q-item-section avatar>
                <q-icon name="shopping_cart" />
              </q-item-section>
              <q-item-section>
                Manage Products
              </q-item-section>
            </q-item>

           <q-separator />

          </q-list>
        </q-scroll-area>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>
</template>
<style>
    *{
        font-family: 'Source Sans Pro', sans-serif;
    }
</style>
<script>
export default {
    data () {
          return {
          left: false,
          userEmail: '',
          dashboardUsersToken: [],
          dashboardUsers: [],
          registrants: [],
          value: false
        }
    },
    created(){
        let self = this
        this.$firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // console.log('createdUser',user)
                let gg = {...user}
                self.userEmail = gg.email
                // self.subscribeGetToken()
            } else {
                // No user is signed in.
                self.$router.push('/login')
            }
        })
    },
    mounted(){

    },
    computed: {
    },
    methods: {
        logout(){
            this.$q.dialog({
                title: `Are you sure you want to logout?`,
                type: 'negative',
                color: 'amber',
                class: 'text-grey-8',
                icon: 'warning',
                ok: 'Ok',
                cancel: 'Cancel',
                persistent: true
                
            }).onOk(()=>{
              this.$firebase.auth().signOut()
              this.$router.push('/login')
            })
        },
      subscribeGetToken() {

            this.$messaging.requestPermission()
                .then(() => this.handleTokenRefresh())
                .catch((err) => {
                    console.log('Unable to get permission to notify.', err);
                }); 
        },
        handleTokenRefresh() {
            return this.$messaging.getToken()
                .then((token) => {
                   let self = this
                    console.log('token',token)
                    let uid = self.$firebase.auth().currentUser.uid
                    console.log('uid',uid)
                    let load = {
                        token: token,
                        uid: uid,
                        email: self.$firebase.auth().currentUser.email
                    }
                     this.$firestoreApp.collection('dashboardUsersToken').add(load)
                      .then(() => {
                          console.log('saved token')
                      }).catch((err) => {
                          console.log(err,'err')
                      })


                })
        }
    }
}
</script>