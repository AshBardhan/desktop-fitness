var exerciseList = [
    {
        name: 'Shoulder Tilt',
        id: 'shoulder'
    },
    {
        name: 'Neck Tilt - Horizontal',
        id: 'neck-h'
    },
    {
        name: 'Neck Tilt - Vertical',
        id: 'neck-v',
        isSideView: true
    },
    {
        name: 'Arms Stretch - Horizontal',
        id: 'arm-h'
    },
    {
        name: 'Arms Stretch - Vertical',
        id: 'arm-v',
        isSideView: true
    },
    {
        name: 'Sitting Plank',
        id: 'leg',
        isSideView: true
    },
    {
        name: 'Sitting Tricep',
        id: 'tricep',
        isSideView: true
    },
    {
        name: 'Jogging',
        id: 'jog',
        isSideView: true
    },
    {
        name: 'Plank',
        id: 'plank',
        isSideView: true
    },
    {
        name: 'Desk Pushup',
        id: 'push',
        isSideView: true
    }
];

var count;
var currentWorkoutIndex = -1;
var storedName = '';
var timeList = [];

function setWorkoutCountDown() {
    count = 30;

    (function workoutLoop() {
        if (count >= 0) {
            $('#exercise-countdown').text(count);
            count -= 1;
            setTimeout(workoutLoop, 1000);
        } else {
            if (currentWorkoutIndex + 1 < exerciseList.length) {
                switchToNextExercise();
            } else {
                $('#fitness-exercise').removeClass().addClass('exercise--yay');
                $('#exercise-text, #exercise-countdown, #exercise-progress').hide();
                $('.stick-figure').removeClass('stick-figure--side');
                $('#fitness-intro').show().text('Well done, ' + storedName + '!');
                $('#fitness-options').show();
                currentWorkoutIndex = -1;
            }
            return false;
        }
    })();
}

function switchToNextExercise() {
    $('#fitness-exercise').removeClass().addClass('exercise--rest');
    $('#exercise-text').text('Break Time');
    var restCount = 5;

    (function restingLoop() {
        if (restCount >= 0) {
            $('#exercise-countdown').text(restCount);
            restCount -= 1;
            setTimeout(restingLoop, 1000);
        } else {
            onExerciseChange(++currentWorkoutIndex);
            return false;
        }
    })();
}

function getGreetingsText() {
    var currentTime = new Date(),
        dayText = 'Good ',
        hour = currentTime.getHours();

    if (hour >= 5 && hour < 12) {
        dayText += 'Morning';
    } else if (hour >= 12 && hour < 5) {
        dayText += 'Afternoon';
    } else {
        dayText += 'Evening';
    }

    return dayText + ', ';
}

function onExerciseChange(exerciseIndex) {
    var exercise = exerciseList[exerciseIndex];

    $('#fitness-exercise').removeClass().addClass('exercise--' + exercise.id);
    $('#exercise-text').text(exercise.name);
    $('.stick-figure').removeClass('stick-figure--side');
    $('.progress-bar').removeClass('progress-bar--current');
    $('.progress-bar:eq(' + exerciseIndex + ')').addClass('progress-bar--current');

    if (exercise.isSideView) {
        $('.stick-figure').addClass('stick-figure--side');
    }

    setWorkoutCountDown();
}

function init() {
    storedName = JSON.parse(localStorage.getItem('name'));
    processTimeListCookie();

    if (!storedName) {
        $('#fitness-form').show();
        $('#fitness-exercise').hide();
    } else {
        $('#fitness-form').hide();
        $('#fitness-exercise').show().removeClass().addClass('exercise--hi');
        $('#exercise-text, #exercise-countdown').hide();
        $('#fitness-intro').show().text(getGreetingsText() + storedName + '!');
        $('#fitness-options').show();
    }
}

function generateExerciseProgress() {
    var progressBars = '';
    for (var i = 0; i < exerciseList.length; i++) {
        progressBars += '<div class="progress-bar"></div>'
    }
    $('#exercise-progress').html(progressBars).show();
}

function processTime(time) {
    var timeObj = {};
    timeObj.tt = time;

    time = time.split(':').map(function (i) {
        return parseInt(i)
    });

    timeObj.hr = ('0' + (time[0] % 12 || 12)).substr(-2);
    timeObj.mn = ('0' + time[1]).substr(-2);
    timeObj.tp = Math.floor(time[0] / 12) ? ' PM' : ' AM';

    return timeObj;
}

function addTimeToTheList(time) {
    for (var i = 0; i < timeList.length; i++) {
        if (time <= timeList[i].tt) {
            if (time < timeList[i].tt)
                timeList.splice(i, 0, processTime(time));
            return;
        }
    }
    if (i === timeList.length) {
        timeList.push(processTime(time));
    }
}

function getTimeValue(timeValue) {
    return ('0' + timeValue).substr(-2);
}

function checkTimePassed() {
    var currentDate = new Date();
    var currentTime = getTimeValue(currentDate.getHours()) + ':' + getTimeValue(currentDate.getMinutes());

    timeList.forEach(function (time, index) {
        if (currentTime > time.tt) {
            $('.time-box:eq(' + index + ')').addClass('time-box--disabled');
        }
    });
}

function displayTimeList() {
    if (timeList.length) {
        var timeListContent = '';
        timeList.forEach(function (time, index) {
            timeListContent +=
                '<div class="time-box">' +
                    time.hr + ':' + time.mn + time.tp +
                    '<span class="time-box__delete" data-item-id="' + index + '">&#215;</span>' +
                '</div>';
        });
        $('#time-list').html(timeListContent).show();
        checkTimePassed();
    } else {
        $('#time-list').hide();
    }
}

function saveTimeListCookie() {
    var cookieData = timeList.map(function (time) {
        return time.tt;
    }).join('|');

    document.cookie = 'time=' + cookieData + '; expires=Fri, 31 Dec 9999 23:59:59 GMT';
    console.log(document.cookie);
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function processTimeListCookie() {
    var cookieTimeList = getCookie('time');
    if (cookieTimeList.length) {
        cookieTimeList = cookieTimeList.split('|');
        timeList = cookieTimeList.map(function (time) {
            return processTime(time);
        });
        displayTimeList();
    }
}

function addEventListeners() {
    $('#fitness-form').submit(function (e) {
        e.preventDefault();
        var name = $('input[name=user-name]').val();
        if (name) {
            localStorage.setItem('name', JSON.stringify(name));
            $('input').val('');
            init();
        }
    });

    $('#btn-start').on('click', function () {
        $('#fitness-intro, #fitness-options').hide();
        $('#exercise-text, #exercise-countdown').show();
        generateExerciseProgress();
        onExerciseChange(++currentWorkoutIndex);
    });

    $('#btn-set-time').on('click', function () {
        $('#fitness-options').hide();
        $('#time-section').show();
    });

    $('#btn-done-time').on('click', function () {
        $('#fitness-options').show();
        $('#time-section').hide();
    });

    $('#btn-add-time').on('click', function (e) {
        e.preventDefault();
        var time = $('input[name=user-time]').val();
        if (time) {
            addTimeToTheList(time);
            saveTimeListCookie();
            displayTimeList();
        }
    });

    $('#time-list').on('click', '.time-box__delete', function (e) {
        var targetElement = $(e.target),
            index = targetElement.attr('data-item-id');
        timeList.splice(index, 1);
        saveTimeListCookie();
        displayTimeList();
    });
}

$(document).ready(function () {
    init();
    addEventListeners();
});