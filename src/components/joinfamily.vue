<template>
<div>
	<div class='wrapper0'>
		<div :class='{"jn-photo-cont":true,"jn-photo-top":imglist.length==0}'>
			<div class='jn-photo-inner'>
				<input type='file' id='photofile' ref='upphoto'  @change='addimg($event)' @click='checkstatus($event)' accept="image/*" class='jn-photo-file'/>
				<label for='photofile' class='jn-photo-img' ref='jphoto'></label>
				<div class='jn-text'>
					还未上传图片，<a href='javascript:;' class='jn-alink' @click='upimage'>立即上传</a>
				</div>
				<div class='jn-tip'>(最多可上传6张图片)</div>
				<div :class='{"jn-img-cont":true,"jn-noimg":imglist.length==0}'>
					<div class='jn-img-inner'>
						<div v-for='(po,index) in imglist' class='jn-imgitem'>
							<div class='jn-img-content'>
								<img :src='po.preurl||po.url'/>
								<div class='jn-del' @click='delimg(index)'>&times;</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
		<div class='jn-textarea-cont'>
			<textarea v-model='jnmsg' class='jn-textarea' placeholder="请输入您的感想"></textarea>
		</div>
		<div class='jn-foragree'>
			<i :class='{"po-agree":agree,"po-noagree":!agree}' @click='toggleagree'></i>
			<a href='javascript:;'  @click='showprotocal'>同意《114啦用户协议》</a>
		</div>
		<div class='flexcont jnbtn-cont'>
			<div class='flexitem'>
				<a href='javascript:;' @click='cleandata' class='jnbtn-disabled'>取消</a>
			</div>
			<div class='jn-btn-sp'></div>
			<div class="flexitem">
				<a href='javascript:;' class="jnbtn" @click='subfamily'>{{update?"修改":"提交"}}</a>
			</div>
		</div>
	</div>
	<Excellet></Excellet>
	<Delicious></Delicious>
	<Modal  type='alert' @took='okfall' :showstate='noagree'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要同意114啦用户协议才能参加活动</div>
	</Modal>

	<Modal  type='alert' @took='okfall2' :showstate='succs'>
		<span slot='tlt'>提示</span>
		<div slot='text'>{{update?"修改活动成功!":"参与活动成功！"}}</div>
	</Modal>
	<Modal  type='alert' @took='okfall3' :showstate='uping'>
		<span slot='tlt'>提示</span>
		<div slot='text'>图片正在上传中...</div>
	</Modal>
	<Modal  type='alert' @took='okfall4' :showstate='notext'>
		<span slot='tlt'>提示</span>
		<div slot='text'>请输入您的感想</div>
	</Modal>
	<Modal  type='alert' @took='okfall6' :showstate='moreword'>
		<span slot='tlt'>提示</span>
		<div slot='text'>感想不能超过20个字</div>
	</Modal>
	<Modal  type='alert' @took='okfall5' :showstate='minoneimg'>
		<span slot='tlt'>提示</span>
		<div slot='text'>最少需要上传一张图片</div>
	</Modal>
	<Modal  type='alert' @took='okfall7' :showstate='needlogin'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要登录后才能参与</div>
	</Modal>
	<Modal  type='alert' @took='okfall8' :showstate='needapplogin'>
		<span slot='tlt'>提示</span>
		<div slot='text'>需要在114啦APP中登录后才能参与</div>
	</Modal>
	<Modal  type='alert' @took='okfall9' :showstate='maximg'>
		<span slot='tlt'>提示</span>
		<div slot='text'>最多只能上传6张图片</div>
	</Modal>
	<div class='proto-win' v-show='protocal'>
		<div class='proto-content'>
			<div class='proto-cls' @click='hideprotocal'>&times;</div>
			<div class='proto-words'>
				<h3>参与技巧：【什么能发？什么不能发！】</h3>
		        <p>1、过年团圆饭、地方特色年夜饭、创意年夜饭来者不拒</p>
		        <p>2、年夜饭做法，吃法，吃饭全家福，饭桌搞怪拍都欢迎</p>
		        <p>3、单图就要美观，最好色香味全，带上家人才更有味道</p>
		        <p>4、最多6图轮播，可以自行拼图，你家的创意你说了算</p>
		        <p>5、图文必须与主题相关，违规即刻删除，取消参与资格</p>
		        <h3>114啦服务协议：</h3>
		        <p>1、用户接受并承诺遵守我司（114啦平台）已经发布以及即将发布的有关规则与政策。</p>
		        <p>2、用户应对其上传的内容（包括但不限于图片、文字）的合法性负责，不得违反我国现行法律法规，如我司因用户提供的内容的权利瑕疵而侵犯任何第三方的合法权益(包括但不限于侵犯第三方的商标权、著作权或者其他人身、财产权利)而导致任何争议、投诉、索赔、诉讼等，等而发生纠纷的，用户除应积极予以解决外，还应承担我司因此而遭受的所有损失。</p>
		        <p>3、用户知悉、理解并同意授权我司为实现本活动之目的完全免费、可转授权地使用用户发布的内容；用户进一步同意：为便于内容的展示和推广，甲方同意乙方可以在合理范围内对甲方推动的内容进行编辑和修改。</p>
			</div>
		</div>
	</div>
	<!-- <div ref='printwin' class='printpanel'></div> -->
	<div class='footwin'>
		<div class='foot-item' @click='mywantjoin'>首页</div>
		<div class='foot-item' @click='back'>顶部</div>
	</div>
