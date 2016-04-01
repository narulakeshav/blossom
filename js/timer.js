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

    /* Getting time for the timer and stopwatch
     * ----------------------------------------------------------------
     * minutes - time in minutes
     * seconds - time in seconds
     * milliseconds - time in milliseconds
     * progress - progress from 1 to 100
     * t - timer variable
     * p - progress bar variable
     * ----------------------------------------------------------------
     */
    var minutes, seconds, milliseconds, progress = 0;
    var t, p, b;

    /* Boolean Values
     * ----------------------------------------------------------------
     * stopThenStart - true if timer is/was stopped or paused
     * firstTimeZero - true if 00:00 hasn't been displayed on screen
     * ----------------------------------------------------------------
     */
    var stopThenStart = false;
    var firstTimeZero = true;
    var firstTimeZeroCheck = firstTimeZero;

    /* On Click Functions
     * ----------------------------------------------------------------
     * button.onclick() - starts the timer on start button
     * reset.onclick() - resets time and inputs on reset button
     * ----------------------------------------------------------------
     */
    button.onclick = function() {
        if(validateInput()) {
            if(btnText.innerHTML == "start") {
                btnText.innerHTML = "pause";
                startCountdown();
                changeStyle("#reset", "visibility", "hidden");
                changeStyle("#reset", "-webkit-transform", "translate(0px, -20px)");
                changeStyle("#reset", "opacity", "0");
            }
            else {
                btnText.innerHTML = "start";
                stopCountdown();
                changeStyle("#reset", "visibility", "visible");
                changeStyle("#reset", "-webkit-transform", "translate(0px, 0px)");
                changeStyle("#reset", "opacity", "1");
            }
            workTime.readOnly = true;
            breakTime.readOnly = true;
        }
        else throwMessageIfInvalid();
    };

    reset.onclick = function() {
        progress = minutes = seconds = milliseconds = 0;
        changeStyle(".progress-bar", "width", progress + "%");

        // Stops the audio and reset its time
        audio.pause();
        audio.currentTime = 0;

        // Resets input value
        workTime.value = "";
        breakTime.value = "";
        workTime.readOnly = false;
        breakTime.readOnly = false;

        // Resets mainTime
        mainTime.innerHTML = "2:00";
        ms.innerHTML = "00";
        mainTime.appendChild(ms);

        // Sets variable to false
        stopThenStart = false;
        validInput = false;
        firstTimeZero = true;
        firstTimeZeroCheck = firstTimeZero;

        changeStyle("#reset", "-webkit-transform", "translate(0px, -20px)");
        changeStyle("#reset", "opacity", "0");
    };


    /* Timer Start and Reset Functions 
     * ----------------------------------------------------------------
     * startCountdown() - starts coundown timer
     * stopCountdown() - stops the timer time when button is clicked
     * ----------------------------------------------------------------
     */

    function startCountdown() {
        // Gets the minutes from the input
        minutes = seconds = milliseconds = 0;
        minutes = workTime.value;
        if(minutes === "") { minutes = 25; }

        // Checks whether the timer was stopped before or not
        if(stopThenStart) {
            var split = mainTime.innerHTML.split(":");
            minutes = parseInt(split[0]);
            seconds = parseInt(split[1]);
            convertInputToTime(minutes, seconds, true);
        }

        // Otherwise convert the input to time and update timer
        else { convertInputToTime(minutes, seconds, true); }
    }

    function stopCountdown() {
        clearTimeout(t);
        // If audio is playing, stops the audio and changes time to 0
        audio.pause();
        audio.currentTime = 0;
        stopThenStart = true;
    }

    /* Time & Progress Update Functions
     * ----------------------------------------------------------------
     * convertInputToTime() - grabs the input data and converts it to a string
     * updateTimer() - updates the timer time and converts to necessary format
     * timerTimeElapsed() - updates the time every 15 milliseconds
     * updateProgressBar() - updates the progress bar every millisecond
     * updateBreakProgress() - updates break progress bar every ms
     * ----------------------------------------------------------------
     */
    function convertInputToTime(min, sec, val) {
        changeStyle(".progress-bar", "width", "0%");

        mainTime.innerHTML = min + ":" + sec; 
        ms.innerHTML = "60";

        if(val) progressTheBar();
        else progressBarBreak();
        updateTimer();
    }

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

        timeIsUp();
        mainTime.appendChild(ms);
    }

    function timerTimeElapsed() {
        t = setTimeout(updateTimer, 15.8);
    }

    function updateProgressBar() {
        p = setTimeout(progressTheBar, 1);
    }

    function updateBreakProgress() {
        b = setTimeout(progressBarBreak, 1);
    }

    /* Progress Bar Functions 
     * ----------------------------------------------------------------
     * progressTheBar() - progresses the progress bar by taking elapsed time / totalTime
     * progressBarBreak() - progress bar for break time
     * ----------------------------------------------------------------
     */
    function progressTheBar() {
        var splitTime, actualTime, currentTimeInSeconds, totalTime, elapsedTime;
        splitTime = mainTime.innerHTML.split(":");
        actualTime = workTime.value;
        currentTimeInSeconds = (parseInt(splitTime[0] * 60)) + parseInt(splitTime[1]);
        totalTime = (parseInt(actualTime[0] * 60));

        computeProgress(totalTime, currentTimeInSeconds);
        updateProgressBar();
    }

    function progressBarBreak() {
        var splitTime, actualTime, currentTimeInSeconds, totalTime, elapsedTime;
        splitTime = mainTime.innerHTML.split(":");
        actualTime = breakTime.value;
        currentTimeInSeconds = (parseInt(splitTime[0] * 60)) + parseInt(splitTime[1]);
        totalTime = (parseInt(actualTime[0] * 60));

        computeProgress(totalTime, currentTimeInSeconds);
        updateBreakProgress();
    }

    /* Secondary Functions 
     * ----------------------------------------------------------------
     * timeForBreak() - updates color and calculates break time
     * timeIsUp() - changes background color and starts break time
     * ----------------------------------------------------------------
    */
    function timeForBreak() {
        progess = minutes = seconds = milliseconds = 0;
        if(breakTime.value === "")  minutes = 5;
        else {
            minutes = breakTime.value;
            ms.innerHTML = "60";
        }
        btnText.innerHTML = breakTime.value + " MIN BREAK";
        changeStyle(".progress-bar", "background", "#F5F5F5");
        $("#reset").click(applyDefaultSettings);

        ms.style.color = "#A62D21";
        ms.style.fontWeight = "300";

        firstTimeZeroCheck = false;

        // Checks whether the timer was stopped before or not
        if(stopThenStart) {
            var split = mainTime.innerHTML.split(":");
            minutes = parseInt(split[0]);
            seconds = parseInt(split[1]);
            convertInputToTime(minutes, seconds, false);
        }

        // Otherwise convert the input to time and update timer
        else convertInputToTime(minutes, seconds, false);
    }

    function timeIsUp() {
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

            if(firstTimeZeroCheck !== firstTimeZero) {
                mainTime.innerHTML = "Time is up!";
                ms.innerHTML = "";
                btnText.innerHTML = "Interval Ended";
                changeStyle("#start-stop", "display", "none");
                changeStyle("#restart", "display", "inline");
                $("#restart").click(function() {
                    applyDefaultSettings();
                    $("#reset").trigger("click");
                });
            }
            
            // If it's break time, call some function
            if(firstTimeZeroCheck === firstTimeZero) {
    
                timeForBreak();
            }
            
            workTime.readyOnly = true;
            breakTime.readyOnly = true;

            if($(window).width() <= 768) changeStyle("#main-time", "font-size", "18vw");
            else changeStyle("#main-time", "font-size", "12vw");
            if($(window).width() <= 768) changeStyle("#ms", "font-size", "7vw");
            changeStyle("body", "background", "linear-gradient(45deg, #E74C3C, #C0392B)");
            changeStyle(".key-button","background", "rgba(255,255,255,0.2)");
            changeStyle("#reset", "background", "#FFF");
            changeStyle(".fa-repeat", "color", "#CD3F30");
        }
        else timerTimeElapsed();
    }

    /* Helper Methods
     * ----------------------------------------------------------------
     * validateInput() - validates input for workTime
     * throwMessageIfInvalid() - alerts the user if invalid input
     * applyDefaultSettings() - changes settings/colors to default
     * changeStyle() - simplifies and styles CSS properties
     * computeProgress() - finds progress in terms of percentage
     * ----------------------------------------------------------------
     */
    function validateInput() {
        var input = workTime.value;
        if(input >= 1 && input <= 60 || input === "") return true;
        return false;
    }

    function throwMessageIfInvalid() {
        workTime.value = "";
        breakTime.value = "";
        workTime.readOnly = false;
        breakTime.readOnly = false;
        alert("Please enter time in minutes from 1-60.");
    }

    function applyDefaultSettings() {
        if($(window).width() <= 768) changeStyle("#main-time", "font-size", "23vw");
        else changeStyle("#main-time", "font-size", "12vw");
        if($(window).width() <= 768) changeStyle("#ms", "font-size", "8vw");
        changeStyle("body", "background", "#26313B");
        changeStyle(".key-button", "background", "#465460");
        changeStyle("#reset", "background", "#FF4D89");
        changeStyle(".fa-repeat", "color", "#FFF");
        changeStyle(".progress-bar", "background", "#FF4D89");
        changeStyle("#start-stop", "display", "inline");
        changeStyle("#restart", "display", "none");

        ms.style.color = "#FF4D89";
        ms.style.fontWeight = "100";

        ms.innerHTML = "00";
        btnText.innerHTML = "Start";
        $("#start-stop").prop("disabled", false);
        isBreakTime = false;
    }

    function changeStyle(element, property, value) {
        $(element).css(property, value);
    }

    function computeProgress(totalTime, currentTimeInSeconds) {
        var elapsedTime = totalTime - currentTimeInSeconds;
        progress = (elapsedTime / totalTime) * 100;
        $(".progress-bar").css("width", progress + "%");
    }
});