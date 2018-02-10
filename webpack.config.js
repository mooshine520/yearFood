const webpack=require('webpack');
const path=require('path');
const HtmlWebpackPlugin=require('html-webpack-plugin');
const ExtractTextPlugin=require('extract-text-webpack-plugin');
var hotMiddlewareScript = 'webpack-hot-middleware/client?reload=true';

process.env.NODE_ENV='production';
//区分开发坏境和正式环境
var NODE_ENV = process.env.NODE_ENV || 'production';
var isDev = NODE_ENV === 'development';
var entry;
if(isDev){
	entry={
		'index':['./src/index.js',hotMiddlewareScript],
		'js':['./src/main.js',hotMiddlewareScript],
		'joinin':['./src/joinin.js',hotMiddlewareScript],
		'photowall':['./src/photowall.js',hotMiddlewareScript],
		'myfamily':['./src/myfamily.js',hotMiddlewareScript],
	};
}else{
	entry={
		'index':'./src/index.js',
		'js':'./src/main.js',
		'joinin':'./src/joinin.js',
		'photowall':'./src/photowall.js',
		'myfamily':'./src/myfamily.js'
	}
}

var config={
	entry:entry,
	output:{
		path:path.resolve(__dirname,'dest'),
		filename:'static/family/[name]_[hash].bundle.js',
		publicPath:'/j/detail/familydinner/'
	},
	resolve:{
		extensions:['.js','.vue','.json'],
		/*alias:{
			'vue$':'vue/dist/vue.esm.js',
			'axios$':'axios/dist/axios.min.js'
		}*/
/*		alias:{
			'jquery$':path.resolve(__dirname,'src/js/jquery-3.3.1.min.js')
		}*/
		
	},
	module:{
		rules:[
			{
				test:/\.(png|jpg|gif)$/,
				use:'file-loader?name=static/images/family_[name].[ext]'
			},
			{
				test:/\.css$/,
				use:['css-hot-loader'].concat(ExtractTextPlugin.extract({
					fallback:'style-loader',
					use:'css-loader'
				}))
			},
			{
				test:/\.html$/,
				use:{
					loader:'html-loader',
					options:{
						attrs:['img:src','image:xlink:href']
					}
				}
			},
			{
				test:/\.hbs$/,
				use:{
					loader:'handlebars-loader'
				}
			},
			
			{
				test:/\.vue$/,
				use:'vue-loader?name=static/components/[name].[ext]'
			},
			{
				test:/\.js$/,
				exclude: /(node_modules|bower_components|jquery)/,
				use:{
					loader:'babel-loader',
					options:{
						presets:[ "env", "stage-2"]
					}
				}
			}
		]
	},
	plugins:[
		new HtmlWebpackPlugin({
			template:'./src/template/index.html',
			chunks:['index'],
			inject:'body',
			filename:'family_index.html'
		}),
		new HtmlWebpackPlugin({
			template:'./src/template/joinin.html',
			chunks:['joinin'],
			filename:'family_joinin.html'
		}),
		new HtmlWebpackPlugin({
			template:'./src/template/joinin.html',
			chunks:['photowall'],
			filename:'family_photowall.html',
		}),
		new HtmlWebpackPlugin({
			template:'./src/template/myfamily.html',
			chunks:['myfamily'],
			filename:'family_myfamily.html',
		}),
		new HtmlWebpackPlugin({
			template:'./src/template/award.html',
			chunks:['index'],
			filename:'family_award.html',
			inject:'body'
		}),
		new HtmlWebpackPlugin({
			template:'./src/template/searchAward.html',
			chunks:['index'],
			filename:'family_searchAward.html',
			inject:'body'
		}),
		/*new ExtractTextPlugin('static/css/family_individual.css'),*/
		new ExtractTextPlugin({
		    filename: 'static/css/family_[name].css',
		    allChunks: true
		}),
		/*new webpack.optimize.OccurenceOrderPlugin(),*/
		new webpack.HotModuleReplacementPlugin(),
	/*	new webpack.optimize.CommonsChunkPlugin({
			name:'manifest'
		})*/
	],
	externals:{
		vue:"Vue",
		axios:"axios",
		vuex:"Vuex",
		/*"vue-router":"VueRouter"*/
		jquery:"jQuery"
	}
}

module.exports=config;