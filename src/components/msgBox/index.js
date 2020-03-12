import msgbox from "./msgBox"

const Msgbox = {};

Msgbox.install = function(Vue){
	const MB = Vue.extend(msgbox);
	Vue.prototype.$msgBox = function(message){
		var mb = new MB();
		mb.$mount();
		document.body.appendChild(mb.$el)
		mb.message = message;
		mb.show = true;
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