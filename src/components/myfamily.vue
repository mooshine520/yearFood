<template>
<div class='wrapper0'>
	<div class='my-cont'> 
		<swiper :options="swiperOption" class='myswiper' ref="mySwiper" @someSwiperEvent="callback">
		    <!-- slides -->
		    <swiper-slide v-for='ipath in infos.img_path'><div class='my-imgslide' :style='{"background-image":"url("+ipath+")"}'></div></swiper-slide>
		    <!-- Optional controls -->
		    <div class="swiper-pagination"  slot="pagination"></div>
		 </swiper>
		 <div class='my-textcont'>
			 <div class='flexcont my-baseinfo'>
			 	<div class='flexitem'>{{infos.tel}}</div>
			 	<div class='my-votenum'><span class='my-red'>{{infos.ticket_num}}</span>票</div>
			 </div>
			 <div class='my-words'>
			 	{{infos.content}}
			 </div>
			 <div class='flexcont vote-panel'>
			 	<div class='flexitem'>{{infos.id}}号</div>
			 	<div><a href='javascript:;' class='elm-btn' @click='votethisphoto'><i :class='{"voteicon":true,"hadvote":infos.isVote==1,"novote":infos.isVote!=1}'></i>投票</a></div>
			 </div>
		 </div>
	</div>
	<div class='flexcont mybtn-cont'>
		<div class='flexitem'>
			<a href='javascript:;' @click='mywantjoin' class='jnbtn'>{{update?"我要修改":"我要参与"}}</a>
		</div>
		<div class='jn-btn-sp'></div>
		<div class="flexitem">
			<a href='javascript:;' @click='sharethis' class="jnbtn">分享</a>
		</div>
	</div>
	<div class='my-banner' @click='jingyanhao'>
		<img src='./../images/Banner.png'/>
	</div>
	<div class='deli-title'>——— &nbsp;当前榜单&nbsp; ———</div>

	<div class='ranklist'>
		<RankElm class='rkitem' v-for='(rk,index) in ranks' :key='index' :info='rk'></RankElm>
	</div>
	<div class='morebtn'>
		<a href='/j/detail/familydinner/family_photowall.html' class='morelink'>查看更多</a>
	</div>
	<Delicious></Delicious>
    <div class="sharePanel" @click='hideshare' v-show='share'></div>
	<Modal  type='alert' @took='okfall' :showstate='needlogin'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要登录后才能参与</div>
	</Modal>
	<Modal  type='alert' @took='okfall2' :showstate='needapplogin'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要在114啦APP中登录后才能参与</div>
	</Modal>
	<Modal  type='alert' @took='okfall3' :showstate='inapp'>
		<span slot='tlt'>提示</span>
		<div slot='text'>只有在114啦APP中登录后才能投票</div>
	</Modal>
	<Modal  type='confirm' @took='okfall4' @tocancel='cancelfall' :showstate='updatecfm'>
		<span slot='tlt'>提示</span>
		<div slot='text'>作品修改后票数会清零，审核通过后才能进入排行榜！</div>
	</Modal>
	<Modal  type='alert' @took='okfall5' :showstate='jingyan'>
		<span slot='tlt'>提示</span>
		<div slot='text'>请在电脑端访问mp.114la.com，即可入驻114啦验号</div>
	</Modal>
	<Modal  type='alert' @took='okfall6' :showstate='votesucc'>
		<span slot='tlt'>提示</span>
		<div slot='text'>恭喜，投票成功！</div>
	</Modal>
	<Modal  type='alert' @took='okfall7' :showstate='votenot'>
		<span slot='tlt'>提示</span>
		<div slot='text'>没有投票机会了！</div>
	</Modal>
	<Modal  type='alert' @took='okfall8' :showstate='voteover'>
		<span slot='tlt'>提示</span>
		<div slot='text'>活动已经结束了！</div>
	</Modal>
	<div class='footwin'>
		<div class='foot-item' @click='mywantjoin2'>首页</div>
		<div class='foot-item' @click='back'>顶部</div>
	</div>
