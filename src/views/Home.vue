<template>
	<div class="container">
		<div class="header">
			<div>mhl图书管理系统</div>
			<div>
				<span @click="toPerson">{{user.user_name}}</span>
				<span style="margin-left: 10px;" @click="exit">[退出]</span>
			</div>
		</div>
		<div class="content">
			<div class="titles">
				<router-link :class="'sub' + ($route.name == 'renderHall'?' active':'')" to="/" tag="div">首页</router-link>
				<router-link :class="'sub' + ($route.name == 'personCenter'?' active':'')" to="/personCenter" tag="div">个人中心</router-link>
			</div>
			<div class="detail">
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
		computed:{
			user(){
				return this.$store.state.user || {}
			}
		},
		mounted() {
			
		},
		methods:{
			//进入个人中心
			toPerson(){
				
			},
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
			
			&>span{
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
		flex-direction: column;
		height: calc(100% - 100px);
	}
	.titles{
		width: 100%;
		height: 30px;
		background-color: #beed12;
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		align-items: center;
		padding-left: 20px;
		// border-bottom: 1px solid #000;
		
		&>.sub{
			display: flex;
			display: -webkit-flex;
			justify-content: center;
			align-items: center;
			height: 100%;
			font-size: 16px;
			cursor: pointer;
			
			&:not(:first-child){
				margin-left: 40px;
			}
			
			&.active{
				font-size: 16px;
					font-weight: bolder;
					cursor: pointer;
					border-bottom: 3px solid #f00;
			}
		}
	}
	.detail{
		width: 100%;
		flex: 1;
	}
</style>
