<template>
	<div class="container">
		<div class="header">
			<div>mhl图书管理系统</div>
			<div>
				<span>{{$store.state.user.user_name}}</span>
				<span style="margin-left: 10px;" @click="exit">[退出]</span>
			</div>
		</div>
		<div class="content">
			<div class="left-content">
				<router-link class="glml" to="/admin/userGL" tag="div">用户管理</router-link>
				<router-link class="glml" to="/admin/bookGL" tag="div">书籍管理</router-link>
				<router-link class="glml" to="/admin/bookTypeGL" tag="div">图书类型管理</router-link>
				<router-link class="glml" to="/admin/renderGL" tag="div">租借记录管理</router-link>
			</div>
			<div class="right-content">
				<router-view/>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data(){
			return {
				
			}
		},
		methods:{
			exit(){
				this.$store.commit('setToken','');
				this.$store.commit('setUser',{});
				this.$router.replace('/login');
			}
		}
	}
</script>

<style scoped lang="less">
	.container{
		height: 100%;
	}
	.header{
		position: relative;
		height: 100px;
		background-color: #009688;
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		font-size: 40px;
		border-bottom: 1px solid #000;
		
		&>div:last-child{
			position: absolute;
			right: 0;
			bottom: 0;
			font-size: 16px;
			color: #0311f4;
			margin-right: 20px;
			
			&>span:last-child{
				cursor: pointer;
				
				&:hover{
					color: #fff;
				}
				
				&:active{
					color: #000;
				}
			}
		}
	}
	.content{
		display: flex;
		display: -webkit-flex;
		height: calc(100% - 100px);
		
		&>.left-content{
			width: 200px;
			min-width: 140px;
			font-size: 20px;
			background-color: #03c442;
			height: 100%;
			
			&>.glml{
				display: flex;
				display: -webkit-flex;
				justify-content: center;
				align-items: center;
				height: 80px;
				border-bottom: 1px solid #000;
				border-right: 1px solid #000;
				cursor: pointer;
				
				&:hover{
					background-color: #058c31;
				}
				
				&:active{
					background-color: #68e792;
				}
			}
		}
		
		&>.right-content{
			flex: 1;
			height: 100%;
			overflow: auto;
		}
	}
</style>
