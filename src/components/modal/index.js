import modal from "./modal"

modal.install = function(Vue){
	//全局注册组件
	Vue.component(modal.name,modal)
}

export default modal