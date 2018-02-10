<template>
<div v-show='show' class='m-picker-bg' @touchstart.stop.prevent >
	<div class='m-picker-cont' @touchstart.stop.prevent>
		<div class='m-pick-title'><a href='javascript:;'  @touchstart.stop @click='cancel'  class='m-pick-btn'>取消</a><div class='m-pick-title-text'>{{tlt==undefined?"选择器":tlt}}</div><a href='javascript:;'  @touchstart.stop @click='confirmcheck' class='m-pick-btn'>确定</a></div>
		<div class='m-pick-content'>
			<template v-for='(dt,idx) in pdata'>
				<div class='m-pick-column'  :ref='"column"+idx' :index='idx' >
					<div class='m-pick-column-inner' :style='{marginTop:-lineht/2+"px"}'>
					<div class='m-pick-item' :style='{height:lineht+"px",lineHeight:lineht+"px"}'  v-for='ty in dt.datas' >{{ty.text}}</div>
					</div>
				</div>
				<div class='m-pick-label' v-if='dt.label&&dt.label!=""'>{{dt.label}}</div>
			</template>
			<div class='m-pick-bor' :style='{height:(lineht-2)+"px",marginTop:-lineht/2+"px"}'></div>
		</div>
	</div>
</div>
</template>
<script>
const touch=!!(("ontouchstart" in window) 
            || window.navigator && window.navigator.msPointerEnabled && window.MSGesture 
            || window.DocumentTouch && document instanceof DocumentTouch);
const touchstart=touch?'touchstart':'mousedown',
      touchmove=touch?'touchmove':'mousemove',
      touchend=touch?'touchend':'mouseup';
