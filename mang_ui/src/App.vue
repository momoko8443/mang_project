<template>
  <HelloWorld v-if="user !== null"/>
  <div v-else class="btn" @click="showGuard">登录</div>
  <Guard
    :authClient="authClient"
    :visible="visible"
    :config="config"
    @login="onLogin"
    @close="onClose"
  ></Guard>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'
import { Guard } from "@authing/vue-ui-components";
import { AuthenticationClient } from "authing-js-sdk";
import "@authing/vue-ui-components/lib/index.min.css";
import axios from 'axios';

const authClient = new AuthenticationClient({
  // 替换你的 AppId
  appId: "62c4f02595573114322b91af",
});
export default {
  name: 'App',
  components: {
    HelloWorld,
    Guard
  },
  data: () => ({
    config: {
      mode: "modal",
    },
    visible: false,
    user: null,
  }),
  computed: {
    authClient() {
      return authClient;
    },
  },
  created() {
    this.checkLoginStatus();
  },
  methods: {
    onLogin(userInfo) {
      console.log(userInfo);
      this.user = userInfo;
      this.setDefaultHeader();
      this.onClose();
    },
    showGuard() {
      this.visible = true;
    },
    onClose() {
      this.visible = false;
    },
    async checkLoginStatus() {
      // authClient 登录成功时 会将用户相关信息存储在 localStorage 中
      const user = await authClient.getCurrentUser();

      if (user && user.token) {
        const { status } = await authClient.checkLoginStatus(user.token);

        if (status) {
          this.user = user;
          this.setDefaultHeader();
        }
      }
    },

    setDefaultHeader(){
      if(this.user && this.user.token){
        axios.defaults.headers = {
          'authing-jwt-token': this.user.token
        }
      }
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
