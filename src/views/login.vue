<template>
	<div class="container">
		<div class="login-box">
			<div class="login-top">mhl图书借阅管理系统</div>
			<!-- 登录 -->
			<div v-show="loginRegister==0">
				<!-- 切换登录方式 -->
				<div class="typeSwitch">
					<button class="type-btn" v-text="loginType==0?'验证码登录':'密码登录'" @click="switchLoginType"></button>
				</div>
				<!-- 密码登录 -->
				<div v-show="loginType == 0">
					<div class="form-group">
						<div class="form-label">手机号:</div>
						<div class="form-input">
							<input type="tel" v-model="user_phone" placeholder="请输入手机号码" @keyup.enter="loginOrRegister" >
						</div>
					</div>
					<div class="form-group">
						<div class="form-label">密码:</div>
						<div class="form-input">
							<input type="password" v-model="user_password" placeholder="请输入密码" @keyup.enter="loginOrRegister" >
						</div>
					</div>
				</div>
				<!-- 验证码登录 -->
				<div v-show="loginType == 1">
					<div class="form-group">
						<div class="form-label">手机号:</div>
						<div class="form-input">
							<button @click="sendCode" v-text="codeMessage" :disabled="codeBtnDisable" >发送验证码</button>
							<input type="tel" v-model="user_phone" placeholder="请输入手机号码" @keyup.enter="loginOrRegister" >
						</div>
					</div>
					<div class="form-group">
						<div class="form-label">验证码:</div>
						<div class="form-input">
							<input type="password" v-model="user_code" placeholder="请输入验证码" @keyup.enter="loginOrRegister" >
						</div>
					</div>
				</div>
				<div class="login-type">
					<label>
						<input type="radio" v-model="user_type" :value="1" >管理员
					</label>
					<label>
						<input type="radio" v-model="user_type" :value="0" >用户
					</label>
				</div>
			</div>
			<!-- 注册 -->
			<div v-show="loginRegister==1">
				<div class="form-group">
					<div class="form-label">手机号:</div>
					<div class="form-input">
						<button @click="sendCode" v-text="codeMessage"></button>
						<input type="tel" v-model="user_phone" placeholder="请输入手机号码">
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">验证码:</div>
					<div class="form-input">
						<input type="password" v-model="user_code" placeholder="请输入验证码">
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">昵称:</div>
					<div class="form-input">
						<input type="text" v-model="user_name" placeholder="请设置昵称">
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">密码:</div>
					<div class="form-input">
						<input type="password" v-model="user_password" placeholder="请设置密码">
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">确认密码:</div>
					<div class="form-input">
						<input type="password" v-model="user_password1" placeholder="请再输入一次密码">
					</div>
				</div>
			</div>
			<div class="form-btn">
				<button @click="loginOrRegister" v-text="loginRegister==0?'登录':'注册'" ></button>
				<div class="tip" @click="switchLoginRegister" v-text="loginRegister==0?'还没账号？立即注册':'返回登录'"></div>
			</div>
		</div>
	</div>
</template>

