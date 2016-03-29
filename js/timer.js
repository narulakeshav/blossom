$(document).ready(function() {
	new WOW().init();

	// Getting HTML Elements by ID
	var d = document;
	var mainTime = d.getElementById("main-time");
	var ms = d.getElementById("ms");
	var audio = d.getElementById("audio"); 
	var button = d.getElementById("start-stop");
	var btnText = d.getElementById("btn-text");
	var reset = d.getElementById("reset");
	var stop = d.getElementById("stop");

	// Input Values
	var workTime = d.getElementById("work");
	var breakTime = d.getElementById("break");

	/* Getting time for the timer and stopwatch */
	var minutes = 0;
	var seconds = 0;
	var milliseconds = 0;
	var t;
	var p;
	var progress = 0;

	// TIMER OPERATIONS
	var stopThenStart = false;

	/* Starts the timer if the button is clicked */
	button.onclick = function() {
		if(validateInput()) {
			if(btnText.innerHTML == "start") {
				btnText.innerHTML = "pause";
				startCountdown();
				$("#reset").css("visibility", "hidden");
				$("#reset").css("-webkit-transform", "translate(0px, -20px)");
				$("#reset").css("opacity", "0");
			}
			else {
				btnText.innerHTML = "start";
				stopCountdown();
				$("#reset").css("visibility", "visible");
				$("#reset").css("-webkit-transform", "translate(0px, 0px)");
				$("#reset").css("opacity", "1");
			}
		}
		else {
			throwMessageIfInvalid();
		}
	};

	/* Resets time and inputs on button click */
	reset.onclick = function() {
		progress = minutes = seconds = milliseconds = 0;
		$(".progress-bar").css("width", progress + "%");

		// Stops the audio and reset its time
        audio.pause();
        audio.currentTime = 0;

        // Resets mainTime
        mainTime.innerHTML = "25:00";
        ms.innerHTML = "00";
        mainTime.appendChild(ms);

        // Sets variable to false
        stopThenStart = false;
        validInput = false;

        // Resets input value
        work.value = "";

        $("#reset").css("-webkit-transform", "translate(0px, -20px)");
        $("#reset").css("opacity", "0");
	};

	function validateInput() {
		var input = work.value;
		if(input >= 1 && input <= 60 || input === "") return true;
		return false;
	}

	function throwMessageIfInvalid() {
		work.value = "";
		alert("Please enter time in minutes from 1-60.");
	}

	function startCountdown() {
		// Gets the minutes from the input
		minutes = seconds = milliseconds = 0;
		minutes = work.value;
		if(minutes === "") { minutes = 25; }

		// Checks whether the timer was stopped before or not
		if(stopThenStart) {
		    var split = mainTime.innerHTML.split(":");
		    minutes = parseInt(split[0]);
		    seconds = parseInt(split[1]);
		    convertInputToTime(minutes, seconds);
		}

		// Otherwise convert the input to time and update timer
		else { convertInputToTime(minutes, seconds); }
	}

	/* Stops the timer time when button is clicked */
	function stopCountdown() {
		clearTimeout(t);
		// If audio is playing, stops the audio and changes time to 0
		audio.pause();
		audio.currentTime = 0;
		stopThenStart = true;
	}

	/* Updates the time every 15 milliseconds */
	function timerTimeElapsed() {
	    t = setTimeout(updateTimer, 15.8);
	}

	/* Updates the progress bar every millisecond */
    function updateProgressBar() {
        p = setTimeout(progressTheBar, 1);
    }

	/* Grabs the input data and converts it to a string, which is displayed and input is hidden*/
	function convertInputToTime(min, sec) {
		$(".progress-bar").css("width", "0%");

	    mainTime.innerHTML = min + ":" + sec; 
	    ms.innerHTML = "60";

	    progressTheBar();
	    updateTimer();
	}

	/* Updates the timer time and converts to necessary format */
	function updateTimer() {
	    milliseconds--;
	    if(milliseconds < 0) {
	        milliseconds = 59;
	        seconds--;
	        if(seconds < 0) { 
	            seconds = 59; 
	            minutes--;
	        }
	    }
	    mainTime.innerHTML = (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
	    ms.innerHTML = milliseconds > 9 ? milliseconds : "0" + milliseconds;
	    if(minutes === 0 && seconds === 0 && milliseconds === 0) {
	        clearInterval(t);
	        if (typeof audio.loop == 'boolean') { audio.loop = true; }
	        else {
	            audio.addEventListener('ended', function() {
	                this.currentTime = 0;
	                this.play();
	            }, false);
	        }
	        audio.play();
	        mainTime.innerHTML = "Time is up!";
	        $("#main-time").css("font-size", "140px");
	        ms.innerHTML = "";
	    }
	    else timerTimeElapsed();
	    mainTime.appendChild(ms);
	}

	/* Progresses the progress bar by taking elapsed time / totalTime */
	function progressTheBar() {
	    var splitTime = mainTime.innerHTML.split(":");
	  	
	    var currentTimeInSeconds = (parseInt(splitTime[0] * 60)) + parseInt(splitTime[1]);

	    var actualTime = work.value;
	    var totalTime = (parseInt(actualTime[0] * 60));

	    var elapsedTime = totalTime - currentTimeInSeconds;

	    progress = (elapsedTime / totalTime ) * 100;
	    
	    $(".progress-bar").css("width", progress + "%");
	    updateProgressBar();
	}
});