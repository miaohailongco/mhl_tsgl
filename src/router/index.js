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
	children:[
		{
			path:'',
			name:'renderHall',
			component: () => import(/* webpackChunkName: "renderHall" */ '../views/renderHall.vue'),
			meta:{
				requireAuth:true
			},
		},
		{
			path:'personCenter',
			name:'personCenter',
			component: () => import(/* webpackChunkName: "personCenter" */ '../views/personCenter.vue'),
			meta:{
				requireAuth:true
			},
		}
	]
  },
  {
    path: '/admin',
    name: 'admin',
    component: () => import(/* webpackChunkName: "admin" */ '../views/admin.vue'),
  	meta:{
  		requireAuth:true
  	},
	children:[
		{
			path:'',
			name:'userGL',
			component: () => import(/* webpackChunkName: "userGL" */ '../views/userGL.vue'),
		},
		{
			path:'bookGL',
			name:'bookGL',
			component: () => import(/* webpackChunkName: "bookGL" */ '../views/bookGL.vue'),
		},
		{
			path:'bookTypeGL',
			name:'bookTypeGL',
			component: () => import(/* webpackChunkName: "bookTypeGL" */ '../views/bookTypeGL.vue'),
		},
		{
			path:'renderGL',
			name:'renderGL',
			component: () => import(/* webpackChunkName: "renderGL" */ '../views/renderGL.vue'),
		}
		
	]
  },
]

const router = new VueRouter({
  routes
})

//路由前置拦截守卫
router.beforeEach((to,from,next)=>{
	if(to.meta.requireAuth){//需要登录检测
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
