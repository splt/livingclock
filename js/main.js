

// http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// http://my.opera.com/emoller/blog/2011/12/20/requestanimationframe-for-smart-er-animating
 
// requestAnimationFrame polyfill by Erik MÃ¶ller
// fixes from Paul Irish and Tino Zijdel
 
(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];

    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }
 
    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = new Date().getTime();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };
 
    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());

		var restartDiff = +new Date();
		var inited = false;
		var audio = false;
		var embedded = location.search == '?embed';
		var thanks = location.hash == '#thankyou';

		var $ = function(id){return document.getElementById(id);};
		var iOS = ( navigator.userAgent.match(/(iPad|iPhone|iPod)/i) ? true : false );

		var createCookie = function(name,value,days) {
			if (days) {
				var date = new Date();
				date.setTime(date.getTime()+(days*24*60*60*1000));
				var expires = "; expires="+date.toGMTString();
			}
			else var expires = "";
			document.cookie = name+"="+value+expires+"; path=/";
		},
		readCookie = function(name) {
			var nameEQ = name + "=";
			var ca = document.cookie.split(';');
			for(var i=0;i < ca.length;i++) {
				var c = ca[i];
				while (c.charAt(0)==' ') c = c.substring(1,c.length);
				if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
			}
			return null;
		},
		eraseCookie = function(name) {
			createCookie(name,"",-1);
		},
		getWindowHeight = function() {
			var windowHeight = 0;
			if (typeof(window.innerHeight) == 'number') {
				windowHeight = window.innerHeight;
			}
			else {
				if (document.documentElement && document.documentElement.clientHeight) {
					windowHeight = document.documentElement.clientHeight;
				}
				else {
					if (document.body && document.body.clientHeight) {
						windowHeight = document.body.clientHeight;
					}
				}
			}
			return windowHeight;
		},
		getWindowWidth = function() {
			var windowWidth = 0;
			if (typeof(window.innerWidth) == 'number') {
				windowWidth = window.innerWidth;
			}
			else {
				if (document.documentElement && document.documentElement.clientWidth) {
					windowWidth = document.documentElement.clientWidth;
				}
				else {
					if (document.body && document.body.clientWidth) {
						windowWidth = document.body.clientWidth;
					}
				}
			}
			return windowWidth;
		},
		setContent = function() {
			var windowHeight = getWindowHeight();
			if (windowHeight > 0) {
				var contentElement = document.getElementById('content');
				var contentHeight = contentElement.offsetHeight;

				// if (windowHeight - contentHeight > 0) {
				// 	contentElement.style.position = 'relative';
				// 	contentElement.style.top = ((windowHeight / 2) - (contentHeight / 2) -150) + 'px';
				// }
				// else {
					contentElement.style.position = 'static';
					var xOffset = ( window.innerWidth < 740 ? getWindowWidth()/2 : 0);
					//console.log(window.innerWidth, contentElement, xOffset);
					contentElement.style.margin = '0px 0px 0px -'+(xOffset)+'px';
				//}

				var yRatio = windowHeight/contentHeight;
				if(yRatio < 1 && !iOS){
					console.log('cT: ', windowHeight, contentHeight, yRatio);
					var yOffset = ((contentHeight * yRatio) / 2);
					contentElement.style.webkitTransform = 'scale('+yRatio+')';
					contentElement.style.mozTransform = 'scale('+yRatio+')';
					contentElement.style.oTransform = 'scale('+yRatio+')';
					contentElement.style.transform = 'scale('+yRatio+')';
				}else if(iOS){
					contentElement.style.webkitTransform = 'scale(0.5) translate3d('+xOffset+'px, 100px,0)';
					$('embed').className = 'kill';
				}else{
					contentElement.style.webkitTransform = 'scale(1)';
					contentElement.style.mozTransform = 'scale(1)';
					contentElement.style.oTransform = 'scale(1)';
					contentElement.style.transform = 'scale(1)';
					contentElement.style.marginTop = ((windowHeight / 2) - (contentHeight / 2) ) + 'px';
				}

				// var windowWidth = getWindowWidth();
				// var contentWidth = contentElement.offsetWidth;

				// var xRatio = contentWidth/windowWidth;
				// if(xRatio < 1){
				// 	console.log('xScale', xRatio);
				// 	var xOffset = 0;
				// 	contentElement.style.webkitTransform = 'scale('+xRatio+')';
				// }else{
				// 	contentElement.style.webkitTransform = 'scale(1)';
				// 	contentElement.style.marginTop = '0px';
				// }

			}
		},
		loadTo = function(start, end){
			for(var p=start; p<=end; p++){
				var psid = 'ps-'+p.toString();
				if($(psid)){
					$(psid).className = 'presquare hide';
				}
			}
		},
		preload = function(cb){
			var imgs = [
				'Clock_1076.png',
				'final/idle.png',
				'final/cape.png',
				'final/pockets.png',
				'final/short_skirt_v2.png',
				'final/yellow_pant.png'];
			var audio = ['Footstep_v8.mp3'];
			var loaded = [];
			var percentage = 0;
			var p = 1;
			var frames = 24;
			var lastFrame = 0;
			var $ll = $('left-line');
			$rl = $('right-line'),
			$ss = $('starting-sec'),
			$sm = $('starting-minute'),
			$shr = $('starting-hour');

			setContent();

			if(thanks){
				$('email-thankyou').className = 'show';
			}

			for(var i=0; i<=imgs.length-1; i++){

				var img = new Image();
				img.onload = function(){
					loaded.push(imgs[i]);
					percentage = loaded.length/imgs.length * 100;

					var curFrame = Math.floor(( percentage / 100 ) * frames);
					loadTo(lastFrame, curFrame);
					lastFrame = curFrame;

					if(percentage == 100){
						$('ps-24').addEventListener('webkitTransitionEnd', cb);
						$('ps-24').addEventListener('mozTransitionEnd', cb);
						$('ps-24').addEventListener('oTransitionEnd', cb);
						$('ps-24').addEventListener('transitionEnd', cb);
						setTimeout(function(){if(!inited){cb();}},3400);
						startClock($ss, $sm, $shr);
					}

					$ll.style.width = percentage+'%'; 
					$rl.style.width = percentage+'%';

				}
				img.src = 'img/'+imgs[i];
			}

		},
		presquare = function(){
			var $pqs = $('presquares');
			var deg = -15;
			for(var p=1; p<=24; p++){
				var ps = document.createElement('div');
				ps.className = 'presquare';
				
				secs = 1000+(p*50);
				deg+=15;

				ps.style.webkitTransitionDelay = (secs)+'ms';
				ps.style.webkitTransform = 'rotate('+(deg)+'deg)';
				ps.style.mozTransitionDelay = (secs)+'ms';
				ps.style.mozTransform = 'rotate('+(deg)+'deg)';
				ps.style.oTransitionDelay = (secs)+'ms';
				ps.style.oTransform = 'rotate('+(deg)+'deg)';
				ps.style.transitionDelay = (secs)+'ms';
				ps.style.transform = 'rotate('+(deg)+'deg)';

				ps.id = 'ps-'+p;
				$pqs.appendChild(ps);
				if(p==24){$('clock-face').className = '';}
			}
			preload(init);
		},
		init = function(){

			var $ss = $('starting-sec'),
				$sh = $('second-hand'), 
				$sh2 = $('second-hand-2'), 
				$sm = $('starting-minute'),
				$mh = $('minute-hand'),
				$shr = $('starting-hour'),
				$hh = $('hour-hand'),
				$es = $('email-signup'),
				$bs = $('button-submit'),
				$ty = $('email-thankyou'),
				$bc = $('button-cancel');

				inited = true;

				var dresses = ['cape', 'yellowPants', 'pockets', 'blueSuit', 'shortSkirt'];
				var curDress = Math.floor(Math.random()*dresses.length);

				var idle1 = {
					dir: 1,
					curFrame: 0,
					curDelay: 0,
					width: 75,
					frames: 29,
					offset: 0,
					delay: 0,
					id: $mh
				}, idle2 = {
					dir: 1,
					curFrame: 10,
					curDelay: 0,
					width: 75,
					frames: 29,
					offset: 260,
					delay: 0,
					id: $hh
				}, walking = {
					curFrame: 10,
					width: 165,
					height: 260,
					rows: 2,
					cols: 9,
					curRow: 0,
					curCol: 0,
					frames: 29,
					id: $sh,
					active: 1,
				},walking2 = {
					curFrame: 10,
					width: 165,
					height: 260,
					rows: 2,
					cols: 9,
					curRow: 0,
					curCol: 0,
					frames: 29,
					id: $sh2,
					active: 0
				};

				walking.id.className = 'hand '+ dresses[curDress];
				walking2.id.className = 'hand '+ dresses[curDress];

				var tick = setInterval(function(){
					imgSeq(idle1);
					imgSeq(idle2);
					imgMultSeq(walking);
					imgMultSeq(walking2);
				},68); //72.25 = 8ms diff

				var change = setInterval(function(){
					var sec = new Date().getSeconds();
					//console.log('s:',sec);
					if(sec == 55){
						curDress = (curDress + 1) % dresses.length;
						if(!walking.active){
							console.log(walking, 'switched to '+ dresses[curDress]);
							walking.id.className = 'hand '+ dresses[curDress];
						}else if(!walking2.active){
							console.log(walking2, 'switched to '+dresses[curDress]);
							walking2.id.className = 'hand '+ dresses[curDress];
						}
					}
					if(sec == 0){
						if(walking.active){
							walking.id.style.opacity = '0';
							walking2.id.style.opacity = '1';
							walking.active = 0;
							walking2.active = 1;
						}else if(walking2.active){
							walking.id.style.opacity = '1';
							walking2.id.style.opacity = '0';	
							walking.active = 1;
							walking2.active = 0;				
						}
					}
				}, 1000);

			$('content').className = (embedded ? 'loaded embedded' :'loaded');

			if(embedded){
				$('embed').className = 'kill';
				$('embedded-logo').className = 'show';
			}else{
				$('embedded-logo').className = 'kill';
			}

			// if(window.location.search[0] == '?'){
			// 	var aniSecs =  window.location.search.replace('?','')+'s';
			// 	console.log(aniSecs);
			// 	$ss.style.webkitAnimationDuration = (aniSecs ? aniSecs : '30s');
			// }

			startClock($ss, $sm, $shr);
			startAudio();
			setContent();

			// Check for Cookies - if not nor an embed, get users to sign up for emails

			var c = readCookie('marykcookie');

			if(thanks){
				$bc.addEventListener('click', function(){
					startAudio();
					$ty.className = 'hide';
					setTimeout(function(){$ty.className = 'hide kill';}, 1000); // prevent focusing on input elements
				});
			}
			
			if(!c && !embedded){
				$es.className = 'show';

				$bs.addEventListener('click', function(){
					$es.className = 'hide';
					
					var iName = escape($('input-name').value);
					var iEmail = escape($('input-email').value);

					$('input-name').blur();
					$('input-email').blur();

					setTimeout(function(){$es.className = 'hide kill';}, 1000); // prevent focusing on input elements

					createCookie('marykcookie','name:'+iName+'-email:'+iEmail,7);
				});

			}else{
				console.log(c);
			}


			// Copy to Clipboard if on site
			var $e = $('embed');
			$ep = $('embed-prompt');
			$ec = $('embed-copy');
			$eca = $('embed-cancel');
			$ta = $('text-area');

			if(!embedded){
				$e.addEventListener('click', function(){
					$ep.className = 'show';
				});

				$ep.addEventListener('click', function(){
					var text = $ta.innerText;
				});

				$eca.addEventListener('click', function(){
					$ep.className = 'hide';
					setTimeout(function(){$ep.className = 'hide kill';}, 1000); // prevent focusing on input elements
				});
			}
		},
		startAudio = function(){
			if(!audio){
				var a = document.createElement('audio');
				a.src = (navigator.userAgent.indexOf("Firefox")!=-1 ? 'Footstep_v9.ogg' : 'Footstep_v7.mp3');
				document.body.appendChild(a);
				a.addEventListener('ended', rm = function(){loopAudio(a);}, false);
				a.play();

				$p = $('play'), $m = $('mute');
				$p.addEventListener('click', startAudio);
				
				$p.className = 'hide';
				$m.className = '';
				setTimeout(function(){$p.className = 'hide kill';}, 1000); 

				audio = true;

				$m.addEventListener('click', function(){
					a.removeEventListener('ended', rm, false);
					$m.className = 'hide';
					setTimeout(function(){$m.className = 'hide kill';}, 1000); 
					$p.className = '';
					audio = false;
				});
			}

		},
		loopAudio = function(audio){
			var diff = restartDiff - +new Date();
			//setTimeout(function(){
				audio.play();
			//},108);
			console.log('diff: ', diff);
		},
		startClock = function($ss, $sm, $shr) {
		        var angle = 360/60;
		        var offset = 20;
		        var date = new Date();
		        var hour = date.getHours();
		        if(hour > 12) {
		        	hour = hour - 12;
		        }
		        var minute = date.getMinutes();
		        var second = date.getSeconds();
		        var hourAngle = (360/12)*hour + (360/(12*60))*minute;

		        /*
					15: 90
					30: 180
					45: 270
					60: 360
		        */

		        console.log("h:",hour, hourAngle);
		        console.log("m:",minute, angle*minute);
		        console.log("s:",second, angle*second);

				$ss.style.webkitTransform = 'rotate('+((angle*second)-offset)+'deg)';
				$sm.style.webkitTransform = 'scale(1.025) rotate('+(angle*minute)+'deg)';
				$shr.style.webkitTransform = 'scale(1.025) rotate('+(hourAngle)+'deg)';

				$ss.style.mozTransform = 'rotate('+((angle*second)-offset)+'deg)';
				$sm.style.mozTransform = 'scale(1.025) rotate('+(angle*minute)+'deg)';
				$shr.style.mozTransform = 'scale(1.025) rotate('+(hourAngle)+'deg)';

				$ss.style.oTransform = 'rotate('+((angle*second)-offset)+'deg)';
				$sm.style.oTransform = 'scale(1.025) rotate('+(angle*minute)+'deg)';
				$shr.style.oTransform = 'scale(1.025) rotate('+(hourAngle)+'deg)';

				$ss.style.transform = 'rotate('+((angle*second)-offset)+'deg)';
				$sm.style.transform = 'scale(1.025) rotate('+(angle*minute)+'deg)';
				$shr.style.transform = 'scale(1.025) rotate('+(hourAngle)+'deg)';

		},
		imgSeq = function(obj){
			//console.log(obj);
			if(obj.curDelay > 0){
				obj.curDelay--;
				obj.id.style.backgroundPosition = '-'+(obj.curFrame * obj.width)+'px -'+obj.offset+'px';
				return false;
			}else if((obj.curFrame < obj.frames) && (obj.dir == 1)){
				//iterate forward to top
				obj.curFrame++;
			}else if(((obj.curFrame <= obj.frames) && (obj.curFrame >= 1)) && (obj.dir == 0)){
				//iterate backward to bottom
				obj.curFrame--;
			}else if(obj.curFrame == obj.frames){
				//enter delay at top switch direction backward
				obj.curDelay = obj.delay;
				obj.dir = 0;
			}else if (obj.curFrame == 0){
				//enter delay at bottom switch direction forward
				obj.curDelay = obj.delay;
				obj.dir = 1;
			}
			obj.id.style.backgroundPosition = '-'+(obj.curFrame * obj.width)+'px -'+obj.offset+'px';
			return true; 
		},
		imgMultSeq = function(obj){

			if((obj.curFrame <= obj.frames - 2)){
				
				if(obj.curFrame % obj.cols == 0 && obj.curCol != 0 && obj.curRow < obj.rows){
					//switch down a row and start at beginning
					obj.curCol = 0;
					obj.curRow++;

				}else{
					//iterate forward to end of row
					obj.curCol++;

				}
				obj.curFrame++;

			}else{
				//restart
				obj.curFrame = 0;
				obj.curRow = 0;
				obj.curCol = 0;
				restartDiff = +new Date();
			}

			obj.id.style.backgroundPosition = '-'+(obj.curCol * obj.width)+'px -'+obj.curRow * obj.height+'px';
			return true; 
		};