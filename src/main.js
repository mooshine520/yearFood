import Vue from 'vue'
import Vuex from 'vuex'
import App from './App'
import Axios from 'axios'
import VueRouter from 'vue-router'
import './css/commons.css'


Vue.config.productionTip=false;

const baseUrl="http://192.168.32.75/";
//const baseUrl="http://m.tool.114la.com";

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

//启用vuex。
Vue.use(Vuex);
Vue.use(VueRouter);
/*//启用vue路由
Vue.use(VueRouter);

//vuerouter使用的组件，根据实际情况设置
import Empty from './components/empty'
import Charidiom from './components/charidiom'
import SearchList from './components/searchlist'
import IdiomDetail from './components/idiomdetail'

const routes=[
	{path:'/',component:Empty},
	{path:'/py/:char',component:Charidiom,props:true},
	{path:'/search/:keyword',component:SearchList,props:true},
	{path:'/detail/:kid',component:IdiomDetail,props:true}
];

const router=new VueRouter({
	routes:routes
});*/

import Index from './components/index'
import JoinFamily from './components/joinfamily'
import WinnersList from './components/winnerslist'
import PhotoList from './components/photolist'
import MyFamilyDinner from './components/myfamilydinner'

const routes=[
	{path:'/',component:Index},
	{path:'/join',component:JoinFamily},
	{path:'/photolist/:name',component:PhotoList,props:true},
	{path:'/winners',component:WinnersList},
	{path:'/myfamily',component:MyFamilyDinner}
];
const router=new VueRouter({
	routes:routes
});

const store=new Vuex.Store({
	state:{
		
	},
	mutations:{

	},
	actions:{

	},
	getters:{

	}
});


//启动Vue
new Vue({
	el:"#root",
	store,
	router,
	template:'<App/>',
	components:{ App },
	created(){
		var th=this;
		/*Axios.get('citydatas').then(res=>{
			th.$store.commit('savecitys',res.data);
			//设置默认选中的城市，现选第一个默认城市，可以改成热门城市的第一个城市。
			th.$store.commit('checkcity',res.data.lists[0].id);
		});*/

		//获取拼音查询的列表
		//测试地址为'/json/chengyu'

	}
});