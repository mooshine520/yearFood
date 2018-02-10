 function checkAPPAndLogin(){
	 if(window.Js114la && Js114la.getUserInfoString){
		let user_info=null;
	    try{
	        user_info = JSON.parse(Js114la.getUserInfoString());
	    }catch (e){
	        user_info=Js114la.getUserInfoString();
	    }
	    if(!(user_info&&user_info.token&&user_info.token!="")){
	    	window.Js114la.handle114laClientLogin();
	    	return false;
	    }else{
	    	window.userinfo=user_info;
	    	return true;
	    }
	 }else{
	 	return false;
	 }
 }

 export default{
 	checkAPPAndLogin:checkAPPAndLogin
 }