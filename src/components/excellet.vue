<template>
<div class='wrapper0'>
	<div class='exc-title'>——— 优秀作品展示 ———</div>
	<div class='exc-cont'>
		<div class='exc-inner'>
			<div class='exc-item ' @click='showexcellet(index-(-1))' v-for='(t,index) in tmps'>
				<div class="exc-around vflexcont">
					<div class='exc-img '>
						<img :src='"/"+t.img_path[0]'/>
					</div>
					<div class='exc-text vflexitem'>{{t.content}}</div>
				</div>
			</div>
		</div>
	</div>
</div>
</template>
<script>
import Axios from 'axios'
export default{
	name:'excellet',
	data(){
		return {
			tmps:[]
		}
	},
	created(){
		this.getexcellet();
	},
	methods:{
		getexcellet(){
			Axios.get("/YearFood/good_food").then(res=>{
				console.log(res);
				this.tmps=res.data
			});
		},
		showexcellet(id){
			window.location.href="/family_myfamily/"+id;
		}
	}
}
</script>
<style scoped>
.exc-wrapper{}
.exc-title{color:#FFFFFF;font-size:0.36rem;font-weight: bold;line-height: 1rem;text-align: center;}
.exc-cont{overflow: hidden;font-size: 0;}
.exc-inner{margin-right:-0.08rem;}
.exc-item{width:50%;box-sizing:border-box;padding-right:0.08rem;display: inline-block;margin-bottom:0.08rem;}
.exc-around{box-sizing: border-box;border:0.04rem solid #3D0303;border-radius: 0.08rem;padding:0.12rem;height:3.7rem;background:#ffffff;}
.exc-img img{width:100%;height:2.28rem;border-radius: 0.06rem;}
.exc-img{margin-bottom:0.20rem;}
.exc-text{font-size:0.26rem;color:#232922;line-height:0.42rem;box-sizing: border-box;padding:0 0.11rem;height:0.84rem;overflow: hidden;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;}
.vflexcont{display:flex;flex-direction: column;}
.vflexitem{flex:1;overflow:hidden;}
</style>