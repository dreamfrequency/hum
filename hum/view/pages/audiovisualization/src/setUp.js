
var rafID = null;
var analyser = null;
var c = null;
var cDraw = null;
var ctx = null;
var microphone = null;
var ctxDraw = null;

var loader;
var filename;
var fileChosen = false;
var hasSetupUserMedia = false;

var detectorElem,
	canvasElem,
	waveCanvas,
	pitchElem,
	noteElem,
	detuneElem,
	detuneAmount;

	detectorElem = document.getElementById( "detector" );
	canvasElem = document.getElementById( "output" );
	DEBUGCANVAS = document.getElementById( "waveform" );
	pitchElem = document.getElementById( "pitch" );
	noteElem = document.getElementById( "note" );
	detuneElem = document.getElementById( "detune" );
	detuneAmount = document.getElementById( "detune_amt" );
	// centreButton = document.getElementById("containers");

//handle different prefix of the audio context
var AudioContext = AudioContext || webkitAudioContext;




//create the context.
var context = new AudioContext();

//using requestAnimationFrame instead of timeout...
if (!window.requestAnimationFrame)
	window.requestAnimationFrame = window.webkitRequestAnimationFrame;

$(function () {
		"use strict";
	    loader = new BufferLoader();
	    initBinCanvas();
});

function useMic()
{
	"use strict";
	if (!navigator.mediaDevices.getUserMedia) {
		alert("Your browser does not support microphone input!");
		console.log('Your browser does not support microphone input!');
		return;
 	}

	navigator.mediaDevices.getUserMedia({audio: true, video: false})
	.then(function(stream) {
		hasSetupUserMedia = true;

	  	//convert audio stream to mediaStreamSource (node)
		microphone = context.createMediaStreamSource(stream);
		//create analyser
		if (analyser === null) analyser = context.createAnalyser();
		//connect microphone to analyser
		microphone.connect(analyser);

// updatePitch();
// stopMic();

		//start updating
		rafID = window.requestAnimationFrame(updateVisualization);

		$("#title").html("");
		$("#album").html("");
		$("#artist").html("");
		onWindowResize();
		$("#title, #artist, #album").css("visibility", "visible");
		$("#freq, body").addClass("animateHue");
	})
	.catch(function(err) {
	  /* handle the error */
		alert("Capturing microphone data failed! (currently only supported in Chrome & Firefox)");
		console.log('capturing microphone data failed!');
		console.log(err);
	});
}

// function stopMic() {
//
// 	// context.close();
// 	microphone.disconnect();
// }

function initBinCanvas () {


	//add new canvas
	"use strict";
	c = document.getElementById("freq");
	c.width = window.innerWidth;
        c.height = window.innerHeight;
	//get context from canvas for drawing
	ctx = c.getContext("2d");

	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	window.addEventListener( 'resize', onWindowResize, false );

	//create gradient for the bins
	var gradient = ctx.createLinearGradient(0, c.height - 300,0,window.innerHeight - 25);
	gradient.addColorStop(1,'#00f'); //black
	gradient.addColorStop(0.75,'#f00'); //red
	gradient.addColorStop(0.25,'#f00'); //yellow
	gradient.addColorStop(0,'#ffff00'); //white


	ctx.fillStyle = "#9c0001";
}

function onWindowResize()
{
	ctx.canvas.width  = window.innerWidth;
  	ctx.canvas.height = window.innerHeight;

	var containerHeight = $("#song_info_wrapper").height();
	var topVal = $(window).height() / 2 - containerHeight / 2;
	$("#song_info_wrapper").css("top", topVal);
	console.log(topVal);

	if($(window).width() <= 500) {
		//TODO: not yet working
		$("#title").css("font-size", "40px");
	}
}

var audioBuffer;
var sourceNode;
function setupAudioNodes() {
	// setup a analyser
	analyser = context.createAnalyser();
	// create a buffer source node
	sourceNode = context.createBufferSource();
	//connect source to analyser as link
	sourceNode.connect(analyser);
	// and connect source to destination
	sourceNode.connect(context.destination);
	//start updating
	rafID = window.requestAnimationFrame(updateVisualization);
}


function reset () {
	if (typeof sourceNode !== "undefined") {
		sourceNode.stop(0);
	}
	if (typeof microphone !== "undefined") {
		microphone = null;
	}
}
