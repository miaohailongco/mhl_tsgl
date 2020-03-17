<template>
	<transition name="modal">
		<div v-on="listeners" class="modal" :style="modalStyle" v-show="show" @click.self="closeModal">
			<div class="dialog" :style="dialogStyle">
				<div class="header" v-if="$slots.header"><slot name="header"></slot></div>
				<div class="content" v-if="$slots.default"><slot></slot></div>
				<div class="footer" v-if="$slots.footer"><slot name="footer"></slot></div>
			</div>
		</div>
	</transition>
</template>

<script>
	export default {
		name:"mhl-modal",
		data(){
			return {
				
			}
		},
		model:{
			prop:'show',
			event:'onchange'
		},
		props:{
			show:{
				type:Boolean,
				default:false
			},
			width:{
				type:String,
				default:'600px'
			},
			closable:{
				type:Boolean,
				default:false
			}
		},
		computed:{
			listeners(){
				return Object.assign({},this.$listeners)
			},
			modalStyle(){
				var style = {};
				style.width = window.innerWidth + 'px';
				style.height = window.innerHeight + 'px';
				return style
			},
			dialogStyle(){
				var style = {};
				style.width = this.width;
				style.maxHeight = window.innerHeight * 0.9 + 'px';
				return style
			}
		},
		methods:{
			closeModal(){
				if(this.closable){
					this.$emit('onchange',false);
				}
			}
		}
	}
</script>

<style scoped lang="less">
	.modal{
		position: fixed;
		left: 0;
		top: 0;
		z-index: 1200;
		background-color: rgba(0,0,0,.5);
		display: flex;
		display: -webkit-flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}
	.dialog{
		display: flex;
		display: -webkit-flex;
		justify-content: flex-start;
		flex-direction: column;
		background-color: #fff;
		overflow: hidden;
		color: #333;
		border-radius: 4px;
	}
	.header{
		padding: 10px 15px;
		border-bottom: 1px solid #eee;
		font-size: 18px;
	}
	.content{
		padding: 10px 15px;
		font-size: 14px;
		flex: 1;
		overflow: auto;
	}
	.footer{
		text-align: right;
		font-size: 12px;
		color: #666;
		padding: 10px 15px;
		border-top: 1px solid #eee;
	}
	.modal-enter-active,.modal-leave-active{
		transition: all 400ms;
		-webkit-transition: all 400ms;
	}
	.modal-enter,.modal-leave-to{
		opacity: 0;
		transform: translateY(20px);
	}
</style>
