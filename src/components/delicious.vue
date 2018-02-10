<template>
<div class='wrapper1'>
	<div class='deli-title'>——— &nbsp;美食推荐&nbsp; ———</div>
	<div class='deli-cont'>
		<a class='deli-item' target="_blank" v-for="de in dlist" :href='de.url'>
			<div class='deli-subject'>{{de.subject}}</div>
			<div class='deli-imgcont'>
				<div class='deli-img-inner'>
					<div  class='deli-img' v-for="di in de.pics" >
						<div class='deli-imgbg' :style='{"background-image":"url("+di.src+")"}'></div>
					</div>
				</div>
			</div>
			<div class='deli-tags'>
				<div class='deli-tagcont'>
					<div class='deli-tag' v-for='dt in de.tags'>{{dt}}</div>
				</div>
				<div class='deli-useful'><i class='deli-vote'></i>{{de.useful_num}}</div>
			</div>
		</a>
	</div>
	<Loadmore :needload='dlist.length<total'  :emited='isload' @loadother='getnextpage'></Loadmore> 
</div>
</template>
<script>
import Axios from 'axios'
import Loadmore from './loadmore'
export default{
	name:'delicious',
	data(){
		return {
			dlist:[],
			start:0,
			limit:20,
			total:0,
			isload:false
		}
	},
	components:{
		Loadmore
	},
	created(){
		this.getDlist();
	},
	methods:{
		getDlist(){
			this.isload=true;
			Axios.get("/YearFood/get_message/"+this.start+"/"+this.limit).then(rst=>{
				if(rst.data&&rst.data.data&&rst.data.data.list){
					this.dlist=this.dlist.concat(rst.data.data.list);
					this.total=rst.data.data.count;
					this.start=this.start+this.limit;
					console.log(this.dlist.length);
					this.isload=false;
				}
			});
		},
		getnextpage(){
			this.getDlist();
		}
	}
}
</script>
<style scoped>
.deli-cont{background:#fff;border-radius: 0.06rem;box-sizing: border-box;padding:0 0.16rem;}
.deli-item{display:inline-block;text-decoration: none;width:100%;padding-top:0.18rem;}
.deli-subject{font-size:0.38rem;line-height:0.8rem;color:#333333;}
.deli-imgcont{overflow:hidden;}
.deli-img-inner{margin-right:-0.06rem;font-size:0;}
.deli-img{width:33.333333%;box-sizing: border-box;padding-right:0.06rem;height:1.87rem;display: inline-block;}
.deli-imgbg{width:100%;height:1.87rem;background-size:100% auto;background-position: center;background-repeat: no-repeat;background-clip:border-box;}
.deli-tags{display: flex;line-height: 0.74rem;color:#9B9B9B;}
.deli-tagcont{flex:1;}
.deli-tag{font-size:0.26rem;display:inline-block;}
.deli-tag + .deli-tag{margin-left:0.15rem;}
.deli-useful{}
.deli-item + .deli-item{margin-top:0.18rem;border-top:0.01rem solid #F2F2F2;}
.deli-vote{display: inline-block;width:0.32rem;height:0.32rem;margin-right:0.1rem;vertical-align: middle;background:url(./../images/btn_zan.png) center no-repeat;background-size: 100% 100%;}
</style>