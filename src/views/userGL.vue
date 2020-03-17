<template>
	<div class="container">
		<div class="form">
			<div class="form-group">
				<div class="form-label">手机号</div>
				<div class="form-input">
					<input type="tel" v-model="user_phone" placeholder="请输入手机号" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label">昵称</div>
				<div class="form-input">
					<input type="tel" v-model="user_name" placeholder="请输入用户昵称" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label">身份</div>
				<div class="form-input">
					<select v-model="user_type">
						<option value="-1">全部</option>
						<option value="0">用户</option>
						<option value="1">管理员</option>
					</select>
				</div>
			</div>
			<div class="form-btn">
				<button @click="search" >查询</button>
			</div>
		</div>
		<div class="table">
			<table cellpadding="0" cellspacing="0">
				<tr>
					<th>用户id</th>
					<th>用户手机号</th>
					<th>用户昵称</th>
					<th>用户身份</th>
					<th>登陆时间</th>
					<th>注册时间</th>
					<th>操作</th>
				</tr> 
				<tr v-for="(item) in user" :key="item.user_id">
					<td>{{item.user_id}}</td>
					<td>{{item.user_phone}}</td>
					<td>{{item.user_name}}</td>
					<td>{{item.user_type}}</td>
					<td>{{time(item.user_login)}}</td>
					<td>{{time(item.user_register)}}</td>
					<td>
						<button @click="editUser(item.user_id)">编辑</button>
						<button @click="deleteUser(item.user_id)">删除</button>
					</td>
				</tr>
				<tr>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td></td>
					<td style="border: none;">
						<div class="pageCount">
							<button @click="proPage" :disabled="proBtnDisabled" >上一页</button>
							<div>{{pageCurrent}}</div>
							<button @click="nextPage" :disabled="nextBtnDisabled">下一页</button>
						</div>
					</td>
				</tr>
			</table>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				pageCurrent:1,//当前页
				pageSize:7,//每页的数据量
				user_phone:'',//用户手机号
				user_name:'',//用户昵称
				user_type:'-1',//用户身份类型
				user:[],//用户列表
				proBtnDisabled:true,//上一页按钮是否禁用
				nextBtnDisabled:false
			}
		},
		mounted() {
			this.loadData();
		},
		watch:{
			pageCurrent(newValue){
				if(newValue == 1){
					this.proBtnDisabled = true;
				}else{
					this.proBtnDisabled = false;
				}
			}
		},
		computed:{
			time(){//时间合适
				return (param)=>{
					var date = new Date(param);
					return date.toLocaleString()
				}
			}
		},
		methods:{
			//编辑用户信息
			editUser(id){
				console.log(id);
			},
			deleteUser(id){
				this.$confirm({
					message:'确认删除该条信息吗？',
					callback:(res)=>{
						if(res){
							this.$axios({
								url:'user/deleteUser',
								data:{
									user_id:id
								}
							}).then((result)=>{
								console.log(result);
								if(result.state == 100){
									this.$msgBox('删除成功');
									this.pageCurrent = 1;
									this.loadData();
								}
							}).catch((error)=>{
								this.$msgBox("网络连接失败，请检查您的网络")
							})
						}
					}
				})
			},
			//上一页按钮
			proPage(){
				this.pageCurrent--;
				this.loadData();
			},
			//下一页按钮
			nextPage(){
				this.pageCurrent++;
				this.loadData();
			},
			//加载用户列表
			loadData(){
				this.$axios({
					url:"user/searchUser",
					data:{
						user_phone:this.user_phone,
						user_name:this.user_name,
						user_type:this.user_type,
						startIndex:this.pageCurrent,
						pageSize:this.pageSize
					}
				}).then((result)=>{
					if(result.state == 100){
						this.user = result.data.users;
						if(result.data.pageObj.pageCounts == this.pageCurrent){
							this.nextBtnDisabled = true;
						}else{
							this.nextBtnDisabled = false;
						}
					}else if(result.state == 101){
						this.user = [];
					}else{
						this.$router.push('/login');
					}
				}).catch((error)=>{
					this.$msgBox('网络连接失败，请检查您的网络');
				})
			},
			//查询
			search(){
				this.loadData();
			},
			//根据user_id值获取user数组下标
			getIndex(array, value) {
				for (var i = 0; i < array.length; i++) {
					if (array[i].user_id == value) {
						return i;
					}
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.container{
		padding: 20px;
	}
	.form{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		flex-wrap: wrap;
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
			
			&>select{
				width: 100%;
				height: 100%;
				border: 1px solid #ccc;
				border-radius: 4px;
				padding: 0 10px;
			}
		}
	}
	.table{
		width: 100%;
		margin-top: 5px;
		
		&>table{
			width: 100%;
		}
	}
	tr{
		&:hover{
			background-color: #ddd;
		}
	}
	tr:last-child{
		border: none;
		
		&:hover{
			background-color: #fff;
		}
		
		&>td:last-child{
			display: flex;
			display: -webkit-flex;
			justify-content: center;
		}
		
		&>td{
			border: none;
		}
	}
	th{
		border: 1px solid #000;
		padding: 10px 32px;
		border-left: none;
		
		&:first-child{
			border-left: 1px solid #000;
		}
	}
	td{
		text-align: center;
		border: 1px solid #000;
		padding: 5px 0px;
		border-left: none;
		border-top: none;
		
		&:first-child{
			border-left: 1px solid #000;
		}
		
		&>button{
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
		
		&>button:last-child{
			margin-left: 15px;
		}
	}
	.form-btn{
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		margin-bottom: 15px;
		margin-left: 35px;
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
	.pageCount{
		display: flex;
		display: -webkit-flex;
		
		&>button{
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
</style>
