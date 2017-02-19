var exerciseList = [
    {
        name: 'Shoulder Tilt',
        id: 'shoulder',
        repTime: 3
    },
    {
        name: 'Neck Tilt - Horizontal',
        id: 'neck-h',
        repTime: 3
    },
    {
        name: 'Neck Tilt - Vertical',
        id: 'neck-v',
        isSideView: true,
        repTime: 3
    },
    {
        name: 'Arms Stretch - Horizontal',
        id: 'arm-h',
        repTime: 5
    },
    {
        name: 'Arms Stretch - Vertical',
        id: 'arm-v',
        isSideView: true,
        repTime: 5
    },
    {
        name: 'Sitting Plank',
        id: 'leg',
        isSideView: true,
        repTime: 5
    },
    {
        name: 'Sitting Tricep',
        id: 'tricep',
        isSideView: true,
        repTime: 5
    },
    {
        name: 'Jogging',
        id: 'jog',
        isSideView: true,
        repTime: 2
    },
    {
        name: 'Plank',
        id: 'plank',
        isSideView: true,
        repTime: 3
    },
    {
        name: 'Desk Pushup',
        id: 'push',
        isSideView: true,
        repTime: 3
    }
];

var count, reps;
var currentWorkoutIndex = -1;
var storedName = '';

function setWorkoutCountDown(repTime) {
    count = 30;
    reps = -1;

    (function loop() {
        if (count > 0) {
            $('#exercise-countdown').text(count);

            if (count % repTime === 0) {
                $('#exercise-reps').text(++reps);
            }

            count -= 1;
            setTimeout(loop, 1000);
        } else if (count === 0) {
            $('#exercise-countdown').text(count);
            $('#exercise-reps').text(++reps);

            if (currentWorkoutIndex + 1 < exerciseList.length) {
                $('#fitness-exercise').removeClass();
                onExerciseChange(++currentWorkoutIndex);
            } else {
                $('#fitness-exercise').removeClass().addClass('exercise--yay');
                $('#exercise-text, #exercise-countdown, #exercise-reps').hide();
                $('.stick-man').removeClass('stick-man--side');
                $('#fitness-intro').show().text('Well done, ' + storedName + '!');
                $('#fitness-start').show().text('Restart Again');
                currentWorkoutIndex = -1;
            }
        } else {
            return false;
        }
    })();
}

function onExerciseChange(exerciseIndex) {
    var exercise = exerciseList[exerciseIndex];

    $('#fitness-exercise').removeClass().addClass('exercise--' + exercise.id);
    $('#exercise-text').text(exercise.name);
    $('.stick-man').removeClass('stick-man--side');

    if (exercise.isSideView) {
        $('.stick-man').addClass('stick-man--side');
    }

    setWorkoutCountDown(exercise.repTime);
}

function init() {
    storedName = JSON.parse(localStorage.getItem('name'));

    if (!storedName) {
        $('#fitness-form').show();
        $('#fitness-exercise').hide();
    } else {
        $('#fitness-form').hide();
        $('#fitness-exercise').show().removeClass().addClass('exercise--hi');
        $('#exercise-text, #exercise-countdown, #exercise-reps').hide();
        $('#fitness-intro').show().text('Hi, ' + storedName + '!');
        $('#fitness-start').show();
    }
}

function addEventListeners() {
    $('#fitness-form').on('click', '#btn-submit', function () {
        var name = $('input').val();
        if (name) {
            localStorage.setItem('name', JSON.stringify(name));
            $('input').val('');
            init();
        }
    });

    $('#fitness-start').on('click', function () {
        $('#fitness-intro, #fitness-start').hide();
        $('#exercise-text, #exercise-countdown, #exercise-reps').show();
        onExerciseChange(++currentWorkoutIndex);
    });
}

$(document).ready(function () {
    init();
    addEventListeners();
});