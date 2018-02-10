const webpack = require('webpack'),
	  webpackDevMiddle = require('webpack-dev-middleware'),
	  webpackHotMiddle = require('webpack-hot-middleware'),
	  webpackConfig	= require('./webpack.config.js'),
	  express = require('express');
const path=require('path');
const http=require('http');
var proxy = require('http-proxy-middleware');
//var multipart = require('connect-multiparty');
//const FormData=require('form-data');
//var multipartMiddleware = multipart({uploadDir:'./node_proxy/images'});
//var bodyParser=require('body-parser');
var fs=require('fs');

let compiler=webpack(webpackConfig);

let app=express();


app.use(webpackDevMiddle(compiler,{
	publicPath:webpackConfig.output.publicPath,
	stats: {
        colors: true
    }
}));

app.use(webpackHotMiddle(compiler));

//app.use(multipartMiddleware);

// parse application/x-www-form-urlencoded
//app.use(bodyParser.urlencoded({ extended: false }));
 
// parse application/json
//app.use(bodyParser.json());
/*app.get('/citydatas',function(req,res){
	res.sendFile('citylist.json',{root:__dirname+'/json'},err=>{
		if(err){
			console.log('请求json文件失败');
			console.log(err);
		}else{
			console.log('城市列表json文件数据已发送^_^');
		}
	});
})*/

//用来根据前台localhost/api/qq的请求路径，访问线上的m.tool.114la.com/api/qq的数据，
//本来打算，让前端页面直接访问m.tool.114la.com/api/qq的路径，在hosts文件中，将m.tool.114la.com指向127.0.0.1,然后这中间件这里通过IP访问m.tool.114la.com的主机获取数据，
//但鉴于m.tool.114la.com设置了禁止IP访问的配置，所欲采用在前端页面采用通过变量改变主机名的方法来指示是线上地址还是本地地址。
/*app.use(function(req,res,next){
	if(req.path.indexOf("/static/json")!=-1||req.path.indexOf('upload')!=-1||req.path.indexOf('upimage')!=-1){
		console.log("静态json文件");
		next();
	}else{
		let host;
		if(req.path.indexOf("/j/api/1.0/android")!=-1){
			host='114la.com';
		}else{
			host='m.tool.114la.com';
		}
		let str='';
		if(JSON.stringify(req.body)!="{}"){
			if(req.get('Content-type')=='application/x-www-form-urlencoded'){
				for(let key in req.body){
					str+=encodeURIComponent(key)+"="+encodeURIComponent(req.body[key])+"&";
				}
				str=str.substring(0,str.length-1);
			}else{
				str=JSON.stringify(req.body);
			}
		}

	let rpc=http.request("http://"+host+"/"+req.path,hres=>{
			var html='';
			hres.on('data',function(data){
				html+=data;
			});
			hres.on('end',function(data){
				res.send(html);
			});
		});
		if(JSON.stringify(req.body)!="{}"){
			rpc.write(str);
			rpc.end();
		}
	}
});*/
app.use("/YearFood",proxy({ target: 'http://m.tool.114la.com',changeOrigin: true }));
app.use("/upload",proxy({ target: 'http://imgup.114la.com',changeOrigin: true }));

/*app.post('/upload',multipartMiddleware,function(req,res,next){
	let tmp_path=req.files.uploadfile.path;

	res.send('http://'+req.host+"/upimage/"+req.files.uploadfile.path);

	let host='http://imgup.114la.com';
	let form=new FormData();
	form.append('uploadfile',req.files.uploadfile);
	let rpc=http.request(
				{
					host:host,
					path:req.path,
					method:'POST',
					headers:{
						'Content-type':req.headers['Content-type']
					}
				},hres=>{
					var html='';
					hres.on('data',function(data){
						html+=data;
					});
					hres.on('end',function(data){
						res.send(html);
					});
				}
			);
	rpc.write(form);
	rpc.end();


});*/
app.get('/upimage/:name',function(req,res){
	var filename=req.params.name;
	res.sendFile(filename,{root:__dirname+'/node_proxy/images'},err=>{
		if(err){
			console.log("请求图片失败！");
			console.log(err);
		}else{
			console.log(req.params.name+'.图片数据已经发送成功！');
		}
	});
});
/*//根据不同的名称发送不同的json文件数据。
app.use('/json/:name',function(req,res){
	var filepath=__dirname+'/json/'+req.params.name+'.json';
	var filename=req.params.name+'.json';
	if(!fs.existsSync(filepath)){
		filename='norst.json';
	}
	res.sendFile(filename,{root:__dirname+'/json'},err=>{
		if(err){
			console.log("请求json数据失败！");
			console.log(err);
		}else{
			console.log(req.params.name+'.json文件数据已经发送成功！');
		}
	});

})*/
app.get('/static/json/:name',function(req,res){
	var filepath=__dirname+'/json/'+req.params.name;
	console.log(req.params.name);
	var filename=req.params.name;
	if(!fs.existsSync(filepath)){
		filename='norst.json';
	}
	res.sendFile(filename,{root:__dirname+'/json'},err=>{
		if(err){
			console.log("请求json数据失败！");
			console.log(err);
		}else{
			console.log(req.params.name+'.json文件数据已经发送成功！');
		}
	});

})

app.listen(80,function(err){
	console.log('web Server Listen on 80 port...');
});

