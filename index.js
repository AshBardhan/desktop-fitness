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
                $('#exercise-text, #exercise-countdown').hide();
                $('.stick-figure').removeClass('stick-figure--side');
                $('#fitness-intro').show().text('Well done, ' + storedName + '!');
                $('#fitness-start').show().text('Restart Again');
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

function onExerciseChange(exerciseIndex) {
    var exercise = exerciseList[exerciseIndex];

    $('#fitness-exercise').removeClass().addClass('exercise--' + exercise.id);
    $('#exercise-text').text(exercise.name);
    $('.stick-figure').removeClass('stick-figure--side');

    if (exercise.isSideView) {
        $('.stick-figure').addClass('stick-figure--side');
    }

    setWorkoutCountDown();
}

function init() {
    storedName = JSON.parse(localStorage.getItem('name'));

    if (!storedName) {
        $('#fitness-form').show();
        $('#fitness-exercise').hide();
    } else {
        $('#fitness-form').hide();
        $('#fitness-exercise').show().removeClass().addClass('exercise--hi');
        $('#exercise-text, #exercise-countdown').hide();
        $('#fitness-intro').show().text('Hi, ' + storedName + '!');
        $('#fitness-start').show();
    }
}

function addEventListeners() {
    $('#fitness-form').submit(function (e) {
        e.preventDefault();
        console.log('hello!')
        var name = $('input').val();
        if (name) {
            localStorage.setItem('name', JSON.stringify(name));
            $('input').val('');
            init();
        }
    });

    $('#fitness-start').on('click', function () {
        $('#fitness-intro, #fitness-start').hide();
        $('#exercise-text, #exercise-countdown').show();
        onExerciseChange(++currentWorkoutIndex);
    });
}

$(document).ready(function () {
    init();
    addEventListeners();
});