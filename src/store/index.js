import Vue from 'vue'
import Vuex from 'vuex'
import session from "../util/session"
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
	  token:session.getUserToken() ||　'',//token
	  user: JSON.parse(session.getUserInfo() || '{}'),//用户信息
  },
  mutations: {
	  //设置token
	  setToken(state,token){
		  state.token = token;
		  session.setUserToken(token)
	  },
	  //设置用户信息
	  setUser(state,user){
		  if(typeof(user) != 'object'){
			  user = null;
		  }
		  state.user = user;
		  session.setUserInfo(JSON.stringify(user));
	  }
  }
})
