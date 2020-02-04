<template>
  <q-page class="flex flex-center bg-amber text-grey-8">
    <q-card class="my-card no-shadow text-center q-pa-lg ">
      <q-card-section class="relative-position full-height ">
         <div class="absolute-center full-width text-grey-8">
         <img src="statics/karmanila69.png" style="width:5em;border-radius:100px;">
         <q-input v-model="email" standout="bg-grey-1 text-grey-8"  type="email" label="Email Address"  color="amber" input-class="text-grey-8" class="q-px-md q-my-md">
            <template v-slot:before>
                <q-icon name="mail" />
            </template>
         </q-input>
         <q-input v-model="password" standout="bg-grey-1 text-grey-8" type="password" label="Password"  color="amber" class="q-px-md q-my-md" input-class="text-grey-8">
            <template v-slot:before>
                <q-icon name="lock" />
            </template>
         </q-input>
         <q-btn push rounded color="amber" size="md" class="q-mt-sm q-mx-sm" @click="loginUser">sign in</q-btn>
         <q-btn push rounded color="amber" size="md" class="q-mt-sm q-mx-sm" @click="loginGoogle">sign in with goggle</q-btn>
         </div>
      </q-card-section>
    </q-card>
  </q-page>
</template>
<style>
    .my-card {
        width: 400px;
        height: 320px;
        border-radius: 50px;
    }
    img{
        width: 180px;
        filter:opacity(70%)
    }
</style>
<script>
export default {
    name: 'LoginPage',
    data () {
        return {
            email: '',
            password: '',
            dashboardUsers: [],
            idKey: {}
        }
    },
    mounted(){
        this.$binding('dashboardUsers', this.$firestoreApp.collection('dashboardUsers'))
            .then(dashboardUsers => {
                console.log(dashboardUsers, 'dashboardUsers')
            })
    },
    created(){
        let self = this
        this.$firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // console.log('createdUser',user.email)
                // console.log(self.dashboardUsers)
                let index = self.$lodash.findIndex(self.dashboardUsers,a => {
                    return a.email == user.email.toString()
                })
                // console.log(index,'index')

                if(index == 0){
                    
                    // before pushing get Token
                    console.log('push dashboard')
                    self.$router.push('/dashboard')
                    
                } else {
                    console.log("signout user")
                    self.$firebase.auth().signOut()
                    .then(() =>{
                        console.log("done SIGNOUT")
                    })
                }
            } else {
                // No user is signed in.
            }
        })
    },
    computed: {

    },
    methods: {
        loginGoogle(){
            var provider = new this.$firebase2.auth.GoogleAuthProvider();
            this.$firebase.auth().signInWithPopup( provider )          
        },
    }
}
</script>