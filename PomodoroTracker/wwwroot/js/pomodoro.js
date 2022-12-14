var pomodoro_minute = "25";
var short_break_minute = "5";
var long_break_minute = "10";

var timer = pomodoro_minute + ":00";

var interval;

var flag_interval = false;
var flag_choosen = false;

var count = 1;


$('#taskTable tr').each(function () {
    $(this).hover(function () {
        $(this).css("background-color", "rgb(217,85,80)")
    }, function () {
        $(this).css("background-color", "rgb(228,133,131)")
    });
    $(this).click(function () {
        $(this).find('#state').each(function () {
            if ($(this).html() == 'Active') {
                $(this).html("-");
                flag_choosen = false;
            }
            else {
                $(this).html("Active");
                flag_choosen = true;
                $("#usmsg").html(" ");
            }
        });
    });
});

//function check() {
//    $('#taskTable tr').each(function () {
//        $(this).find('#state').each(function () {
//            if ($(this).html() == 'Active') {
//                flag_choosen = true;
//            }
//            else {
//                flag_choosen = false;
//            }
//        });
//    });

//    return flag_choosen;
//}

function stateDone() {
    $('#taskTable tr').each(function () {
        $(this).find('#state').each(function () {
            if ($(this).html() == 'Active') {
                $(this).html("Done");
            }
        });
    });
}


//start operation
$("#start").click(function () {
    playSoundButtons();
    if (!flag_interval) {
        if (flag_choosen) {
            startTimer();
        }
        else {
            playSoundWarning();
            $("#usmsg").html("YOU MUST CHOOSE A TASK!");
        }
    }
});

//stop operation
$("#stop").click(function () {
    playSoundButtons();
    clearInterval(interval);
    flag_choosen = true;
    flag_interval = false;
});

//reset operation
$("#reset").click(function () {
    playSoundButtons();
    flag_choosen = true;
    reset();
});

//option1 click-> POMODORO button
$("#option1").click(function () {
    playSoundButtons();
    // flag_choosen = check();
    console.log(flag_choosen);
    restartInterval(pomodoro_minute);
});

//option2 click->SHORT BREAK button
$("#option2").click(function () {
    playSoundButtons();
    flag_choosen = true;
    $("#usmsg").html(" ");
    restartInterval(short_break_minute);
});

//option3 click->LONG BREAK button
$("#option3").click(function () {
    playSoundButtons();
    flag_choosen = true;
    $("#usmsg").html(" ");
    restartInterval(long_break_minute);
});

function restartInterval(minuteVal) {
    clearInterval(interval);
    flag_interval = false;
    $("#seconds").html("0");
    $("#minute").html(minuteVal);
    timer = minuteVal + ":00";
}


function startTimer() {
    flag_choosen = false;
    flag_interval = true;
    interval = setInterval(function () {
        var new_timer = timer.split(':'); //after split->new_time[0]=> pomodoro_minute, new_timer[1]=>00
        var stop = false;
        //parse the values
        var minutes = parseInt(new_timer[0], 10);
        var seconds = parseInt(new_timer[1], 10);
        seconds -= 1;
        if (seconds < 0) {
            minutes -= 1;
        }
        if (minutes < 0) { //Time is up.
            reset();
            stop = true;
            if ($('#option1').is(':checked')) {
                stateDone();
                if (count < 4) {
                    count++;
                    $("#pomodoro_count").html(" " + count);
                }
                else if (count == 4) {
                    playSoundWarning();
                    $("#usmsg").html("CONGRATULATIONS!!!. YOU HAVE COMPLETED 4 POMODOROS. YOU CAN TAKE A LONG BREAK.");
                    count = 1;
                    $("#pomodoro_count").html(" " + count);
                }
            }
            //notifyMe();
            // send the message 
            playSound();
            showToastMessage();
        }
        if (!stop) {
            if (seconds < 0) {
                seconds = 59;
            }
            if ((seconds > 0) && (seconds < 10)) {
                seconds = '0' + seconds
            }
            $("#seconds").html(seconds);
            $("#minute").html(minutes);
            console.log(minutes + ':' + seconds);
            //update timer
            timer = minutes + ':' + seconds;
        }
    }, 1000);
}



function reset() {
    //clearInterval() method clears a timer set with the setInterval() method
    clearInterval(interval);
    flag_interval = false;
    $("#seconds").html("0");
    var minuteValue = "0";
    //arrange the minute according to the last click
    if ($('#option1').is(':checked')) {
        minuteValue = pomodoro_minute;
    }
    if ($('#option2').is(':checked')) {
        minuteValue = short_break_minute;
    }
    if ($('#option3').is(':checked')) {
        minuteValue = long_break_minute;
    }
    timer = minuteValue + ":00";

    $("#minute").html(minuteValue);
}



//user notification
function notifyMe() {
    // Check if the browser supports notifications
    if (!("Notification" in window)) {
        alert("This browser does not support system notifications");
    }
    else if (Notification.permission === "granted") {
        // Check whether notification permissions have already been granted;
        // if so, create a notification
        notify();
    }
    else if (Notification.permission !== 'denied') {
        // We need to ask the user for permission
        Notification.requestPermission(function (permission) {
            if (permission === "granted") {
                notify();
            }
        });
    }
}

//browser notification
function notify() {
    var message = getNotifyMessage();
    var notification = new Notification({ body: message, });

    notification.onclick = function () {
        window.focus();
    };

    //Wait 10 seconds for the message
    setTimeout(notification.close.bind(notification), 10000);
}

//get the message which will be seen by the user
function getNotifyMessage() {
    var message2 = "";
    if ($('#option1').is(':checked')) {
        message2 = "You have completed a pomodoro!";
    }
    if ($('#option2').is(':checked')) {
        message2 = "Your short break is done!";
    }
    if ($('#option3').is(':checked')) {
        message2 = "Your long break is done!";
    }
    return message2;
}

function showToastMessage() {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "newestOnTop": false,
        "progressBar": true,
        "positionClass": "toast-top-right",
        "preventDuplicates": false,
        "onclick": null,
        "showDuration": "300",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    };

    var message = "";
    if ($('#option1').is(':checked')) {
        message = "Congrats! You have completed a pomodoro!";
    }
    else if ($('#option2').is(':checked')) {
        message = "Your short break is done.";
    }
    else {
        message = "Your long break is done.";
    }

    toastr["success"](message);
}

function playSound() {
    audio = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/descent/gotitem.mp3");
    audio.oncanplay = function () {
        audio.play();
    }
}

function playSoundButtons() {
    audio = new Audio("http://commondatastorage.googleapis.com/codeskulptor-demos/pyman_assets/eatpellet.ogg");
    audio.oncanplay = function () {
        audio.play();
    }
}

function playSoundWarning() {
    audio = new Audio("http://codeskulptor-demos.commondatastorage.googleapis.com/pang/pop.mp3");
    audio.oncanplay = function () {
        audio.play();
    }
}