let target=null;
let index=0;
export default{
	name:'picker-back',
	props:['show','pdata','multiindex','indexs','tlt','type'],
	data(){
		return {
			index:1,
			finger:{starty:0,endy:0,lasttime:0,starttime:0,transformy:0,order:0},
			lineht:36,
			//记录当前的选中项
			checks:[]
		};
	},
	created(){
		if(this.indexs){
			//如果this.checks=this.indexs,那么checks和indexs引用的将会是同一个地址的数组
			//组件内修改checks也就修改了父组件的indexs，违反了vue的单项数据流，
			//所以通过concat生成一个新的数组。
			this.checks=this.indexs.concat([]);
		}else{
			for(let i=0;i<this.pdata.length;i++){
				this.checks[i]=0;
			}
		}
		if(this.pdata.length>=1){
			for(let i=0;i<this.pdata.length;i++){
				//除了第一列外，其他列的数据都监听，发生改变时，及时修改选中值
				this.$watch(function(){
					return this.pdata[i].datas;
				},(nval,oval)=>{
					let flag=false;
					if(i==0){
						this.checks[i]=0;
						flag=true;
					}else if(this.checks[i]>nval.length-1){
						this.checks.splice(i,1,nval.length-1);
						flag=true;
					}
					if(flag){
						let y=-this.checks[i]*this.lineht;
						let dom=this.$refs["column"+i][0];
						dom.style.transform="translateY("+y+"px)";
						
						
					}
				});
			}
		}
		if(this.indexs){
			this.$watch(function(){
				return this.indexs;
			},(nval,oval)=>{
				for(let i=0;i<nval.length;i++){
					this.checks[i]=nval[i];
					let y=-this.checks[i]*this.lineht;
					let dom=this.$refs["column"+i][0];
					dom.style.transform="translateY("+y+"px)";
				}
			});
			//indexs不是必填属性，所以要判断
			this.$watch('show',(nval,oval)=>{
				//判断nval，只在显示的时候才做处理。
				if(nval){
					let arr=this.indexs;
					for(let i=0;i<arr.length;i++){
							this.checks[i]=arr[i];
							let y=-this.checks[i]*this.lineht;
							let dom=this.$refs["column"+i][0];
							dom.style.transform="translateY("+y+"px)";
					}
				}
			});
		}
		
	},

	methods:{
		cancel(){
			this.$emit('cancel');
		},
		touchstart(evt){
			evt.preventDefault();
			evt.stopPropagation();
			this.finger.endy=this.finger.starty=evt.touches[0].clientY;
			this.finger.starttime=(new Date()).getTime();
			target=this.getBaseDom(evt.target);
			index=target.getAttribute('index');
			this.finger.order=-this.checks[index]*this.lineht;
			target.style.transition="none";
		},
		touchmove(evt){
			evt.preventDefault();
			evt.stopPropagation();
			this.finger.endy=evt.touches[0].clientY;
			let cy=this.finger.endy-this.finger.starty;
			target.style.transform='translateY('+(cy+this.finger.order)+'px)';

		},
		touchend(evt){
			this.finger.endtime=(new Date()).getTime();
			let usetime=this.finger.endtime-this.finger.starttime;
			let move=this.finger.endy-this.finger.starty;

			if(usetime<300){
				let v=move/usetime;
				let a=1.8;
				let t=v/a;
				let s=v*t-(a*t*t)/2;
				this.finger.endy+=s;
				
			}
			let cy=this.finger.endy-this.finger.starty+this.finger.order;
				if(cy>0){
					cy=0;
				}
				if(cy<-this.lineht*(this.pdata[index].datas.length-1)){
					cy=-this.lineht*(this.pdata[index].datas.length-1);
				}
				//round是四舍五入，floor是下舍入
				let num=Math.round(cy/this.lineht);
				//把具体拖动距离还层分格的距离
				cy=num*this.lineht;
				let bcy=Math.abs(cy-(this.finger.endy-this.finger.starty+this.finger.order));

				target.style.transition="transform "+parseInt(bcy*2)+"ms cubic-bezier(0.18, 0.94, 0.32, 0.96)";
				
				
				//改变选项的时候发送change事件。
				target.removeEventListener("transitionend",this.emitchange);
				target.addEventListener("transitionend",this.emitchange);
				setTimeout(()=>{
					this.checks[index]=-num;
					target.style.transform="translateY("+(cy)+"px)"
				},50);

		},
		//获取最外层的列div
		getBaseDom(div){
			if(div.classList.contains('m-pick-column')){
				return div;
			}else{
				return this.getBaseDom(div.parentElement);
			}
		},
		confirmcheck(){
			this.$emit("confirm",this.checks);
		},
		emitchange(){
			this.$emit("change",{index:index,checks:this.checks});
		}
	},
	computed:{

	},
	mounted(){
		let doms=this.$el.getElementsByClassName('m-pick-column');
		for(let i=0;i<doms.length;i++){
			doms[i].addEventListener(touchstart,this.touchstart);
			doms[i].addEventListener(touchmove,this.touchmove);
			doms[i].addEventListener(touchend,this.touchend);
			//根据初始值，设置位置。
			let y=-this.checks[i]*this.lineht;
			doms[i].style.transform="translateY("+y+"px)";
		}

	}
}
</script>
<style>
.m-picker-bg{position:fixed;z-index: 10;left:0;top:0;right:0;bottom:0;background:rgba(0,0,0,0.4);}
.m-picker-cont{position:absolute;bottom:0;left:0;right:0;background:#fff;}
.m-pick-title{line-height:36px;font-size:14px;text-align:center;position:relative;display:flex;box-sizing: border-box;padding:0 8px;border-bottom:1px solid #f1f1f1;}
.m-pick-title-text{flex:1;}
.m-pick-btn{text-decoration: none;color:#488BF1;padding:0 1em;display:inline-block;}
.m-pick-content{margin:8px;height:225px;overflow: hidden;position:relative;display:flex;-webkit-mask:-webkit-linear-gradient(bottom,rgba(36,142,36,0),#debb47 50%,rgba(36,142,36,0));}
.m-pick-column{font-size:15px;text-align:center;height:100%;position:relative;flex:1;}
.m-pick-bor{width:100%;position:absolute;z-index: 2;left:0;right:0;border-top:1px solid #adb0a7;border-bottom:1px solid #adb0a7;top:50%;pointer-events: none;}
.m-pick-column-inner{position:absolute;z-index: 2;left:0;right:0;top:50%;overflow:hidden;}
.m-pick-item{}
.m-pick-label{height:100%;width:1em;overflow: hidden;white-space:nowrap;}
.m-pick-label:after{content:"";display:inline-block;width:0;height:100%;vertical-align:middle;font-weight: bolder;}
</style>