</div>

</template>
<script>
import { swiper ,swiperSlide } from 'vue-awesome-swiper'
import RankElm from './rankelm'
import Delicious from './delicious'
import { checkAPPAndLogin } from './../js/check.js'
import Axios from 'axios'
import { mapState } from 'vuex'
import Modal from './modal'
export default{
	name:'myfamily',
	components:{
		swiper,
		swiperSlide,
		Modal,
		RankElm,
		Delicious
	},
	data(){
		return {
			infos:{},
			swiperOption:{
			    direction: 'horizontal',
			    loop: true,
			    // 如果需要分页器
			    pagination: {el:'.swiper-pagination'},
			    autoplay:{
				    	delay: 2000,
				   		stopOnLastSlide: false,
				   		disableOnInteraction: false,
				    }
			 },
			voted:true,
			ranks:[],
			share:false,
			needlogin:false,
			needapplogin:false,
			inapp:false,
			update:false,
			updatecfm:false,
			jingyan:false,
			votesucc:false,
			votenot:false,
			voteover:false
		}
	},
	created(){
		checkAPPAndLogin();
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
		this.queryInfos();
		this.queryRank();
	},
	computed:{
		...mapState([
			'workid'
		])
	},
	methods:{
		callback(){

		},
		votethisphoto(){
			/*if(!window.userinfo){
				this.inapp=true;
				return ;
			}*/
			axios.get('/YearFood/userVote/'+this.workid+(window.userinfo?"/"+userinfo.user_id:"")+"?tm="+(new Date()).getTime()).then(res=>{
				if(res.data.status==1){
					this.votesucc=true;
					this.queryInfos();
				}else if(res.data.status==2){
					this.votenot=true;
				}else if(res.data.status==3){
					this.voteover=true;
				}else{
					alert("缺少必要参数");
				}
			});
		},
		queryInfos(){
			Axios.get("/YearFood/search/"+this.workid+"/1").then(res=>{
				if(res.data.content&&res.data.content.length>=1&&res.data.status!=0){
					this.infos=res.data.content[0];
					if(window.userinfo){
						if(window.userinfo.tel==this.infos.tel){
							this.update=true;
						}
					}
				}else{
					alert("作品不存在或已经因违规被删除");

				}
			});
		},
		queryRank(){
			//查询排行榜
			Axios.get("/YearFood/toplist/0/4").then(res=>{
				if(res.data&&res.data.content&&res.data.content.length>0){
					this.ranks=this.ranks.concat(res.data.content);
					for(let i=0;i<this.ranks.length;i++){
						this.ranks[i].rank=i-(-1);
					}
				}
			});
		},
		sharethis(){
			if(window.Js114la&&Js114la.shareAdvertisementUrl){
				let imgurl=this.infos.img_path?this.infos.img_path[0]:"";
				Js114la.shareAdvertisementUrl("晒年夜饭，赢千元红包", window.location.href, imgurl);
	/*			let lastTime=localStorage.getItem('family_shared');
				let nowTime=(new Date()).getTime();

				let first=false;
				if(!lastTime){
					first=true;
				}
				if(first||(nowTime-lastTime)/(1000*60)>24*60){
					localStorage.setIem('family_shared',nowTime);
					if(!window.userinfo){
						return ;
					}
					
				}*/

				Axios.get("/YearFood/sharePlusTicket/"+userinfo.user_id).then(res=>{
						//console.log(res);
				});

			}else{
				//if(/MicroMessenger|QQ|WeiBo/.test(window.navigator.userAgent)){
					this.share=true;
				Axios.get("/YearFood/sharePlusTicket/"+userinfo.user_id).then(res=>{
						//console.log(res);
				});
				//}else{
					//do nothing
				//}
				//this.share=true;
			}
		},
		hideshare(){
			this.share=false;
		},
		mywantjoin(){
			let key=checkAPPAndLogin();
			if(key==-1){
				this.needlogin=true;
				return ;
			}
			if(key==-2){
				this.needapplogin=true;
				return ;
			}
			if(key==1){
				if(this.update){
					this.updatecfm=true;
				}else{
					window.location.href="/j/detail/familydinner/family_joinin.html";
				}
			}
			window.location.href='/j/detail/familydinner/family_index.html';

		},
		mywantjoin2(){
			window.location.href='/j/detail/familydinner/family_index.html';
		},
		okfall(){
			this.needlogin=false;
			if(Js114la.handle114laClientLogin){
	    		window.Js114la.handle114laClientLogin();
	    	}
		},
		okfall2(){
			this.needapplogin=false;
			setTimeout(()=>{
				window.location.href='http://www.114la.com/app/114la/index.html';
			},800);
			
		},
		okfall3(){
			this.inapp=false;
		},
		okfall4(){
			this.updatecfm=false;
			window.location.href="/j/detail/familydinner/family_joinin.html";
		},
		cancelfall(){
			this.updatecfm=false;
		},
		back(){
			window.scrollTo(0,0);
		},
		jingyanhao(){
			this.jingyan=true;
		},
		okfall5(){
			this.jingyan=false;
		},
		okfall6(){
			this.votesucc=false;
		},
		okfall7(){
			this.votenot=false;
		},
		okfall8(){
			this.voteover=false;
		}
	}
}
</script>
<style>
.my-cont{box-sizing:border-box;padding:0.04rem;background:#FFFFFF;border-bottom-left-radius: 0.06rem;border-bottom-right-radius: 0.06rem;margin-top:0.28rem;}
.myswiper{width:100%;height:5rem;}
.my-imgslide{height:100%;background-position:center;background-repeat:no-repeat; background-size:auto 100%;background-color:#858585;}
.my-baseinfo{font-size:0.3rem;color:#97A396;line-height:0.68rem;}
.my-votenum{}
.my-red{color:#EE1B24;}
.my-textcont{padding:0.12rem 0.3rem 0.25rem 0.3rem;}
.my-words{line-height:0.32rem;height:0.64rem;font-size:0.28rem;overflow: hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:2;margin:0.2rem 0;}
.elm-btn{display:inline-block;width:1.88rem;height:0.68rem;background:url(./../images/btn_toupiao.png) center no-repeat;background-size:100% 100%;text-align: center;text-decoration: none;line-height:0.68rem;color:#410003;font-size:0.3rem;vertical-align: middle;}
.vote-panel{line-height:0.9rem;color:#97A396;}
.voteicon{display:inline-block;width:0.32rem;height:0.3rem;vertical-align:middle;margin-right:0.15rem;}
.hadvote{background:url(./../images/icon_like.png) center no-repeat; background-size: 100% 100%;}
.novote{background:url(./../images/icon_unlike.png) center no-repeat;background-size:100% 100%;}
.mybtn-cont{margin:0.45rem 0;}
.morelink{background:url(./../images/largeBtn.png) center no-repeat;background-size:100% 100%;display:inline-block;width:3.34rem;height:0.82rem;line-height:0.82rem;color:#410003;font-size:0.38rem;text-align:center;text-decoration: none;}
.morebtn{margin:0.42rem 0;text-align:center;}
.sharePanel{
            position: fixed;
            top: 0;
            left:0;
            right:0;
            bottom:0;
            background-color: rgba(0,0,0,0.8);
            background-image: url("./../images/guideShare.png");
            background-size: contain;
            background-position: center 10%;
            background-repeat: no-repeat;
            z-index: 999;
        }
.my-banner{width:100%;margin:0.2rem 0;border-radius:0.16rem;}
.my-banner img{width:100%;}
</style>