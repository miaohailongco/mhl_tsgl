import Vue from 'vue'
import VueRouter from 'vue-router'
import session from "../util/session"
Vue.use(VueRouter)

const routes = [
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "login" */ '../views/login.vue')
  },
  {
    path: '/',
    name: 'home',
    component: () => import(/* webpackChunkName: "home" */ '../views/home.vue'),
	meta:{
		required:true,//是否需要检查登录权限
	}
  },
]

const router = new VueRouter({
  routes
})

//路由前置拦截守卫
router.beforeEach((to,from,next)=>{
	if(to.meta.required){//需要登录检测
		if(session.getUserToken()){
			next();
		}else{
			next({
				path:'/login'
			})
		}
	}else{
		next();
	}
})

export default router
