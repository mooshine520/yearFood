 function checkAPPAndLogin(){

	 if(window.Js114la && Js114la.getUserInfoString){
		let user_info=null;
	    try{
	        user_info = JSON.parse(Js114la.getUserInfoString());
	    }catch (e){
	        user_info=Js114la.getUserInfoString();
	    }
	    if(!(user_info&&user_info.token&&user_info.token!="")){
	    	/*if(Js114la.handle114laClientLogin){
	    		window.Js114la.handle114laClientLogin();
	    	}*/
	    	return -1;
	    }else{
	    	window.usertoken=user_info;
	    	return 1;
	    }
	 }else{
	 	return -2;
	 }
 }

function initcheck(){
	let key=checkAPPAndLogin();
	if(key==-1){
		let div=document.createElement("DIV");
		div.style.cssText="position:fixed;z-index:9999;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,0.1);";
		document.body.appendChild(div);
	}else if(key==-2){
		let div=document.createElement("DIV");
		div.style.cssText="position:fixed;z-index:9999;left:0;right:0;top:0;bottom:0;background:rgba(0,0,0,0.1);text-align:center;font-size:0.3rem;color:#FFF;font-weight:bold";
		div.innerHTML='<div style="padding-top:2rem;">在114啦APP中登陆才可参此活动</div>';
		//document.body.appendChild(div);
		setTimeout(()=>{
			//window.location.href='http://www.114la.com/app/114la/index.html';
		},5000);
	}else{
		//let area=document.createElement("textarea");
		//alert(JSON.stringify(window.usertoken));
		
	}
}
checkAPPAndLogin();
//initcheck();
module.exports={
	checkAPPAndLogin:checkAPPAndLogin,
	initcheck:initcheck
}