# Blossom
Blossom is a pomodoro clock application that helps you manage time, by allowing you to work for 25 minutes, followed by a 5 minutes of break time. You can also set work and break time accordingly and alarm will ring when time is over.
<br><br>
[http://narulakeshav.com/app/blossom](http://narulakeshav.com/app/blossom)
<br><br>
![Screenshot](http://i.imgur.com/kMp3HBO.jpg)

# What I Used
* Jade
* Sass
* JavaScript/jQuery
* Bootstrap

# Alarm
The Alarm ringtone that I used DOES NOT BELONG TO ME. The ringtone is from the app called [Sleep Cycle](http://www.sleepcycle.com/) called *warm breeze*. All rights are reserved to them!!

# How it Works
As simple as Blossom looks, it was just as abstract to build it. I grabbed the time form the `input` and convert them into `strings`. Then by creating `minutes`, `seconds`, and `milliseconds` variables, I was able to update the time. For progress bar, I took the work time by `user` and subtracted it to the time on the `screen`, which gave me the `elapsed time`. To get the progress bar to move, I change its width:
```
progress = (elapsedTime / totalTime) * 100;

$(".progress-bar").css("width", progress + "%");
updateProgressBar();

// updates the progress bar every millisecond
function updateProgressBar() {
    p = setTimeout(progressTheBar, 1);
}
```

# Design
I wanted to keep the design simple, elegant, and flat. I tested out many color schemes but I stuck with the dark navy blue `#26313B` and pink `#FF4D89`. I liked how the app turned out to be. It's clutter free, which helps me, as a user, focus more.

# One Problem
One problem that I'm currently having is to get `setInterval()` to work when the tab in inactive on the browser. I am not sure how to do that, so if you'd like to help and contribute, feel free to make a new pull request :)