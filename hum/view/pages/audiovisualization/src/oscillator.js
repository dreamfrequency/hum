console.log("working");

var noteStrings = ["white", "#ef4056", "#f58345", "#ffdd00", "#bcd85f", "#45b97c", "#2dac9e", "#00afcc", "#006aac", "#724993", "#c63d96", "black"];
var noteArray = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"];

var audioContext = new AudioContext();
window.onload = function () {
  var onOff = document.getElementById("on-off");
  var span = document.getElementsByTagName("span")[0];
  var osc = false;
  var freqSliderVal = document.getElementsByTagName("input")[1].value;

  var selectedWaveform = "sine";
  var waveformTypes = document.getElementsByTagName('li');

  function select() {
    selectedWaveform = document.getElementById(this.id).id;
    console.log(selectedWaveform);
  }

  for (var i = 0; i < waveformTypes.length; i++) {
    waveformTypes[i].addEventListener('click', select);
  }

  setInterval (function() {

    if (!osc) {

      console.log("osc is stopped");

    } else {

      freqSliderVal = document.getElementsByTagName("input")[1].value;
      osc.frequency.value = freqSliderVal;
      console.log("osc is playing");
      osc.type = selectedWaveform;
      console.log("VAL = " + freqSliderVal);

      var oscNote = Math.round( 12 * (Math.log( freqSliderVal / 440 )/Math.log(2) ) ) + 69;


      noteElem.innerHTML = noteArray[oscNote%12];
  		// detectorElem.style.backgroundColor = noteStrings[note%12];
      detectorElem.style.backgroundColor = noteStrings[oscNote%12];


    }
  }, 50);



  onOff.addEventListener('click', function() {

    if (!osc) {
      // var note =  noteFromPitch( pitch );

      osc = audioContext.createOscillator();
      gain = audioContext.createGain();
      osc.type = selectedWaveform;
      osc.frequency.value = freqSliderVal;

      osc.connect(gain);
      gain.connect (audioContext.destination);
      osc.start(audioContext.currentTime);
      onOff.value = "stop";
      gain.gain.value = 0.2;

      // span.innerHTML = "click to stop";
    } else {

      osc.stop(audioContext.currentTime);
      osc = false;
      onOff.value = "start";
      // span.innerHTML = "click to start";
    }
  });

};
