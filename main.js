// Face animation copied from: http://jsfiddle.net/pmontu/D5rfe/

isTalking = false;
var talkingFace = function () {
	var canvas = document.getElementById('canvas')
	var ctx = canvas.getContext('2d')

	ctx.translate(canvas.width / 2, canvas.height / 2);
	ctx.scale(1, -1)

	var z = 0;
	animate();
	function animate(){
			
			ctx.clearRect(-canvas.width / 2, -canvas.height / 2, canvas.width / 2 + canvas.width, canvas.height / 2 + canvas.height);
			
			ctx.beginPath()
			ctx.arc(0,0,200,0,2*Math.PI,true)
			ctx.fillStyle='black'
			ctx.fill()
			
			ctx.beginPath()
			ctx.arc(-70,80,30,0,2*Math.PI,true)
			ctx.fillStyle='white'
			ctx.fill()
			
			ctx.beginPath()
			ctx.arc(70,80,30,0,2*Math.PI,true)
			ctx.fillStyle='white'
			ctx.fill()
			
			ctx.beginPath()
			ctx.moveTo(0,50)
			ctx.lineTo(-20,0)
			ctx.lineTo(20,0)
			ctx.closePath()
			ctx.fillStyle='white'
			ctx.strokeStyle='white'
			ctx.stroke()
			
			if (isTalking) {
				ctx.beginPath();
				ctx.moveTo(-100,-60);
				ctx.lineTo(100,-60);
				ctx.arc(0,-60,100,2*Math.PI,Math.PI,true);
				ctx.fill();
			} else {
				ctx.beginPath();
        ctx.moveTo(-100,-100);
        ctx.lineTo(100,-100);
        ctx.stroke();
			}
			
			setTimeout(function () {
				requestAnimationFrame(animate);
			}, 5)
	}
}

var elizabot = require('elizabot-js/elizabot');
window.SpeechRecognition = window.SpeechRecognition       ||
													 window.webkitSpeechRecognition ||
													 null;
var humanReplied = false;
var msg = new SpeechSynthesisUtterance();
msg.onstart = function (e) {
	isTalking = true;
};
msg.onend = function (e) {
	isTalking = false;
	recognizer.start();
};
msg.onboundary = function (e) {
	isTalking = false;
	setTimeout(function () {
		isTalking = true;
	}, 120);
};
var recognizer = new window.SpeechRecognition();

recognizer.onresult = function(event) {
	humanReplied = true;
	for (var i = event.resultIndex; i < event.results.length; i++) {
		if (event.results[i].isFinal) {
			var userSpoke = event.results[i][0].transcript;
			var div = document.createElement("div");
			div.append("You: " + userSpoke);
			document.getElementById("conversation").append(div);
			var elizaReplied = elizabot.reply(userSpoke);
			var div = document.createElement("div");
			div.append("Eliza: " + elizaReplied);
			document.getElementById("conversation").append(div);
			msg.text = elizaReplied;
			window.speechSynthesis.speak(msg);
		} else {
			console.log(event.results[i][0]);
		}
	}
};

recognizer.onend = function (e) {
	if (!humanReplied) {
		var elizaReplied = elizabot.reply("");
		var div = document.createElement("div");
		div.append("Eliza: " + elizaReplied);
		document.getElementById("conversation").append(div);
		msg.text = elizaReplied;
		window.speechSynthesis.speak(msg);
	}
	humanReplied = false;
};

document.addEventListener("DOMContentLoaded", function(event) { 
	talkingFace();
	var text = elizabot.start();
	msg.text = text;
	var div = document.createElement("div");
	div.append("Eliza: " + text);
	document.getElementById("conversation").append(div);

	window.speechSynthesis.onvoiceschanged = function () {
		msg.voice = window.speechSynthesis.getVoices()[1];
		window.speechSynthesis.speak(msg);
	};
});

