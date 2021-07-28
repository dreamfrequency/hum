
// ARRAYS CONTAINING COLOURS AND MUSICAL NOTES===>
var noteStrings = ["white", "#ef4056", "#f58345", "#ffdd00", "#bcd85f", "#45b97c", "#2dac9e", "#00afcc", "#006aac", "#724993", "#c63d96", "black"];
var noteArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];



// THIS IS JUST TO GET THE NAME OF THE NOTE, IN THIS CASE THE COLOUR from above array
function noteFromPitch( frequency ) {
	// CORRELATED FREQUENCY NOTENUM CALCULATION===>
	var noteNum = 12 * (Math.log( frequency / 440 )/Math.log(2) );
	return Math.round( noteNum ) + 69;
}


// THIS FUNCTION PROVIDES THE COLOUR OF THE CENTRE CIRCLE, AS WELL AS THE NAME OF THE MUSICAL NOTE
function updatePitch( time ) {

	analyser.getFloatTimeDomainData( buf );
	var ac = autoCorrelate( buf, contextAudio.sampleRate );

		if (ac == -1) {

			console.log("frequency not available");

			} else {
				pitch = ac;
				// pitchElem.innerText = Math.round( pitch ) ;

				var note =  noteFromPitch( pitch );
				pitchElem.innerText = noteArray[note%12];

			}
}


// THIS FUNCTION CREATES AN OSCILLATOR
function playOsc(oscType, freq) {

	var osc = contextAudio.createOscillator();
	osc.type = oscType;
	osc.frequency.value = freq;
	osc.connect(contextAudio.destination);
	osc.start(contextAudio.currentTime);


}

// THIS FUNCTION PROVIDES THE COLOUR OF THE CENTRE CIRCLE, AND DISPLAYS THE PITCH OF THE MUSICAL NOTE
function stopMic() {
	var ac = autoCorrelate( buf, contextAudio.sampleRate );
	var maxBinCount = buf.length;
	var note =  noteFromPitch( pitch );

	pitch = ac;
	pitchTwo = ac * 2;
	pitchThree = ac * 3;

	if (ac > 300){ console.log("out of range")} else {


		noteElem.innerHTML = noteArray[note%12];
		detectorElem.style.backgroundColor = noteStrings[note%12];
	}
}