</div>
</template>
<script>
import Excellet from './excellet'
import Delicious from './delicious'
import Axios from 'axios'
import Modal from './modal'
import $ from 'jquery'
import { checkAPPAndLogin } from './../js/check.js'

/*var param = function(obj) {
var query = '',
    name, value, fullSubName, subName, subValue, innerObj, i;

for (name in obj) {
    value = obj[name];

    if (value instanceof Array) {
        for (i = 0; i < value.length; ++i) {
            subValue = value[i];
            fullSubName = name + '[' + i + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
        }
    } else if (value instanceof Object) {
        for (subName in value) {
            subValue = value[subName];
            fullSubName = name + '[' + subName + ']';
            innerObj = {};
            innerObj[fullSubName] = subValue;
            query += param(innerObj) + '&';
        }
    } else if (value !== undefined && value !== null)
        query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
}

return query.length ? query.substr(0, query.length - 1) : query;
};
Axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
Axios.defaults.transformRequest=[function(data,headers){ 
return  typeof data=="object" ? param(data) : data;
}];*/

export default{
	name:'joinfamily',
	data(){
		return {
			jnmsg:'',
			imglist:[],
			agree:false,
			tomoreimg:false,
			upconfig:null,
			noagree:false,
			succs:false,
			uping:false,
			notext:false,
			protocal:false,
			minoneimg:false,
			workid:null,
			moreword:false,
			needlogin:false,
			needapplogin:false,
			maximg:false,
			update:false,
		}
	},
	components:{
		Excellet,
		Delicious,
		Modal
	},
	created(){
		//window.usertoken={token:"a492QhZJ6CBMSkfjZz9fkHKg8n0vwWAme5SxSmejnYWMM2Yg+sBB05rvZMAi+fTl4w"};
		//alert(window.usertoken.token);
		//console.log(encodeURIComponent("a492QhZJ6CBMSkfjZz9fkHKg8n0vwWAme5SxSmejnYWMM2Yg+sBB05rvZMAi+fTl4w"));
		//alert(encodeURIComponent(usertoken.token));
		//window.usertoken={token:"a492QhZJ6CBMSkfjZz9fkHKg8n0vwWAme5SxSmejnYWMM2Yg+sBB05rvZMAi+fTl4w"};
		checkAPPAndLogin();
		if(window.usertoken){
			$.post("/YearFood/get_user",{token:encodeURIComponent(usertoken.token)},res=>{
				if(res.user_id!=null&&res.user_id!=""){
					
					window.userinfo=res;
					this.getUpUrl();
					this.getFamily();
					//alert(JSON.stringify(window.userinfo));
				}else{
					alert("随机userinfo");
					window.userinfo={user_id:Math.floor(Math.random()*10)+''+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+'',tel:'1568854'+Math.floor(Math.random()*10)+Math.floor(Math.random()*10)+''};
				}
				//console.log(window.userinfo);
				
			},"json");
		}

	},
	mounted(){
		//this.print(JSON.stringify(usertoken.token));
	},
	methods:{
		print(msg){
			/*let dom=this.$refs.printwin;
			let div=document.createElement("div");
			div.innerHTML=msg;
			console.log(dom);
			dom.appendChild(div);
			dom.scrollTop=dom.scrollHeight-dom.clientHeight;*/
		},
		upimage(){
			this.$refs.jphoto.click();
		},
		toggleagree(){
			this.agree=!this.agree;
		},
		showprotocal(){
			this.protocal=true;
		},
		hideprotocal(){
			this.protocal=false;
		},
		checkstatus(evt){
			let key=checkAPPAndLogin();
			if(key==-1){
				this.needlogin=true;
				evt.preventDefault();
			}
			if(key==-2){
				this.needapplogin=true;
				evt.preventDefault();
			}
			if(this.imglist.length==6){
				this.maximg=true;
				evt.preventDefault();
			}
		},
		okfall9(){
			this.maximg=false;
		},
		addimg(evt){
			if(!this.upconfig){
				this.$refs.upphoto.value="";
				alert("获取上传路径失败");
				return ;
			}
			let files=evt.target.files;
			let th=this;
			if(files.length){
		    	if(this.imglist.length==6){
		    		this.tomoreimg=true;
		    	}else{
		    		let arr=Array.from(files);

		    		this.previewimg(arr);
		    	}  
		    }
		},
		previewimg(arr){
			  if(arr.length==0){
			  	return ;
			  }
			  let file=arr.shift();
			  var reader=new FileReader();
			  let th=this;
	          reader.onload=function(event){
	            let obj={preurl:reader.result,done:false};
	            th.imglist.push(obj);
	            th.transferimage(file,th.imglist.length-1);
	            if(th.imglist.length>=6){
	            	this.tomoreimg=true;
	            }else{
	            	th.previewimg(arr);
	            }

	          }
	         reader.readAsDataURL(file);
		},
		transferimage(file,index){
				let fm=new FormData();
				fm.append('uploadfile',file);
				Axios({
					method:'post',
					url:this.upconfig.url,
					headers:{
						'Content-Type':'multipart/form-data'
					},
					data:fm
				}).then(res=>{
					let tmp=this.imglist[index];
					tmp.url=res.data.data.thumb_url;
					//tmp.url=res.data;
					tmp.done=true;
					this.imglist.splice(index,1,tmp);
				});
			
		},
		delimg(index){
			let key=checkAPPAndLogin();
			if(key==-1){
				this.needlogin=true;
				return ;
			}
			if(key==-2){
				this.needapplogin=true;
				return ;
			}
			this.imglist.splice(index,1);
		},
		getUpUrl(){
			if(window.userinfo&&window.userinfo.user_id){
				Axios.get("/YearFood/getUploadConfig/"+window.userinfo.user_id).then(res=>{
					this.upconfig=res.data;
					//console.log(this.upconfig);
				})
			}
		},
		getFamily(){
			//alert(window.userinfo.tel);
			if(window.userinfo&&window.userinfo.tel){
				Axios.get("/YearFood/search/"+window.userinfo.tel+"/1").then(res=>{
					if(res.data.content&&res.data.content.length>=1){
						let content=res.data.content[0];
						this.jnmsg=content.content;
						this.agree=true;
						for(let i=0;i<content.img_path.length;i++){
							let tmp={url:content.img_path[i],done:true};
							this.imglist.push(tmp);
						}
						this.update=true;
						this.workid=content.id;
					}
				});
			}
		},
		cleandata(){
			this.imglist=[];
			this.jnmsg='';
			this.agree=false;
		},
		//提交家庭照片
		subfamily(){
			let key=checkAPPAndLogin();
			if(key==-1){
				this.needlogin=true;
				return ;
			}
			if(key==-2){
				this.needapplogin=true;
				return ;
			}
			let uped=true;
			this.imglist.forEach(item=>{
				if(!item.done){
					uped=false;
					return ;
				}
			});
			if(!uped){
				this.uping=true;
				return ;
			}
			if(this.jnmsg.replace(/\s+/,"")==""){
				this.notext=true;
				return ;
			}
			if(this.jnmsg.length>20){
				this.moreword=true;
				return ;
			}
			if(this.agree){
				let imgs=[];
				this.imglist.forEach(item=>{
					if(item.done){
						imgs.push(item.url);
					}
				});
				if(imgs.length==0){
					this.minoneimg=true;
					return ;
				}
				if(this.update){
					let params={"id":this.workid,"img_path":imgs.join(","),'content':this.jnmsg};
					$.post('/YearFood/update',params,res=>{
						if(res.status==1){
							this.succs=true;
						}else if(res.status==2){
							alert("缺少参数");
						}else{
							alert("提交失败");
						}
					},"json");

				}else{
					let params={"user_id":userinfo.user_id,"img_path":imgs.join(","),tel:userinfo.tel,'content':this.jnmsg};
					$.post('/YearFood/insert',params,res=>{
						if(res.status==1){
							this.succs=true;
							this.workid=res.content;
						}else if(res.status==2){
							alert("缺少参数");
						}else if(res.status==4){
							alert("此用户已经提交过");
						}else{
							alert("提交失败");
						}
					},"json");
				}
			}else{
				this.noagree=true;
			}
		},
		okfall(){
			this.noagree=false;
		},
		okfall2(){
			this.succs=false;
			window.location.href='family_myfamily/'+this.workid;
		},
		okfall3(){
			this.uping=false;
		},
		okfall4(){
			this.notext=false;
		},
		okfall5(){
			this.minoneimg=false;
		},
		okfall6(){
			this.moreword=false;
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
		okfall7(){
			this.needlogin=false;
			if(Js114la.handle114laClientLogin){
                   window.Js114la.handle114laClientLogin();
              }
		},
		okfall8(){
			this.needapplogin=false;
			setTimeout(()=>{
				window.location.href='http://www.114la.com/app/114la/index.html';
			},800);
		}
	}
}
</script>
<style>
.proto-win{position:fixed;z-index: 200;left:0;right:0;bottom:0;top:0;background:rgba(0,0,0,0,.6);color:#FFFFFF;white-space:nowrap;overflow: hidden;}
.proto-win:after{content:"";display:inline-block;width:0;height:100%;vertical-align: middle;}
.proto-content{margin:0 0.18rem;display:inline-block;vertical-align: middle;box-sizing:border-box;padding:0.45rem 0.3rem;background:#ffffff;color:#303030;font-size:0.3rem;position:relative;height:80%;overflow:hidden;white-space: normal;border-radius: 0.3rem;}
.proto-cls{position:absolute;right:0.2rem;top:0.2rem;font-size:0.35rem;color:#202020;font-weight:bolder;width:0.4rem;height:0.4rem;text-align:center;line-height:0.4rem;}
.proto-words{height:100%;overflow: auto;}
.printpanel{position:fixed;z-index: 20000;right:0;left:0;bottom:0;height:120px;line-height:20px;font-size:13px;color:red;background:rgba(0,0,0,0.5);overflow: auto;}
</style>