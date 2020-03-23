<template>
	<div class="container">
		<div class="form">
			<div class="form-group">
				<div class="form-label">书名</div>
				<div class="form-input">
					<input type="tel" v-model="book_name" placeholder="请输入书名" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label">作者</div>
				<div class="form-input">
					<input type="tel" v-model="book_author" placeholder="请输入作者名字" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label">出版社</div>
				<div class="form-input">
					<input type="tel" v-model="book_company" placeholder="请输入出版社" >
				</div>
			</div>
			<div class="form-group">
				<div class="form-label">分类</div>
				<div class="form-input">
					<select v-model="book_type">
						<option value="-1">全部</option>
						<option value="0">历史</option>
						<option value="1">文学</option>
						<option value="2">科学</option>
						<option value="3">科幻</option>
						<option value="4">小说</option>
						<option value="5">杂志</option>
						<option value="6">旅游</option>
					</select>
				</div>
			</div>
			<div class="form-btn">
				<button @click="search" >查询</button>
			</div>
			<div class="form-btn">
				<button @click="addBook" >添加书籍</button>
			</div>
		</div>
		<div class="table">
			<table cellpadding="0" cellspacing="0" >
				<tr>
					<th>书籍id</th>
					<th>书名</th>
					<th>作者</th>
					<th>出版社</th>
					<th>出版时间</th>
					<th>分类</th>
					<th>入库时间</th>
					<th>库存</th>
					<th>操作</th>
				</tr> 
				<tr v-for="(item) in book" :key="item.book_id">
					<td>{{item.book_id}}</td>
					<td>{{item.book_name}}</td>
					<td>{{item.book_author}}</td>
					<td>{{item.book_company}}</td>
					<td>{{time(item.book_company_date)}}</td>
					<td>{{item.book_type}}</td>
					<td>{{time(item.book_in)}}</td>
					<td>{{item.book_counts}}</td>
					<td>
						<button @click="editBook(item.book_id)">编辑</button>
						<button @click="deleteBook(item.book_id)">删除</button>
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
				<div class="header">添加书籍</div>
			</template>
			<div>
				<div class="form-group">
					<div class="form-label">书名<span class="mustIn">*</span></div>
					<div class="form-input">
						<input type="tel" v-model="in_book_name" placeholder="请输入书名" >
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">作者<span class="mustIn">*</span></div>
					<div class="form-input">
						<input type="tel" v-model="in_book_author" placeholder="请输入作者名字" >
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">出版社<span class="mustIn">*</span></div>
					<div class="form-input">
						<input type="tel" v-model="in_book_company" placeholder="请输入出版社" >
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">出版时间<span class="mustIn">*</span></div>
					<div class="form-input">
						<input type="date" v-model="in_book_company_date" >
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">分类<span class="mustIn">*</span></div>
					<div class="form-input">
						<select v-model="in_book_type">
							<option value="" selected>请选择分类</option>
							<option value="0">历史</option>
							<option value="1">文学</option>
							<option value="2">科学</option>
							<option value="3">科幻</option>
							<option value="4">小说</option>
							<option value="5">杂志</option>
							<option value="6">旅游</option>
						</select>
					</div>
				</div>
				<div class="form-group">
					<div class="form-label">书籍数量<span class="mustIn">*</span></div>
					<div class="form-input">
						<input type="tel" v-model="in_book_counts" placeholder="请输入作者名字" >
					</div>
				</div>
			</div>
			<template v-slot:footer>
				<div class="addBtn">
					<button @click="inBook">保存</button>
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
				book_name:'',//书籍名称
				book_author:'',//书籍作者
				book_company:'',//书籍出版社
				book_type:'-1',
				book:[],//书籍列表
				proBtnDisabled:true,//上一页按钮是否禁用
				nextBtnDisabled:false,
				modalShow:false,
				message:'',//模态框提示句
				book_id:'',
				in_book_name:'',//添加书籍的书名
				in_book_author:'',//添加书籍的作者
				in_book_company:'',//添加书籍的出版社
				in_book_company_date:'',//添加书籍的出版时间
				in_book_type:'',//添加书籍的分类
				in_book_counts:'',//添加书籍的数量
				isAdd:0,//0表示添加的保存，1表示编辑的保存
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
			//保存录入的书籍
			inBook(){
				if(this.isAdd == 0){
					this.saveBookByAdd();
				}else{
					this.saveBookByEdit();
				}
			},
			//添加书籍的保存
			saveBookByAdd(){
				if(!this.in_book_name){
					this.$msgBox('请输入书籍名称');
					return;
				}
				if(!this.in_book_author){
					this.$msgBox('请输入作者姓名');
					return;
				}
				if(!this.in_book_company){
					this.$msgBox('请输入出版社');
					return;
				}
				if(!this.in_book_company_date){
					this.$msgBox('请输入出版时间');
					return;
				}
				if(!this.in_book_type){
					this.$msgBox('请输入书籍类型');
					return;
				}
				if(!this.in_book_counts){
					this.$msgBox('请输入书籍数量');
					return;
				}
				this.$axios({
					url:'book/addBook',
					data:{
						book_name:this.in_book_name,
						book_author:this.in_book_author,
						book_company:this.in_book_company,
						book_company_date:this.in_book_company_date,
						book_type:this.in_book_type,
						book_counts:this.in_book_counts
					}
				}).then((result)=>{
					if(result.state == 100){
						this.$msgBox('书籍添加成功');
						this.modalShow = false;
					}
				}).catch((error)=>{
					this.$msgBox('网络连接失败，请检查您的网络');
				})
			},
			//编辑书籍的保存
			saveBookByEdit(){
				this.$axios({
					url:'book/modifyBook',
					data:{
						book_id:this.book_id,
						book_name:this.in_book_name,
						book_author:this.in_book_author,
						book_company:this.in_book_company,
						book_company_date:this.in_book_company_date,
						book_type:this.in_book_type,
						book_counts:this.in_book_counts
					}
				}).then((result)=>{
					if(result.state == 100){
						this.$msgBox('已修改，保存成功');
						this.modalShow = false;
						this.loadData();
					}
					console.log(result);
				}).catch((error)=>{
					this.$msgBox('网络连接失败，请检查您的网络');
				})
				console.log(111);
			},
			//添加书籍
			addBook(){
				this.modalShow = true;
				this.in_book_name = '',
				this.in_book_author = '',
				this.in_book_company = '',
				this.in_book_company_date = '',
				this.in_book_type = '',
				this.in_book_counts = ''
			},
			//编辑书籍信息
			editBook(id){
				this.book_id = id;
				this.isAdd = 1;
				this.modalShow = true;
				this.$axios({
					url:'book/searchBook',
					data:{
						book_id:id
					}
				}).then((result)=>{
					if(result.state == 100){
						var bookInfo = result.data[0];
						this.in_book_name = bookInfo.book_name,
						this.in_book_author = bookInfo.book_author,
						this.in_book_company = bookInfo.book_company,
						this.in_book_company_date = bookInfo.book_company_date.substr(0,10),
						this.in_book_type = bookInfo.book_type,
						this.in_book_counts = bookInfo.book_counts
					}
				}).catch((error)=>{
					this.$msgBox('网络连接失败，请检查您的网络');
				})
			},
			//删除书籍
			deleteBook(id){
				this.$confirm({
					message:'确认删除该条数据吗？',
					callback:(res)=>{
						if(res){
							this.$axios({
								url:'book/deleteBook',
								data:{
									book_id:id
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
			//加载书籍列表
			loadData(){
				this.$axios({
					url:"book/searchBooks",
					data:{
						book_name:this.book_name,
						book_author:this.book_author,
						book_company:this.book_company,
						book_type:this.book_type,
						startIndex:this.pageCurrent,
						pageSize:this.pageSize
					}
				}).then((result)=>{
					if(result.state == 100){
						this.book = result.data.books;
						if(result.data.pageObj.pageCounts == this.pageCurrent){
							this.nextBtnDisabled = true;
						}else{
							this.nextBtnDisabled = false;
						}
					}else if(result.state == 101){
						this.book = [];
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
				
				&:focus{
					border-color: #03a9f4;
				}
				
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
