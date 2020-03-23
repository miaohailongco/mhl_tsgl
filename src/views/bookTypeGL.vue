<template>
	<div class="container">
		<div class="form">
			<div class="form-group">
				<div class="form-label">类名名称</div>
				<div class="form-input">
					<input type="tel" v-model="bt_name" placeholder="请输入书名" >
				</div>
			</div>
			<div class="form-btn">
				<button @click="search">查询</button>
			</div>
			<div class="form-btn">
				<button @click="addBookType">添加类型</button>
			</div>
		</div>
		<div class="table">
			<table cellpadding="0" cellspacing="0" >
				<tr>
					<th>类型id</th>
					<th>类名名称</th>
					<th>创建时间</th>
					<th>操作</th>
				</tr> 
				<tr v-for="(item) in bookTypes" :key="item.bt_id">
					<td>{{item.bt_id}}</td>
					<td>{{item.bt_name}}</td>
					<td>{{time(item.bt_date)}}</td>
					<td>
						<button @click="editBookType(item.bt_id)">编辑</button>
						<button @click="deleteBook(item.bt_id)">删除</button>
					</td>
				</tr>
				<tr>
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
		<mhl-modal v-model="modalShow" :closable="false">
			<template v-slot:header>
				<div class="header">添加类型</div>
			</template>
			<div>
				<div class="form-group">
					<div class="form-label">类名名称<span class="mustIn">*</span></div>
					<div class="form-input">
						<input type="tel" v-model="new_bt_name" placeholder="请输入书名" >
					</div>
				</div>
			</div>
			<template v-slot:footer>
				<div class="addBtn">
					<button @click="inBookType">保存</button>
					<button @click="modalShow = false">取消</button>
				</div>
			</template>
		</mhl-modal>
	</div>
</template>

<script>
	export default {
		data(){
			return{
				pageCurrent:1,//当前页
				pageSize:10,//每页的数据量
				bt_name:'',//类名名称
				new_bt_name:'',//新加的类名名称
				bookTypes:[],
				proBtnDisabled:true,//上一页按钮是否禁用
				nextBtnDisabled:false,
				modalShow:false,
				message:'',//模态框提示句
				isAdd:0,//0表示添加的保存，1表示编辑的保存
				bt_id:'',//类型id
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
			time(){//时间格式
				return (param)=>{
					var date = new Date(param);
					return date.toLocaleString()
				}
			}
		},
		methods:{
			//保存录入的书籍
			inBookType(){
				if(this.isAdd == 0){
					this.saveBookTypeByAdd();
				}else{
					this.saveBookTypeByEdit();
				}
			},
			//添加书籍类型的保存
			saveBookTypeByAdd(){
				this.$axios({
					url:'bookType/addType',
					data:{
						bt_name:this.new_bt_name
					}
				}).then((result)=>{
					if(result.state == 100){
						this.$msgBox('添加成功');
						this.modalShow = false;
					}
				}).catch((error)=>{
					this.$msgBox("网络连接失败，请检查您的网络")
				})
			},
			//编辑书籍类型的保存
			saveBookTypeByEdit(){
				this.$axios({
					url:'bookType/modifyType',
					data:{
						bt_id:this.bt_id,
						bt_name:this.new_bt_name
					}
				}).then((result)=>{
					if(result.state == 100){
						this.$msgBox('已修改，保存成功');
						this.modalShow = false;
						this.loadData();
					}
				}).catch((error)=>{
					this.$msgBox("网络连接失败，请检查您的网络")
				})
			},
			//添加书籍类型
			addBookType(){
				this.isAdd = 0;
				this.modalShow = true;
				this.new_bt_name = '';
			},
			//编辑书籍类型信息
			editBookType(id){
				this.isAdd = 1;
				this.bt_id = id;
				this.modalShow = true;
				this.$axios({
					url:'bookType/searchType',
					data:{
						bt_id:id
					}
				}).then((result)=>{
					if(result.state == 100){
						this.new_bt_name = result.data[0].bt_name;
					}
				}).catch((error)=>{
					this.$msgBox("网络连接失败，请检查您的网络")
				})
			},
			//删除书籍类型
			deleteBook(id){
				this.$confirm({
					message:'确认删除该条数据吗？',
					callback:(res)=>{
						if(res){
							this.$axios({
								url:'bookType/deleteBookType',
								data:{
									bt_id:id
								}
							}).then((result)=>{
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
			//加载书籍类型列表
			loadData(){
				this.$axios({
					url:"bookType/searchTypes",
					data:{
						bt_name:this.bt_name,
						startIndex:this.pageCurrent,
						pageSize:this.pageSize
					}
				}).then((result)=>{
					if(result.state == 100){
						this.bookTypes = result.data.bookTypes;
						if(result.data.pageObj.pageCounts == this.pageCurrent){
							this.nextBtnDisabled = true;
						}else{
							this.nextBtnDisabled = false;
						}
					}else if(result.state == 101){
						this.bookTypes = [];
					}else{
						this.$router.push('/login');
					}
				}).catch((error)=>{
					this.$msgBox('网络连接失败，请检查您的网络');
				})
			},
			//查询
			search(){
				this.pageCurrent = 1;
				this.loadData();
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
			min-width: 60px;
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
				
				
				&::-webkit-inner-spin-button,&::-webkit-clear-button{
					display: none;
				}
				
				&::-webkit-calendar-picker-indicator{
					opacity: 1;
					position: absolute;
					right: 3px;
					width: 5px;
					height: 7px;
					
					&:hover{
						background-color: #fff;
					}
				}
				
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
				
				/*清除select默认样式*/
				// appearance:none;
				// -moz-appearance:none;
				// -webkit-appearance:none;
				// -ms-appearance:none;
				
				// border:1px solid #CCC;
				/*自定义箭头的样式，记得背景一定要加 白色或其他*/
				// background:url("../img/select.png") no-repeat scroll right center #fff;
				/*ie下,原默认的箭头样式还是会显示，所以这里把自定义的样式给去除了*/
				// background:#fff\9;
				// color:#666;
				// padding:8px;
				// outline:none;
				
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
		border-top: none;
		padding: 5px 0px;
		border-left: none;
		
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
	.mustIn{
		color: red;
	}
</style>