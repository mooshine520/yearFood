<template>
<div class='wrapper0'>
	<div class='pw-search-cont'>
		<input type='text' v-model='keyword' class='pw-text' placeholder="请输入编号或手机号码" />
		<i class='pw-search-icon' @click='searchpw'></i>
	</div>
	<div class='ranklist'>
		<RankElm class='rkitem' v-for='(rk,index) in preranks' :key='index' :info='rk'></RankElm>
		<div class='my-banner' @click='jingyanhao'>
			<img src='./../images/Banner2.png'/>
		</div>
		<RankElm class='rkitem' v-for='(rk,index) in afterranks' :key='index' :info='rk'></RankElm>
	</div>
	<div class='norsttip' v-show='ranks.length==0&&!first'>
		没有相关的查询结果
	</div>
	<Modal  type='alert' @took='okfall' :showstate='keytip'>
		<span slot='tlt'>提示</span>
		<div slot='text'>请输入编号或手机号再查询</div>
	</Modal>
	<Modal  type='alert' @took='okfall2' :showstate='mustnum'>
		<span slot='tlt'>提示</span>
		<div slot='text'>只有编号或手机号可以查询</div>
	</Modal>
	<Modal  type='alert' @took='okfall3' :showstate='needlogin'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要登录后才能参与</div>
	</Modal>
	<Modal  type='alert' @took='okfall4' :showstate='needapplogin'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要在114啦APP中登录后才能参与</div>
	</Modal>
	<Modal  type='alert' @took='okfall5' :showstate='jingyan'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要在114啦APP中登录后才能参与</div>
	</Modal>
	<Loadmore v-if='hasmore' :needload='true'  :emited='isload' @loadother='getnextpage'></Loadmore> 
	<div class='footwin'>
		<div class='foot-item' @click='mywantjoin'>首页</div>
		<div class='foot-item' @click='back'>顶部</div>
	</div>
</div>
</template>
<script>
import RankElm from './rankelm'
import Modal from './modal'
import Axios from 'axios'
import Loadmore from './loadmore'
import { checkAPPAndLogin } from './../js/check.js'
export default{
	name:'photowall',
	components:{
		RankElm,
		Modal,
		Loadmore
	},
	data(){
		return {
			ranks:[],
			keyword:"",
			keytip:false,
			first:true,
			start:0,
			end:20,
			isload:false,
			hasmore:true,
			mustnum:false,
			needlogin:false,
			needapplogin:false,
			jingyan:false
		}
	},
	created(){
		checkAPPAndLogin();
		//window.usertoken={token:"a492QhZJ6CBMSkfjZz9fkHKg8n0vwWAme5SxSmejnYWMM2Yg+sBB05rvZMAi+fTl4w".replace("+",".")};
		if(window.usertoken){
			$.get("/YearFood/get_user/",{token:encodeURIComponent(usertoken.token)},res=>{
				if(res.user_id!=null&&res.user_id!=""){
					window.userinfo=res;
				}else{
					alert("随机用户");
					window.userinfo={user_id:Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+'',tel:'1568854'+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+''};
				}
			},"json");
		}
		this.queryrank();
	},
	computed:{
		preranks(){
			return this.ranks.slice(0,3);
		},
		afterranks(){
			return this.ranks.slice(3);
		}
	},
	methods:{
		searchpw(){
			if(this.keyword==""){
				//this.keytip=true;
				this.start=0;
				this.queryrank();
				return ;
			}
			if(!/^\d+$/.test(this.keyword)){
				this.mustnum=true;
				return ;
			}
			//查询
			this.hasmore=false;
			Axios.get("/YearFood/search/"+this.keyword).then(res=>{
				if(res.data&&res.data.content){
					this.ranks=res.data.content;
					console.log(this.ranks);
				}
			});
		},
		okfall(){
			this.keytip=false;
		},
		okfall2(){
			this.mustnum=false;
		},
		queryrank(){
			this.isload=true;
			//查询排行榜
			Axios.get("/YearFood/toplist/"+this.start+"/"+this.end).then(res=>{
				if(res.data&&res.data.content&&res.data.content.length>0){
					this.ranks=this.ranks.concat(res.data.content);
					for(let i=0;i<this.ranks.length;i++){
						this.ranks[i].rank=i-(-1);
					}
					this.start=this.start+20;
				}else{
					//没有更多内容了
					this.hasmore=false;
				}
				this.isload=false;
			});
			this.first=false;
		},
		getnextpage(){
			if(this.hasmore){
				this.queryrank();
			}
		},
		mywantjoin(){
			/*let key=checkAPPAndLogin();
			if(key==-1){
				this.needlogin=true;
				return ;
			}
			if(key==-2){
				this.needapplogin=true;
				return ;
			}
			if(key==1){
				window.location.href="family_joinin.html";
			}*/
			window.location.href="family_index.html";

		},
		back(){
				window.scrollTo(0,0);
		},
		okfall3(){
			this.needlogin=false;
		},
		okfall4(){
			this.needapplogin=false;
			setTimeout(()=>{
				window.location.href='http://www.114la.com/app/114la/index.html';
			},800);
		},
		jingyanhao(){
			alert("请在电脑端访问mp.114la.com，即可入驻114啦验号");
		}
	}

}
</script>
<style scoped>
.pw-search-cont{margin:0.28rem 0;position:relative;}
.pw-text{display:block;width:100%;box-sizing: border-box;border:0.04rem solid #3D0303;line-height:0.74rem;border-radius: 0.37rem;font-size:0.32rem;padding-left:0.4rem;padding-right:0.8rem;outline:none;}
.pw-search-icon{position:absolute;width:0.48rem;height:0.48rem;background:url(./../images/btn_sousuo.png) center no-repeat;background-size: 100% 100%;right:0.2rem;top:0.16rem;}
.norsttip{text-align:center;color:#FFFFFF;font-size:0.32rem;margin-top:1rem;}
.ranklist{padding-bottom:0.7rem;}
.my-banner{width:100%;margin:0.2rem 0;border-radius:0.16rem;}
.my-banner img{width:100%;}
</style>