<script>
	export default{
		data(){
			return{
				loginRegister:0,//0登录，1注册
				loginType:0,//0密码登录，1验证码登录
				user_phone:'',//用户手机号
				user_name:'',//用户昵称
				user_password:'',//用户密码
				user_password1:'',//确认密码
				user_code:'',//验证码
				user_type:0,//用户身份类型
				codeMessage:'发送验证码',
				codeBtnDisable:false
			}
		},
		methods:{
			//切换登录和注册
			switchLoginRegister(){
				this.user_phone='';//用户手机号
				this.user_name='';//用户昵称
				this.user_password='';//用户密码
				this.user_password1='';//确认密码
				this.user_code='';//验证码
				this.user_type=0;//用户身份类型
				this.codeMessage='发送验证码';
				this.codeBtnDisable=false;
				if(this.loginRegister == 0){
					this.loginRegister = 1;
				}else{
					this.loginRegister = 0;
				}
				this.codeMessage = '发送验证码';
			},
			//发送验证码
			sendCode(){
				var _this = this;
				if(!_this.user_phone){
					this.$msgBox('请输入手机号');
					return;
				}
				_this.codeBtnDisable = true;
				//发送验证码 请求
				this.$axios({
					url:'user/sendMessage',
					data:{
						user_phone:this.user_phone
					}
				}).then((result)=>{
					//手机号问题
					if(result.state == 101){
						this.$msgBox(result.message);
					}
					if(result.state == 100){
						this.$msgBox('验证码发送成功');
						//倒计时120秒
						var times = 120;
						var timer = setInterval(function(){
							times--;
							_this.codeMessage = `已发送(${times})`;
							if(times <= 0){
								_this.codeBtnDisable = false;
								_this.codeMessage = '重新发送';
							}
						},1000)
					}
				}).catch((error)=>{
					this.$msgBox('网络连接失败，请检查您的网络');
				})
			},
			//切换登录方式
			switchLoginType(){
				this.user_phone='';//用户手机号
				this.user_name='';//用户昵称
				this.user_password='';//用户密码
				this.user_password1='';//确认密码
				this.user_code='';//验证码
				this.user_type=0;//用户身份类型
				this.codeMessage='发送验证码';
				this.codeBtnDisable=false;
				if(this.loginType == 0){
					this.loginType = 1;
				}else{
					this.loginType = 0;
				}
			},
			//登录
			loginOrRegister(){
				var _this = this;
				//判断是否为登录
				if(this.loginRegister == 0){
					//判断登录方式
					if(this.loginType == 0){//密码登录
						if(!this.user_phone){
							this.$msgBox('请输入手机号');
							return;
						}
						if(!this.user_password){
							this.$msgBox('请输入密码');
							return;
						}
						//发送登录请求
						this.$axios({
							url:'user/login',
							data:{
								user_phone:this.user_phone,
								user_password:this.user_password,
								user_type:this.user_type
							}
						}).then((result)=>{//请求成功
							//手机号或密码问题
							if(result.state == 101){
								this.$msgBox(result.message);
							}
							//登录成功
							if(result.state == 100){
								this.$msgBox('登录成功');
								//将token和用户信息存入vuex中
								this.$store.commit('setToken',result.data.token);
								this.$store.commit('setUser',result.data.user);
								//判断身份类型进入相应页面
								if(this.user_type == 0){
									setTimeout(function(){
										_this.$router.replace('/');
									},1500)
								}else{
									setTimeout(function(){
										_this.$router.replace('/admin');
									},1500)
								}
							}
						}).catch((error)=>{
							this.$msgBox('网络连接失败，请检查您的网络');
						})
					}else{//验证码登录
						if(!this.user_phone){
							this.$msgBox('请输入手机号');
							return;
						}
						if(!this.user_code){
							this.$msgBox('请输入验证码');
							return;
						}
						//发送登录请求
						this.$axios({
							url:'user/loginCode',
							data:{
								user_phone:this.user_phone,
								user_code:this.user_code,
								user_type:this.user_type
							}
						}).then((result)=>{//请求成功
							//手机号或验证码问题
							if(result.state == 101){
								this.$msgBox(result.message);
							}
							//token失效
							if(result.state == 102){
								this.$msgBox(result.message)
							}
							//登录成功
							if(result.state == 100){
								this.$msgBox('登录成功');
								//将token和用户信息存入vuex中
								this.$store.commit('setToken',result.data.token);
								this.$store.commit('setUser',result.data.user);
								//判断身份类型进入相应页面
								if(this.user_type == 0){
									setTimeout(function(){
										_this.$router.replace('/');
									},1500)
								}else{
									setTimeout(function(){
										_this.$router.replace('/admin');
									},1500)
								}
							}
						}).catch((error)=>{
							this.$msgBox('网络连接失败，请检查您的网络');
						})
					}
				}else{//注册
					if(!this.user_phone){
						this.$msgBox('请输入手机号');
						return;
					}
					if(!this.user_code){
						this.$msgBox('请输入验证码');
						return;
					}
					if(this.user_password.length < 6 || this.user_password.length > 11){
						this.$msgBox('密码为6到11位字符');
						return;
					}
					if(this.user_password != this.user_password1){
						this.$msgBox('两次密码输入不一致');
						return;
					}
					this.$axios({
						url:'user/register',
						data:{
							user_phone:this.user_phone,
							// user_code:this.user_code,
							user_name:this.user_name,
							user_password:this.user_password
						}
					}).then((result)=>{
						if(result.state == 101){
							this.$msgBox(res.message);
						}
						if(result.state == 100){
							this.$msgBox('注册成功,正在自动登录');
							//发送登录请求
							this.$axios({
								url:'user/login',
								data:{
									user_phone:this.user_phone,
									user_password:this.user_password,
									user_type:this.user_type
								}
							}).then((result)=>{//请求成功
								//登录成功
								if(result.state == 100){
									//将token和用户信息存入vuex中
									this.$store.commit('setToken',result.data.token);
									this.$store.commit('setUser',result.data.user);
									//判断身份类型进入相应页面
									if(this.user_type == 0){
										setTimeout(function(){
											_this.$router.replace('/');
										},1500)
									}else{
										setTimeout(function(){
											_this.$router.replace('/admin');
										},1500)
									}
								}
							}).catch((error)=>{
								this.$msgBox('网络连接失败，请检查您的网络');
							})
						}
					}).catch((error)=>{
						this.$msgBox('网络连接失败，请检查您的网络');
					})
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.container{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		width: 100%;
		height: 100%;
		background-image: url(../assets/homebg.png);
		background-repeat: no-repeat;
		background-size: cover;
		background-position: center;
	}
	.login-box{
		width: 500px;
		min-height: 100px;
		background-color: #fff;
		border-radius: 4px;
		padding: 0 60px;
	}
	.login-top{
		text-align: center;
		border-bottom: 1px solid #ddd;
		font-size: 20px;
		padding: 15px 0;
		font-weight: bolder;
		margin-bottom: 10px;
	}
	.typeSwitch{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-end;
		
		&>button{
			border: 1px solid #ddd;
			background-color: #47f84e;
			border-radius: 4px;
			appearance: none;
			padding: 5px 10px;
			min-width: 90px;
			cursor: pointer;
			
			&:active{
				background-color: #34b63a;
			}
		}
	}
	.form-group{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		height: 50px;
		margin-bottom: 15px;
		&>.form-label{
			width: 60px;
			text-align: right;
			margin-right: 40px;
			font-weight: bold;
		}
		
		&>.form-input{
			position: relative;
			flex: 1;
			height: 36px;
			&>input{
				width: 100%;
				height: 100%;
				border: 1px solid #ccc;
				border-radius: 4px;
				padding: 0 10px;
				
				&:focus{
					border-color: #03a9f4;
				}
			}
			
			&>button{
				appearance: none;
				background-color: #fff;
				position: absolute;
				width: 100px;
				border: 2px solid #ddd;
				border-radius: 20px;
				top: 50%;
				text-align: center;
				padding: 3px 8px;
				transform: translate(177%,-50%);
				cursor: pointer;
				
				&:active{
					background-color: #ddd;
				}
			}
		}
	}
	.form-btn{
		position: relative;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 15px;
		&>button{
			width: 100px;
			height: 36px;
			border-radius: 4px;
			appearance: none;
			-webkit-appearance: none;
			border: 1px solid #ddd;
			background-color: #2196f3;
			color: #fff;
			cursor: pointer;
			
			&:active{
				background-color: #1275c4;
			}
		}
	}
	.login-type{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-end;
		margin-bottom: 15px;
		
		&>label:first-child{
			margin-right: 15px;
		}
	}
	.tip{
		position: absolute;
		right: 0;
		bottom: 0;
		color: #0085ef;
		cursor: pointer;
		font-size: 12px;
	}
</style>
