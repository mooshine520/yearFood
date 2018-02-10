import $ from 'jquery'
import fm from './js/nianyefan.js'
import './css/common.css'
import './css/nianyefan.css'
import { checkAPPAndLogin } from './js/check.js'
window.util=fm.util;
window.nianyefan=fm.nianyefan;
window.$=$;
window.checkAPPAndLogin=checkAPPAndLogin;

//document.domain="114la.com";

//启用rem单位
function initrem(){
	var _w=750;
	var nw=window.innerWidth||document.documentElement.clientWidth;
	if(nw>_w){
		nw=_w;
	}
	document.documentElement.style.fontSize=(nw/_w)*100+'px';
}
initrem();
window.addEventListener('resize',initrem);
window.addEventListener('orientationchange',initrem);






