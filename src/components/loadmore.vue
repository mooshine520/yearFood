<template>
<div class='loadtip' v-if='needload'>
	{{loadmsg}}
</div>
</template>
<script>
export default{
	name:'loadmore',
	data(){
		return {
			loadmsg:"正在加载中..."
		}
	},
	props:['needload','emited'],
	mounted(){
		
		this.emitload();
		window.onscroll=this.emitload;
	},
	beforeDestory(){
		/*if(this.needload){
			window.removeEventListener('scroll',this.emitload);
		}*/
	},
	methods:{
		emitload(){
			if(this.needload){
				var rect=this.$el.getBoundingClientRect();
				if((rect.top<window.innerHeight)&&!this.emited){
					this.$emit('loadother');
				}
			}
		}
	}
}
</script>
<style scoped>
.loadtip{font-size:0.3rem;text-align:center;color:#F1F1F1;line-height:0.88rem;}
</style>
<!--
	使用方法
	<LoadMore :needload='!charover' v-if='initload' :emited='isload' @loadother='getnextpage'></LoadMore>
	needload：用来判断时候已经加载完了，
	v-if：在vue-router中因为不会因为路由改变而销毁重建此组件，故用v-if来迫使其重建销毁。
	emited:用来判断是否正在加载中，如果正在加载中则不会再次触发加载数据，ajax加载完成后要设置此变量为false。
	loadother：用来接收上拉加载的事件，通过ajax来加载数据，加载前设置emited为true，加载完成后设置emited为false。
-->