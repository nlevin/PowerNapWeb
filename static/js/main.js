$(document).ready(function() {

  // Move up iOS top bar
  if( !window.location.hash && window.addEventListener ){
    window.addEventListener( "load",function() {
        setTimeout(function(){
            window.scrollTo(0, 0);
        }, 0);
    });
  }

  // Let the games begin.
  startTimer();

});

var is_chrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var is_mobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)

// Start the timer, move the circles
function startTimer() {
  setTimeout(function() { $('#ding')[0].currentTime = 0; }, 1000);
  $('#ding')[0].pause();
  $("body").removeClass("done");
  $("body").removeClass("on").addClass("restart");
  //$("#circle").offsetWidth($("#circle").offsetWidth);
  setTimeout(function(){
    $("body").addClass("on").removeClass("restart");
  }, 200);
}

// Finish the timer
function endTimer() {
  $("body").attr("class","done");
  $('#ding')[0].play();
  NapTimer.stop;
  $("#time").text("Fin");
}

var napduration = 156000  // DEBUG: var napduration = 6500

// Initialize the timer
var NapTimer = new (function() {
    var $time, // Stopwatch element on the page
        incrementTime = 70, // Timer speed in milliseconds
        currentTime = napduration, // Current time in hundredths of a second
        updateTimer = function() {
            $time.html(formatTime(currentTime));
            currentTime -= incrementTime / 10;
            if (parseInt(currentTime / 6000) < 1) {
              endTimer();
            }
        },
        init = function() {
            $time = $('#time');
            NapTimer.Timer = $.timer(updateTimer, incrementTime, true);
        };
    this.resetCountdown = function() {
        currentTime = napduration;
        this.Timer.stop().once();
        this.Timer.toggle();
    };
    $(init);
});

// Click on circle to reset timer
$("#timer").click(function(){
  startTimer();
  NapTimer.resetCountdown();
});

var pointer = "mousedown";
if (is_mobile) {
   pointer = "touchstart";
}

$("#timer").bind(pointer, function(e) {
  $("#timer").addClass("pressed");
  setTimeout(function() { $("#timer").removeClass("pressed"); }, 200);
});


// Common functions
function pad(number, length) {
    var str = '' + number;
    while (str.length < length) {str = '0' + str;}
    return str;
}
function formatTime(time) {
    var min = parseInt(time / 6000),
        sec = parseInt(time / 100) - (min * 60),
        hundredths = pad(time - (sec * 100) - (min * 6000), 2);
    var string = 26
    document.title = pad(min,2) + ":" + pad(sec,2)
    if (pad(min,2) > 25)
      string = 26
    else if (min < 0)
      string = "Fin"
    else
      string = pad(min + 1,2)
    return string
    //return DEBUG (min > 0 ? pad(min + 1, 2) + ":" +  pad(sec,2) : "Fin");
}


// Chrome pauses when you leave the browser, let's handle that:

// Set name of hidden property and visibility change event
sessionStorage.isPaused = "false";
var hidden, visibilityChange; 
if (typeof document.webkitHidden !== "undefined") {
  hidden = "webkitHidden";
  visibilityChange = "webkitvisibilitychange";
}
function handleVisibilityChange() {
  if (is_chrome) {
    if (document[hidden]) {
      $("#circle")[0].style.webkitAnimationPlayState = "paused";
      sessionStorage.isPaused = "true";
      favicon.change("../img/paused.png");
    } else {
      $("#circle")[0].style.webkitAnimationPlayState = "running";
      sessionStorage.isPaused = "false";
      favicon.change("../img/play.png");
    }
  }
}

// handle page visibility change
// see https://developer.mozilla.org/en/API/PageVisibility/Page_Visibility_API
document.addEventListener(visibilityChange, handleVisibilityChange, false);

// revert to existing favicon for site when the page is closed
// otherwise the favicon will remain as paused.png
window.addEventListener("unload", function(){
  favicon.change("/favicon.ico");
}, false);