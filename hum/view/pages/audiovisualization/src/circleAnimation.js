
// NEW updateVisualization WITH PITCH DETECT===>
function updateVisualization () {

	// get the average, bincount is fftsize / 2
	if (fileChosen || hasSetupUserMedia) {
		var array = new Uint8Array(analyser.frequencyBinCount);
		analyser.getByteFrequencyData(array);

		drawBars(array);
		// PITCH DETECT FUNCTIONALITY===>
		updatePitch();
		// PITCH DETECT FUNCTIONALITY===>
	}
	rafID = window.requestAnimationFrame(updateVisualization);
}

function drawBars (array) {
	//just show bins with a value over the treshold
	var threshold = 0;
	// clear the current state
	ctx.clearRect(0, 0, c.width, c.height);
	//the max count of bins for the visualization
	var maxBinCount = array.length;
	//space between bins
	var space = 3;

	ctx.save();
	ctx.globalCompositeOperation='source-over';

// POSITION OF ANIMATION ON SCREEN===>
	ctx.scale(0.5, 0.5);
	ctx.translate(window.innerWidth, window.innerHeight);
	// POSITION OF ANIMATION ON SCREE===>
	var bass = Math.floor(array[1]); //1Hz Frequenz
	// THIS DEFINES RADIUS OF CIRCLE, IN RELATION TO LOWEST FREQUENCY OF AUDIO====>
	var radius = 0.45 * $(window).width() <= 450 ? -(bass * 0.25 + 0.45 * $(window).width()) : -(bass * 0.25 + 450);
	// THIS DEFINES RADIUS OF CIRCLE, IN RELATION TO LOWEST FREQUENCY OF AUDIO====>

	var bar_length_factor = 1;
	if ($(window).width() >= 785) {
		bar_length_factor = 1.0;
	}
	else if ($(window).width() < 785) {
		bar_length_factor = 1.5;
	}
	else if ($(window).width() < 500) {
		bar_length_factor = 20.0;
	}
	console.log($(window).width());
	//go over each bin
	var ac = autoCorrelate( buf, context.sampleRate );
	for ( var i = 0; i < maxBinCount; i++ ) {
		var value = array[i];

	// THIS IS THE CIRCLE ANIMATION
		if (value > threshold) {
			//draw bin
			ctx.fillRect(0 + i * space, c.height - value, 2 , c.height);
      ctx.fillRect(i * space, c.height, 2, -value);

			// DEFINES THE LENGTH OF EACH BAR FROM THE CENTRE POINT
      ctx.fillRect(0, radius, $(window).width() <= 450 ? 2 : 3, value / bar_length_factor);

			// DEFINES THE CIRCLE AND NUMBER OF ITERATIONS
      ctx.rotate((180 / 128) * Math.PI/180);

			// DEFINES THE COLOUR ACCORDING TO MIC INPUT FREQUENCY
			if (ac > 90 && ac < 113) {
				ctx.fillStyle = "#724993"; // fill
			} else if (ac > 113 && ac < 122) {
				ctx.fillStyle = "#c63d96";
			} else if (ac > 122 && ac < 130  || ac >244 && ac > 260) {
				ctx.fillStyle = "orange";
			} else if (ac > 130 && ac < 132) {
				ctx.fillStyle = "white";
			} else if (ac > 137 && ac < 145) {
				ctx.fillStyle = "#ef4056";
			} else if (ac > 145 && ac < 154) {
				ctx.fillStyle = "#f58345";
			} else if (ac > 154 && ac < 162) {
				ctx.fillStyle = "#ffdd00";
			} else if (ac > 162 && ac < 170) {
				ctx.fillStyle = "#bcd85f";
			} else if (ac > 171 && ac < 175) {
				ctx.fillStyle = "#45b97c";
			} else if (ac > 180 && ac < 186) {
				ctx.fillStyle = "#2dac9e";
			} else if (ac > 195 && ac < 199) {
				ctx.fillStyle = "#2dac9e";
			} else if (ac > 205 && ac < 207) {
				ctx.fillStyle = "#2dac9e";
			}
		}
	}
	ctx.restore();
}
