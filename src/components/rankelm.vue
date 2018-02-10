<template>
<div class='elm-wrapper'>
	<div class='elm-img-cont' @click='getdetail'>
		<img :src='info.img_path[0]'/>
		<div class='elm-vote-num'>{{info.ticket_num}}票</div>
		<div class='rank-num1' v-if='info.rank==1'></div>
		<div class='rank-num2' v-if='info.rank==2'></div>
		<div class='rank-num3' v-if='info.rank==3'></div>
		<div class='rank-num4' v-if='info.rank>3'>{{info.rank}}</div>
	</div>
	<div class='elm-text-cont'>
		<div class='iphone'>{{info.tel}}</div>
		<div class='elm-text'>{{info.content}}</div>
		<div class='elm-vote'><div class='elm-no'>{{info.id}}号</div><div class='elm-votebtn'><a href='javascript:;' class='elm-btn' @click='votethisphoto'><i :class='{"voteicon":true,"hadvote":info.isVote==1,"novote":info.isVote!=1}' ></i>投票</a></div></div>
	</div>
	<Modal  type='alert' @took='okfall' :showstate='voteok'>
		<span slot='tlt'>提示</span>
		<div slot='text'>感谢你，投票成功了</div>
	</Modal>
	<Modal  type='alert' @took='okfall2' :showstate='novotechance'>
		<span slot='tlt'>提示</span>
		<div slot='text'>没有投票机会了！</div>
	</Modal>
	<Modal  type='alert' @took='okfall3' :showstate='gameover'>
		<span slot='tlt'>提示</span>
		<div slot='text'>活动已经结束了！</div>
	</Modal>
	<Modal  type='alert' @took='okfall4' :showstate='inapp'>
		<span slot='tlt'>提示</span>
		<div slot='text'>只有在114啦APP中登录后才能投票</div>
	</Modal>
</div>
</template>
<script>
import Axios from 'axios'
import Modal from './modal'
import { checkAPPAndLogin } from './../js/check.js'
export default{
	name:'rankelm',
	props:['info'],
	components:{
		Modal
	},
	data(){
		return {
			voteok:false,
			novotechance:false,
			gameover:false,
			inapp:false
		}
	},
	methods:{
		votethisphoto:function(){
			/*if(!window.userinfo){
				this.inapp=true;
				return ;
			}*/
			//接口不通。
			axios.get('/YearFood/userVote/'+this.info.id+(window.userinfo?"/"+userinfo.user_id:"")+"?tm="+(new Date()).getTime()).then(res=>{
				if(res.data.status==1){
					this.voteok=true;
					this.info.ticket_num-=-1;
				}else if(res.data.status==2){
					this.novotechance=true;
				}else if(res.data.status==3){
					this.gameover=true;
				}else{
					alert("缺少必要参数");
				}
			});
		},
		okfall(){
			this.voteok=false;
		},
		okfall2(){
			this.novotechance=false;
		},
		okfall3(){
			this.gameover=false;
		},
		okfall4(){
			this.inapp=false;
		},
		getdetail(){
			window.location.href="/j/detail/familydinner/family_myfamily/"+this.info.id+"";
		}
	}
}
</script>
<style scoped>
.elm-wrapper{box-sizing:border-box;padding:0.16rem;background:#FFFFFF;display:flex;border-radius: 0.08rem;}
.elm-img-cont{width:3.2rem;height:2.4rem;position:relative;border-radius: 0.08rem;overflow: hidden;}
.elm-img-cont img{width:100%;height:100%;}
.elm-text-cont{flex:1;margin-left:0.18rem;}
.elm-vote{display:flex;line-height:1.02rem;}
.elm-votebtn{flex:1;text-align: right;}
.elm-btn{display:inline-block;width:1.88rem;height:0.68rem;background:url(./../images/btn_toupiao.png) center no-repeat;background-size:100% 100%;text-align: center;text-decoration: none;line-height:0.68rem;color:#410003;font-size:0.3rem;vertical-align: middle;}
.voteicon{display:inline-block;width:0.32rem;height:0.3rem;vertical-align:middle;margin-right:0.15rem;}
.hadvote{background:url(./../images/icon_like.png) center no-repeat; background-size: 100% 100%;}
.novote{background:url(./../images/icon_unlike.png) center no-repeat;background-size:100% 100%;}
.iphone{font-size:0.3rem;color:#97A396;line-height:0.58rem;}
.elm-text{font-size:0.28rem;color:#232922;line-height:0.4rem;height:0.8rem;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.elm-no{font-size:0.3rem;color:#97A396;}
.elm-vote-num{position:absolute;z-index: 2;right:0.06rem;bottom:0.04rem;font-size:0.26rem;color:#FFFFFF;}
.rank-num1{position:absolute;width:0.96rem;height:0.36rem;background:url(./../images/icon_no_one.png) center no-repeat;background-size:100% 100%;z-index: 12;left:0;top:0;}
.rank-num2{position:absolute;width:0.96rem;height:0.36rem;background:url(./../images/icon_no_two.png) center no-repeat;background-size:100% 100%;z-index: 12;left:0;top:0;}
.rank-num3{position:absolute;width:0.96rem;height:0.36rem;background:url(./../images/icon_no_three.png) center no-repeat;background-size:100% 100%;z-index: 12;left:0;top:0;}
.rank-num4{position:absolute;height:0.36rem;background:#EE1B24;z-index: 12;left:0;top:0;text-align:Center;color:#fff;font-size:0.22rem;padding:0 0.15rem;}
</style>