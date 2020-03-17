<template>
	<mhl-modal :show="computedShow" :width="computedWidth" @click.self="cancelFun">
		<template v-slot:header>
			<div class="dialog-title" v-text="computedTitle"></div>
		</template>
		<div v-text="computedMessage" class="dialog-message"></div>
		<template v-slot:footer>
			<button class="footer-ok" @click="okFun">确定</button>
			<button class="footer-cancel" v-if="type==1" @click="cancelFun">取消</button>
		</template>
	</mhl-modal>
</template>

<script>
	export default {
		data(){
			return {
				show:false,
				width:'300px',
				title:'提示',
				message:'',
				type:0,//0表示alert，1表示confirm
				callback:function(){}
			}
		},
		computed:{
			computedShow(){
				if(typeof(this.show) == 'boolean'){
					return this.show;
				}else{
					return false;
				}
			},
			computedWidth(){
				if(typeof(this.width) == 'string'){
					return this.width;
				}else if(typeof(this.width) == 'number' && !isNaN(this.width)){
					return this.width + 'px';
				}else{
					return '300px';
				}
			},
			computedTitle(){
				if(typeof(this.title) == 'string'){
					return this.title;
				}else{
					return '提示';
				}
			},
			computedMessage(){
				if(typeof(this.message) == 'string'){
					return this.message;
				}else{
					return '';
				}
			},
			computedCallback(){
				if(typeof(this.callback) == 'function'){
					return this.callback;
				}else{
					return function(){}
				}
			}
		},
		methods:{
			okFun(){
				this.show = false;
				this.$nextTick(()=>{
					this.computedCallback(true);
					document.body.removeChild(this.$el);
					this.$destroy();
				})
			},
			cancelFun(){
				this.show = false;
				this.$nextTick(()=>{
					this.computedCallback(false);
					document.body.removeChild(this.$el);
					this.$destroy();
				})
			}
		}
	}
</script>

<style lang="less" scoped="scoped">
	.dialog-title{
		text-align: center;
	}
	.dialog-message{
		text-align: center;
		padding: 15px 0;
	}
	.footer-ok{
		appearance: none;
		-webkit-appearance: none;
		display: inline-block;
		border: 1px solid #2196f3;
		background-color: #2196f3;
		color: #fff;
		padding: 6px 10px;
		border-radius: 4px;
		cursor: pointer;
	}
	.footer-cancel{
		appearance: none;
		-webkit-appearance: none;
		display: inline-block;
		border: 1px solid #ddd;
		background-color:#fff;
		color: #333;
		padding: 6px 10px;
		border-radius: 4px;
		margin-left: 15px;
		cursor: pointer;
	}
</style>
