<template>
<div style='display:inline-block;'>
	<div class='prompt-wrapper'>
		<i class='prompt-icon' @click='msgflagshow' ref='icon'></i>
	</div>
	<div class='prompt-bg' v-show='msgflag'>
	</div>
	<div class='prompt-alert' v-show='msgflag' ref='alert'>
		<div class='triangle' ref='tri'></div>
		<div class='prompt-cont'>
			<div class='prompt-inner'>
				<div class='prompt-cls' @click='hidemsg'>&times;</div>
				<div class='prompt-title'>{{tips.title}}</div>
				<div v-html='tips.text'></div>
			</div>
		</div>
	</div>
</div>	
</template>
<script>
export default{
	name:'prompt',
	props:['tips'],
	data(){
		return {
			msgflag:false
		}
	},
	methods:{
		msgflagshow(){
			this.msgflag=true;
			var icon=this.$refs.icon;
			var div=this.$refs.alert;
			var tri=this.$refs.tri;
			var rect=icon.getBoundingClientRect();
			var basew=rect.right-rect.left;
		    var baseh=rect.bottom-rect.top;

		    //得到滚动条的位置。
		    var scrollTop=document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop;
		    var scrollLeft=document.documentElement.scrollLeft||window.pageXOffset||document.body.scrollLeft;

		    var center={x:rect.left+basew/2,y:rect.top+baseh/2};

		    var top=rect.bottom+scrollTop;
		    div.style.cssText="top:"+top+"px;";

		    var left=rect.left;
		    tri.style.left=left+"px";

		},
		hidemsg(){
			this.msgflag=false;
		}

	}
}
</script>
<style>
.prompt-icon{display:inline-block;width:0.64rem;height:0.64rem;background:url(./../images/btn_description.png) center no-repeat; background-size:100% 100%;vertical-align: top;}
.prompt-wrapper{display:inline-block;vertical-align: middle;}
.prompt-bg{position:fixed;z-index: 5;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.3);}
.prompt-alert{position:absolute;z-index: 20;font-size:0.25rem;color:#666;text-align:center;left:0;right:0;white-space: normal;}
.triangle{position:absolute;z-index: 21;width:0;height:0;border-width:0.32rem;border-style:solid;border-color: transparent transparent #FFFFFF transparent;top:-0.32rem;}
.prompt-inner{background:#fff;box-sizing:border-box;padding:0.2rem;line-height:1.5;text-align:left;position:relative;}
.prompt-cont{padding-top:0.32rem;padding-left:0.5rem;padding-right:0.4rem;}
.prompt-title{font-weight:bold;height:0.3rem;line-height:0.3rem;}
.prompt-cls{position:absolute;z-index: 2;width:0.5rem;height:0.5rem;line-height:0.5rem;text-align:center;font-size:0.4rem;color:#488BF1;right:0.03rem;top:0.03rem;}
</style>