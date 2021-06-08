/* -------------------------- Leaderboard -------------------------- */
const leaderboardModal = document.getElementById("leaderboard-modal");
const tblLeaderboard = document.getElementById("table-leaderboard-body");

let cookie;
let difficultyScore = 'medium';
let score = [];
let points = 0;
let pointsSubtract = 0;

function openLeaderboard() {
    document.getElementById("toggleMobileMenu").classList.remove("show");
    leaderboardModal.classList.add('show');
    $("#table-leaderboard-body").empty();

    if (score.length != 0) {
        for (let i = 0; i < score.length; i++) {
            let tr = document.createElement("tr");
            tr.appendChild(addTableData(score[i].score));
            tr.appendChild(addTableData(score[i].difficulty));
            tr.appendChild(addTableData(new Date(score[i].date).toLocaleDateString()));
            tblLeaderboard.appendChild(tr);
        }
    }

}

function addTableData(data) {
    let tdScore = document.createElement("td");
    tdScore.innerHTML = data;
    return tdScore;
}

//https://www.w3schools.com/js/js_cookies.asp
function addToLeaderboard() {
    getScore();
    let user = {
        score: points,
        difficulty: difficultyScore,
        date: new Date()
    };
    //limit to 10 scores   
    score.slice(10, 1);
    score.push(user);

    cookie = document.cookie;
    console.log(cookie);
    var d = new Date();
    //30 days
    d.setTime(d.getTime() + (30 * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = "leaderboard=" + JSON.stringify(score) + ";" + JSON.stringify(expires) + ";path=/";
}

function getScore() {
    if (document.cookie !== "") {
        let index1 = document.cookie.indexOf("=");
        score = JSON.parse(document.cookie.substring(index1 + 1));
        console.log(score)

        score.slice(10, 1);
    }

}

function calculateScore() {
    switch (difficultyScore) {
        case 'easy':
            points = 10;
            break;
        case 'medium':
            points = 100;
            break;
        case 'hard':
            points = 1000;
            break;
        case 'custom':
            return;
    }

    points -= pointsSubtract;
    console.log(points);
    addToLeaderboard();
}

function calculateForMin(min) {
    if (min <= 5) {
        pointsSubtract += 1;
    } else if (min <= 10) {
        pointsSubtract += 5;
    } else if (min <= 15) {
        pointsSubtract += 10;
    } else if (min <= 30) {
        pointsSubtract += 20;
    }

}