import $ from 'jquery'
var util = {
	/*根据有效范围获得有效的字体大小*/
	calcFontSize: function(standardId){
		var clientWidth ;
		if(standardId){
			clientWidth = document.getElementById(standardId).clientWidth;
		}else{
			clientWidth = document.getElementById( "standardSize" ).clientWidth;
		}
		document.getElementsByTagName("html")[0].style.fontSize = clientWidth / 750 * 24 + "px";
	},
	init : function( standardId ){
		var _this = this;

		_this.calcFontSize(standardId);
	}
};
var nianyefan = {
	homePage : {
		//调节section2的宽度
		changeSection2Width : function(){
			$( ".section2 svg" ).width( $( ".fullPage" ).width() );
		},
		init : function(){
			var _this = this;
			_this.changeSection2Width();
			$(window).resize( function(){
				_this.changeSection2Width();
			} );
			$(window).on("orientationchange",function(){
				_this.changeSection2Width();
			});
		}
	},
	awardPage : {
		calcPosition : function(){//750*1206
			var clientWidth , clientHeight;
			var picWidth,picHeight;
			var specialAwardPosition , commonAwardPosition , searchBtnPosition;
			clientWidth = document.body.clientWidth;
			clientHeight = document.body.clientHeight;
			if( clientWidth/clientHeight < 1){
				if( clientWidth/clientHeight < 0.63){//以图片的宽为标准
					picHeight = clientWidth / ( 750 /1206 );
					specialAwardPosition = ( (clientHeight - picHeight) / 2 ) + ( 0.1658 * picHeight) ;
					commonAwardPosition = ( (clientHeight - picHeight) / 2 ) + ( 0.655 * picHeight) ;
					searchBtnPosition = ( (clientHeight - picHeight) / 2 ) + ( 0.854 * picHeight) ;
					$(".specialAward").css( "top" , specialAwardPosition + "px");
					$(".commonAward").css( "top" , commonAwardPosition + "px");
					// $(".searchBtn").css( "bottom" , ((clientHeight - picHeight) / 2 + ( 0.0427 * picHeight ) ) + "px");
					$(".searchBtn").css( "top" , searchBtnPosition + "px");
				}else{
					//重新计算字体
					picHeight = clientHeight;
					picWidth = picHeight * ( 750 / 1206 );
					$( "html" ).css( "font-size" , ( picWidth / 750 * 24 ) + "px");
				}
			}
		},
		num: 0,
		top: 0,
		group: 0,
		slide: function( ){
			var _this = this;
			var css ;
			css = {
				"top" : nianyefan.awardPage.top+"rem"
			};
			$(".slide").animate( css , 1000 , function (){
				var top = nianyefan.awardPage.top;
				if( top > -(2 * nianyefan.awardPage.num)){
					nianyefan.awardPage.top -= ( 2 * _this.group );
					setTimeout(function(){
						nianyefan.awardPage.slide();
					},2000);
				}else{
					$(".slide").css("top","0")
					nianyefan.awardPage.top = 0;
					nianyefan.awardPage.slide();
				}
			});
		},
		transArrayToFormateStr: function(arr,formate){
			var i , n = arr.length;
			var result = "";
			for( i = 0 ; i < n ; i++){
				result += formate.replace(/\{formate\}/g , arr[i]);
			}
			return result
		},
		insertInfo: function(data){
			var _this = this;
			var speicalAward , commonAward;
			var commonAwardStr
			speicalAward = data.speicalAward;
			commonAward = data.commonAward;
			$(".specialAward ul").text(
				"<li>一等奖：用户"+speicalAward[0]+"</li>"
				+"<li>二等奖：用户"+speicalAward[1]+"</li>"
				+"<li>三等奖：用户"+speicalAward[2]+"</li>"
			);
			commonAwardStr = _this.transArrayToFormateStr(commonAward,"<li>恭喜用户{formate}，获得20元糯米券</li>")
							+ _this.transArrayToFormateStr(commonAward.slice(96,100),"<li>恭喜用户{formate}，获得20元糯米券</li>");
			$(".slide").text(commonAwardStr);
		},
		init : function (){
			var _this = this;

			//计算文字大小
			util.calcFontSize();
			$(window).resize(function(){
				util.calcFontSize();
				_this.calcPosition();
			});
			window.addEventListener("orientationchange",function(){
				window.location.reload();
			},false);
			//计算文字位置
			_this.calcPosition();

			//slide的动画效果
			_this.group = 4;
			_this.num = 16;
			_this.slide();
			$(".commonAward").height( (2 * 4) + "rem" );

			//获得获奖信息
			// $.ajax({
			// 	 url: "",
			// 	 dataType: "json",
			// 	 success: function(data,status){
			// 		status=data.status;
			// 		if(status != 1){
			// 			alert(data.info);
			// 		}else{
			// 			_this.insertInfo(data);
			// 		}
			// 	 },
			// 	 error: function(data,status,e){
			// 		 alert("网络开小差了呢~");
			// 	 }
			//  });
		}
	},
	searchAwardPage : {
		init : function(){
			util.calcFontSize();
			$(window).resize(function(){
				util.calcFontSize();
			});
			$(window).on("orientationchange",function(){
				util.calcFontSize();
			});
		}
	}
};
export default{
	util:util,
	nianyefan:nianyefan
}
