//引入msgBox.vue文件
import msgbox from "./msgBox"

//定义一个空对象
const Msgbox = {};

//install方法，
Msgbox.install = function(Vue){
	//获取msgbox类
	const MB = Vue.extend(msgbox);
	Vue.prototype.$msgBox = function(message){
		var mb = new MB();
		//挂载
		mb.$mount();
		console.log(mb);
		document.body.appendChild(mb.$el)
		mb.message = message;
		mb.show = true;
		//DOM操作结束之后
		mb.$nextTick(()=>{
			setTimeout(()=>{
				mb.show = false;
				setTimeout(()=>{
					document.body.removeChild(mb.$el)
				},500)
			},1500)
		})
	}
}

export default Msgbox