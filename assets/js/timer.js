/* -------------------------- Timer -------------------------- */
let firstClick = 0;
let timeout;

// Function that counts passed time from start game 
function startTimer() {
    if (firstClick) {
        let timer = document.getElementById('timer').innerHTML;
        let separateTime = timer.split(":");
        let min = separateTime[0];
        let sec = separateTime[1];

        if (sec == 59) {
            min++;
            sec = 0;

            if (sec == 0)
                sec = "0" + sec;
            if (min < 10)
                min = "0" + min;
        } else {
            sec++;

            if (sec < 10)
                sec = "0" + sec;
        }

        calculateForMin(min);


        document.getElementById("timer").innerHTML = min + ":" + sec;
        timeout = setTimeout(startTimer, 1000);
    }
}
function pauseTimer() {
    clearTimeout(timeout);
}

function resetTimer() {
    document.getElementById("timer").innerHTML = "00" + ":" + "00";
    firstClick = 0;
    pointsSubtract = 0;
    points = 0;
}