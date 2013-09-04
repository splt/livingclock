

		var restartDiff = +new Date();
		var $ = function(id){return document.getElementById(id);};

		var getWindowHeight = function() {
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
		setContent = function() {
			var windowHeight = getWindowHeight();
			if (windowHeight > 0) {
				var contentElement = document.getElementById('content');
				var contentHeight = contentElement.offsetHeight;

				if (windowHeight - contentHeight > 0) {
					contentElement.style.position = 'relative';
					contentElement.style.top = ((windowHeight / 2) - (contentHeight / 2) -50) + 'px';
				}
				else {
					contentElement.style.position = 'static';
				}
			}
		},
		preload = function(cb){
			var imgs = [
				'Clock_big.png',
				'idle_2250x520_opt.png',
				'walk-sprite-14-flat.png',
				'walk_1650x780_opt.png'];
			var audio = ['Heels_v7.mp3'];
			var loaded = [];
			var percentage = 0;
			$ll = $('left-line');
			$rl = $('right-line');

			for(var i=0; i<=imgs.length-1; i++){

				var img = new Image();
				img.onload = function(){
					loaded.push(imgs[i]);
					percentage = loaded.length/imgs.length * 100;
					if(loaded.length/imgs.length == 1){
						//setTimeout(cb,1000);
						cb();
					}

					$ll.style.width = percentage+'%'; 
					$rl.style.width = percentage+'%';

				}
				img.src = 'img/'+imgs[i];
			}

		},
		init = function(){

			var $ss = $('starting-sec'),
				$sh = $('second-hand'), 
				$sh2 = $('second-hand-2'), 
				$sm = $('starting-minute'),
				$mh = $('minute-hand'),
				$shr = $('starting-hour'),
				$hh = $('hour-hand');

			var dresses = ['red', 'green', 'blue', 'yellow', 'purple', 'pink'];
			var curDress = 5;

			var idle1 = {
				dir: 1,
				curFrame: 0,
				curDelay: 0,
				width: 75,
				frames: 21,
				offset: 0,
				delay: 5,
				id: $mh
			}, idle2 = {
				dir: 1,
				curFrame: 10,
				curDelay: 0,
				width: 75,
				frames: 16,
				offset: 260,
				delay: 5,
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

			var tick = setInterval(function(){
				imgSeq(idle1);
				imgSeq(idle2);
				imgMultSeq(walking);
				imgMultSeq(walking2);
			},68); //72.25 = 8ms diff

			var change = setInterval(function(){
				var sec = new Date().getSeconds();
				console.log('s:',sec);
				if(sec == 45){
					curDress = (curDress + 1) % dresses.length;
					if(!walking.active){
						console.log(walking, 'switched to '+ dresses[curDress]);
					}else if(!walking2.active){
						console.log(walking2, 'switched to '+dresses[curDress]);
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
				console.log('cd:', curDress, dresses.length);
			}, 1000);

			$('content').className = 'loaded';

			// if(window.location.search[0] == '?'){
			// 	var aniSecs =  window.location.search.replace('?','')+'s';
			// 	console.log(aniSecs);
			// 	$ss.style.webkitAnimationDuration = (aniSecs ? aniSecs : '30s');
			// }

			startClock($ss, $sm, $shr);
			startAudio();
			setContent();
		},

		startAudio = function(){
			var a = document.createElement('audio');
			a.src = 'Heels_v7.mp3';
			document.body.appendChild(a);
			a.addEventListener('ended', rm = function(){loopAudio(a);}, false);
			$('mute').addEventListener('click', function(){
				a.removeEventListener('ended', rm, false);
			});
			$('play').addEventListener('click', startAudio);
			a.play();
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
		        var offset = 0;
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

				$ss.style.webkitTransform = 'rotate('+(angle*second)+'deg)';
				$sm.style.webkitTransform = 'scale(1.025) rotate('+(angle*minute)+'deg)';
				$shr.style.webkitTransform = 'scale(1.025) rotate('+(hourAngle)+'deg)';

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
			//obj.id2.style.backgroundPosition = '-'+(obj.curFrame * obj.width)+'px -'+obj.offset+'px';
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