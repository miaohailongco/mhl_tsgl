const session = {
	//获取用户的token
	getUserToken(){
		return sessionStorage.getItem('userToken');
	},
	//存储token
	setUserToken(token){
		sessionStorage.setItem('userToken',token);
	},
	//获取用户信息
	getUserInfo(){
		return sessionStorage.getItem('userInfo');
	},
	//设置用户信息
	setUserInfo(user){
		sessionStorage.setItem('userInfo',user);
	}
}

export default session