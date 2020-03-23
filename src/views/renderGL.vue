<template>
	<div class="container">
		<div class="form">
			<div class="form-group">
				<div class="form-label">用户id</div>
				<div class="form-input">
					<input type="tel" v-model="render_user" placeholder="请输入用户昵称" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label">书籍id</div>
				<div class="form-input">
					<input type="tel" v-model="render_book" placeholder="请输入租借的书籍" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label" style="margin-left: 20px;">租借状态</div>
				<div class="form-input">
					<select v-model="render_state">
						<option value="-1">全部</option>
						<option value="0">待审批</option>
						<option value="1">审批通过</option>
						<option value="2">审批拒绝</option>
						<option value="3">租借中</option>
						<option value="4">租借归还</option>
						<option value="5">租借超时</option>
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
					<th>租借id</th>
					<th>租借时间</th>
					<th>租借人(昵称)</th>
					<th>租借书籍</th>
					<th>租借时长(天)</th>
					<th>归还日期</th>
					<th>租借状态</th>
					<th>操作</th>
				</tr> 
				<!-- 租借时间、租借人、租借书籍、租借时长、归还日期、租借状态 -->
				<tr v-for="(item) in renders" :key="item.render_id">
					<td>{{item.render_id}}</td>
					<td>{{time(item.render_date)}}</td>
					<td>{{item.userName}}</td>
					<td>{{item.bookName}}</td>
					<td>{{item.render_time}}</td>
					<td>{{during(item.render_date,item.render_time)}}</td>
					<td>{{renderState(item.render_state)}}</td>
					<td>
						<button v-if="item.render_state == 0" @click="checkRender(item.render_id)">审核</button>
						<button @click="editRender(item.render_id)">编辑</button>
						<button @click="deleteRender(item.render_id)">删除</button>
					</td>
				</tr>
				<tr>
					<td></td>
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
		<mhl-modal v-model="modalShow1" :closable="false">
			<template v-slot:header>
				<div class="header">租借详情</div>
			</template>
			<div>
				<div class="form-group" v-if="!isCheck">
					<div class="form-label">租借时长</div>
					<div class="form-input">
						<input type="tel" v-model="in_render_time" placeholder="请输入租借时长" >
					</div>
				</div>
				<div class="form-group" v-if="isCheck">
					<div class="form-label">租借状态</div>
					<div class="form-input">
						<select v-model="check_render_state">
							<option value="0">请选择审核结果</option>
							<option value="1">审批通过</option>
							<option value="2">审批拒绝</option>
						</select>
					</div>
				</div>
			</div>
			<template v-slot:footer>
				<div class="addBtn">
					<button @click="inRender">保存</button>
					<button @click="modalShow1 = false">取消</button>
				</div>
			</template>
		</mhl-modal>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				render_user:'',//用户昵称
				user_id:'',//用户id
				render_state:'-1',//租借状态0待审批，1审批通过，2审批拒绝，3租借中，4租借归还.5租借超时
				render_book:'',//租借书籍
				renders:[],//租借记录
				pageCurrent:1,//当前页
				pageSize:7,//每页的数据量
				proBtnDisabled:true,//上一页按钮是否禁用
				nextBtnDisabled:false,//上一页按钮是否禁用
				modalShow1:false,
				in_render_time:'',//编辑修改的租借时长
				in_render_id:'',//记录修改的id
				isCheck:false,
				check_render_state:'0'//审批1通过，2拒绝
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
			//时间格式
			time(){
				return (param)=>{
					var date = new Date(param);
					return date.toLocaleString()
				}
			},
			//计算归还日期
			during(){
				return (date,days)=>{
					if(days == undefined || days == '') {
						days = 1;
					}
					date = new Date(date);
					var time = date.getTime() + days*24*60*60*1000;
					time = new Date(time);
					return time.toLocaleString();
				}
			},
			//租借状态
			renderState(){
				return (param)=>{
					if(param == 0){
						return '待审批'
					}
					if(param == 1){
						return '审批通过'
					}
					if(param == 2){
						return '审批拒绝'
					}
					if(param == 3){
						return '租借中'
					}
					if(param == 4){
						return '租借归还'
					}
					if(param == 5){
						return '租借超时'
					}
				}
			}
		},
		methods:{
			//审核租借
			checkRender(id){
				console.log(id);
				this.in_render_id = id;
				this.isCheck = true;
				this.modalShow1 = true;
			},
			//保存
			inRender(){
				if(this.isCheck && this.check_render_state == 0){
					this.$msgBox('请选择审核结果');
					return;
				}
				this.$axios({
					url:'render/modifyRender',
					data:{
						render_id:this.in_render_id,
						render_time:this.in_render_time,
						render_state:this.check_render_state
					}
				}).then((result)=>{
					if(result.state == 100){
						console.log(result);
						this.modalShow1 = false;
						this.$msgBox('已保存，修改成功');
						this.pageCurrent = 1;
						this.loadData();
					}
				}).catch((error)=>{
					this.$msgBox("网络连接失败，请检查您的网络")
				})
			},
			//编辑租借记录
			editRender(id){
				this.isCheck = false;
				this.in_render_id = id;
				this.modalShow1 = true;
				this.$axios({
					url:'render/searchRender',
					data:{
						render_id:id
					}
				}).then((result)=>{
					console.log(result);
					if(result.state == 100){
						this.in_render_time = result.data[0].render_time;
					}
				}).catch((error)=>{
					this.$msgBox("网络连接失败，请检查您的网络")
				})
			},
			//删除租借记录
			deleteRender(id){
				this.$confirm({
					message:'确认删除该条数据吗？',
					callback:(res)=>{
						if(res){
							this.$axios({
								url:'render/deleteRender',
								data:{
									render_id:id
								}
							}).then((result)=>{
								if(result.state == 100){
									this.$msgBox('删除成功');
									this.pageCurrent = 1;
									this.loadData();
								}
							}).catch((error)=>{
								console.log(error,222);
								this.$msgBox("网络连接失败，请检查您的网络")
							})
						}
					}
				})
			},
			//查询
			search(){
				this.pageCurrent = 1;
				this.loadData();
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
			//加载数据
			loadData(){
				this.$axios({
					url:'render/searchRenders',
					data:{
						render_user:this.render_user,
						render_book:this.render_book,
						render_state:this.render_state,
						startIndex:this.pageCurrent,
						pageSize:this.pageSize
					}
				}).then((result)=>{
					if(result.state == 100){
						this.renders = result.data.renders;
						if(result.data.pageObj.pageCounts == this.pageCurrent){
								this.nextBtnDisabled = true;
							}else{
								this.nextBtnDisabled = false;
							}
						}else if(result.state == 101){
							this.renders = [];
						}else{
							this.$router.push('/login');
						}
				}).catch((error)=>{
					console.log(error,111);
					this.$msgBox("网络连接失败，请检查您的网络")
				})
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
				position: relative;
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
		
		&>button:not(:last-child){
			margin-right: 5px;
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
	.header{
		text-align: center;
	}
	.addBtn{
		text-align: center;
		
		&>button{
			width: 80px;
			height: 35px;
			font-size: 16px;
			border-radius: 4px;
			appearance: none;
			-webkit-appearance: none;
			border: 1px solid #ddd;
			cursor: pointer;
		}
		
		&>button:first-child{
			background-color: #2196f3;
			color: #fff;
			
			&:active{
				background-color: #1275c4;
			}
		}
		
		&>button:last-child{
			background-color: #f4f4f4;
			color: #929292;
			margin-left: 40px;
			
			&:active{
				background-color: #c0c0c0;
			}
		}
	}
</style>
