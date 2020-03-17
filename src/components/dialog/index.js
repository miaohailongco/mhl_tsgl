import dialog from './dialog'

var Dialog = {};

Dialog.install = function(Vue){
	const DialogControsutor =  Vue.extend(dialog);
	
	Vue.prototype.$alert = function(options){
		var dialogControsutor = new DialogControsutor();
		dialogControsutor.$mount();
		if(!document.body.contains(dialogControsutor.$el)){
			document.body.appendChild(dialogControsutor.$el);
		}
		
		if(typeof(options) != 'object'){
			options = {};
		}
		
		dialogControsutor.show = true;
		dialogControsutor.title = options.title;
		dialogControsutor.message = options.message;
		dialogControsutor.callback = options.callback;
		dialogControsutor.width = options.width;
		dialogControsutor.type = 0;
	}
	
	Vue.prototype.$confirm = function(options){
		var dialogControsutor = new DialogControsutor();
		dialogControsutor.$mount();
		if(!document.body.contains(dialogControsutor.$el)){
			document.body.appendChild(dialogControsutor.$el);
		}
		
		if(typeof(options) != 'object'){
			options = {};
		}
		
		dialogControsutor.show = true;
		dialogControsutor.title = options.title;
		dialogControsutor.message = options.message;
		dialogControsutor.callback = options.callback;
		dialogControsutor.width = options.width;
		dialogControsutor.type = 1;
	}
}

export default Dialog