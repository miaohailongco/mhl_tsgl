<template>
	<transition name="msgbox">
		<div v-show="show" v-text="message" class="box"></div>
	</transition>
</template>

<script>
	export default {
		name:'msgBox',
		props:{
			message:{
				type:String,
				default:''
			},
			show:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			
		},
		methods:{
			
		}
	}
</script>

<style scoped lang="less">
	.box{
		position: fixed;
		top: 20%;
		left: 50%;
		transform: translate(-50%,-50%);
		display: inline-block;
		background-color: rgba(0,0,0,.8);
		color: #fff;
		border-radius: 4px;
		padding: 15px 35px;
	}
	.msgbox-enter-active,.msgbox-leave-active{
		transition: all 500ms;
		-webkit-transition: all 500ms;
	}
	.msgbox-enter,.msgbox-leave-to{
		opacity: 0;
	}
</style>
