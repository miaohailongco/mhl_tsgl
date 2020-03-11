import axios from "axios"
import session from "../util/session"
//创建axios实例
const service = axios.create({
	//设置默认的基础路径
	baseURL:process.env.NODE_ENV === "production" ? '/' : 'http://localhost:3300/api/',
	timeout:15000,
	responseType:'json',
	method:'POST'
})

// 添加请求拦截器
service.interceptors.request.use(function(config) {
    //添加token
	config.headers.common['Authorization'] = session.getUserToken();
	return config;
});
//响应拦截器
service.interceptors.response.use(function(response) {
	//服务器端响应成功,对数据进行处理
	return response.data;
});
export default service