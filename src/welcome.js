import './css/commons.css'

const baseUrl="http://192.168.32.75/";
//const baseUrl="http://m.tool.114la.com";

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