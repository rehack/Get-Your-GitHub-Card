/*
 * @author rccoder
 * @email rccoder@foxmail.com
 * @github github.com/rccoder/GitHub-Card.git
 */

 //创建一个闭包
(function($) {

	//简单的模板渲染引擎
	function render(tpl, data) {
		if(!tpl || !data) {
			return '';
		} else {
			var content = '';
			for(var attr in data) {
				var value = data[attr];
				tpl = tpl.replace(new RegExp("{{"+attr+"}}", "gm"), value);
			}
			return tpl;
		}
	}

	function getUserInfo(username, callback) {
		$.ajax({
			url: 'https://api.github.com/users/' + username,
			method: 'get',
			dataType: 'jsonp'
		}).done(function(msg) {
			if(msg && msg.meta && msg.meta.status == 200) {
				if(msg.data.avatar_url) {
					msg.data.avatar_url = msg.data.avatar_url.replace(/v=.*/g, 'v=3&s=80');

				}
				var userdata = msg.data;
				callback(null, userdata);
			}
			else {
				var userdata = '';
				callback(404);
			}
		})
	};

	function createBox($content, username) {
		if(!username) return;
		$content.html('这里放置DOM');
		getUserInfo(username, function(err, userdata) {
			//加载之后的新DOM
			var newDom;
			if(err) {
				newDom = 'Loading Failed!';
			} else {
				newDom = render(htmlTemplate, userdata);
				console.log(userdata);
			}
			//加载新DOM
			$content.html(newDom);
		});
	}

	//定义插件
	$.fn.github_card = function() {
		return $(this).each(function() {
			var $content = $(this);
			//获得date-username的值作为用户名
			var username = $content.data('username');
			//创建box
			createBox($content, username);
		})
	}
	//html模板
	var htmlTemplate = '<html><head><link rel="stylesheet"href="./style.css"></head><div id="github-card"data-username="rccoder"><div class="box"><div class="avatar"><img src="{{avatar_url}}"alt="{{login}}"></div><div class="username"><p>{{login}}</p><p>{{name}}</p></div><div class="stats"><a href="{{followers_url}}"class="stats-vcard"><strong>{{followers}}</strong><span>Followers</span></a><a href="#"class="stats-vcard"><strong>{{public_repos}}</strong><span>Repos</span></a><a href="{{following_url}}"class="stats-vcard"><strong>{{following}}</strong><span>Following</span></a></div><ul class="details"><li class="detail-list">{{company}}</li><li class="detail-list">{{location}}</li><li class="detail-list"><a href="mailto:{{email}}">{{email}}</a></li><li class="detail-list"><a href="{{blog}}">{{blog}}</a></li><li class="detail-list">{{created_at}}</li></ul></div></div></html>';
	//样式css
	var cssTemplate = '<style>body{background-color:#434343}a{text-decoration:none}li{list-style:none}#github-card .box{position:absolute;background-color:#fff;padding-bottom:20px;width:260px;left:40%;border-radius:1px;border-color:#fff;font:13px/1.4 Helvetica,arial,nimbussansl,liberationsans,freesans,clean,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";color:#333}#github-card .box .avatar img{display:block;width:38%;border-radius:100%;margin-left:33%;margin-top:20px}#github-card .box .username p{text-align:center;font-size:1.3em;font-weight:700;height:1%}#github-card .box .username{padding-bottom:10px}#github-card .box .stats{padding:10px 20px 56px;border:1px solid #eee}#github-card .box .stats .stats-vcard{float:left;text-align:center;width:33.333%;font-size:1em;text-transform:capitalize}#github-card .box .stats .stats-vcard strong{display:block;font-size:28px;font-weight:700;line-height:1;color:#4078c0}#github-card .box .stats .stats-vcard span{color:#434343}#github-card .box .details .detail-list{padding-top:.7em}</style>';

	//页面加载
	$(function() {
		//添加css
		$('head').append(cssTemplate);
		setTimeout(function() {
			//调用定义的插件函数
			$('#github-card').github_card();
		})
	})
//闭包结束
})(jQuery);

