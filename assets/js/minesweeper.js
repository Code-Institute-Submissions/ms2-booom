/* -------------------------- Variables -------------------------- */


const board = document.getElementById('board');

let width=8;
let height=15;
let widthTimesHeight;
let bombCount=10;
let flags = 0;

let gameOver = false;

let squares = [];





/* -------------------------- Main -------------------------- */


//https://stackoverflow.com/a/3540295

function bodyLoaded() {
    if (/Android|webOS|iPhone|iPad|Mac|Macintosh|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        width = 8;
        height = 11;
        bombCount=10;
    }   
    
    createBoard();
    startTimer();

    flagCounter();
}





/* -------------------------- Functions -------------------------- */



/***** BOARD *****/


// Create board filled with squares
function createBoard() {
    //cleanup
    gameOver = false;
    squares = [];
    $("#board").empty();

    widthTimesHeight = width * height;

    const shuffledSquares = shuffleSquares();
    addBoardGrid();

    // iterate throughout the board, create div's for squares
    for (let i = 0; i < widthTimesHeight; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        // assign shuffled values to squares
        square.classList.add(shuffledSquares[i]);
        board.appendChild(square);
        squares.push(square);

        // invoke left click event
        square.addEventListener('click', function(e) {
            if (remapFlagActive) {
                // check if remapClick function is active
                addFlagsToSquare(square);
                return;
            }
            click(square);
        })


        // invoke right click event
        square.oncontextmenu = function (e) {
            e.preventDefault();
            addFlagsToSquare(square);
        }
    }
    // invoke function that adds total of how many bombs empty field is touching
    numOfBombsSurroundingEmpty();

    countFlags = bombCount;
}

// Add dynamic board grid
function addBoardGrid() {
    board.style.width = width * 40 + "px";
    board.style.height = height * 40 + "px";

    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat(" + width + ", 40px)";
    board.style.gridTemplateRows = "repeat(" + height + ", 40px)";
}



/***** GAME LOGIC *****/


// Add 'bombs' and 'empty fields' to Array amd shuffle it's values
function shuffleSquares() {
    const bombArray = Array(bombCount).fill('bomb');
    const emptyArray = Array(widthTimesHeight - bombCount).fill('empty');
    let boardArray = emptyArray.concat(bombArray);

    boardArray = boardArray.sort(() => Math.random() - 0.5);

    return boardArray;
}

// Calculate how many bombs empty fields are "touching", implement logic for borderline cases
function numOfBombsSurroundingEmpty() {
    for (let i = 0; i < squares.length; i++) {
        const leftBorder = (i % width === 0);
        const rightBorder = (i % width === width - 1);
        let total = 0;

        if (squares[i].classList.contains('empty')) {
            if (i > 0 && !leftBorder && squares[i - 1].classList.contains('bomb'))
                total++;
            if (i > (width - 1) && !rightBorder && squares[i + 1 - width].classList.contains('bomb'))
                total++;
            if (i > (width - 1) && squares[i - width].classList.contains('bomb'))
                total++;
            if (i > width && !leftBorder && squares[i - 1 - width].classList.contains('bomb'))
                total++;
            if (i < (widthTimesHeight - 1) && !rightBorder && squares[i + 1].classList.contains('bomb'))
                total++;
            if (i < (widthTimesHeight - width) && !leftBorder && squares[i - 1 + width].classList.contains('bomb'))
                total++;
                //todo
            if (i < (widthTimesHeight - width - 1) && !rightBorder && squares[i + 1 + width].classList.contains('bomb'))
                total++;
            if (i < (widthTimesHeight - width) && squares[i + width].classList.contains('bomb'))
                total++;

            // add calculation to empty squares
            squares[i].setAttribute('data', total);
        }
    }
}

// Reveal squares with data value '0', using recursion
function revealSquare(square) {
    let currentId = square.id;
    // border values
    const leftBorder = (currentId % width === 0);
    const rightBorder = (currentId % width === width - 1);

    setTimeout(() => {
        // north direction
        if (currentId > (width - 1)) {
            const newId = parseInt(currentId) - width;
            newSquare(newId);
        }
        // east direction
        if (currentId < (widthTimesHeight - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1;
            newSquare(newId);
        }
        // south direction
        if (currentId < (widthTimesHeight - width)) {
            const newId = parseInt(currentId) + width;
            newSquare(newId);
        }
        // west direction
        if (currentId > 0 && !leftBorder) {
            const newId = parseInt(currentId) - 1;
            newSquare(newId);
        }
        // north-east direction
        if (currentId < (widthTimesHeight - width - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1 + width;
            newSquare(newId);
        }
        // south-east direction
        if (currentId > (width - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1 - width;
            newSquare(newId);
        }
        // north-west direction
        if (currentId < (widthTimesHeight - width) && !leftBorder) {
            const newId = parseInt(currentId) - 1 + width;
            newSquare(newId);
        }
        // south-west direction
        if (currentId > width && !leftBorder) {
            const newId = parseInt(currentId) - 1 - width;
            newSquare(newId);
        }
    }, 50);
}

// Add new ID to new Square
function newSquare(newId) {
    const newSquare = document.getElementById(newId);
    click(newSquare);
}



/***** CLICK SQUARES OPTION *****/


// Left click function
function click(square) {
    // check if it's first click to start timer
    firstClick++;
    if (firstClick === 1) {
        startTimer();
    }
    // removes left click optionality if the game is over
    if (gameOver)
        return;
    // removes left click optionality for revealed squares, or squares containing flag
    if (square.classList.contains('revealed-square') || square.classList.contains('flag'))
        return;

    // check which kind of a field is clicked and invoke action
    if (square.classList.contains('bomb')) { // square with bomb
        isDefeat();
    } else { // square without bomb 
        let total = square.getAttribute('data');

        if (total != 0) { // square with val > 0
            square.classList.add('revealed-square');
            square.innerHTML = total;
            return;
        }

        revealSquare(square); // square with val = 0, call for recursive function

        square.classList.add('revealed-square');
    }
}



/***** FLAGS *****/


// Add flags to squares
function addFlagsToSquare(square) {
    if (gameOver)
        return;

    // only add flags to non revealed squares
    if (!square.classList.contains('revealed-square')) {
        // add flag
        if (!square.classList.contains('flag')) {
            addFlag(square);
            //every time flag is added, check for victory
            isVictory();
            // remove flag
        } else {
            removeFlag(square);
            //every time flag is removed, check for victory
            isVictory();
        }
    }
}

// Add Flag function
function addFlag(square) {
    square.classList.add('flag');
    square.innerHTML = '<i class="fab fa-font-awesome-flag"></i>';
    flags++;

    // flags for flag counter button
    countFlags--;
    flagCounter();
}

// Remove Flag function
function removeFlag(square) {
    square.classList.remove('flag');
    square.innerHTML = '';
    flags--;

    // flags for flag counter button
    countFlags++;
    flagCounter();
}



/***** END GAME *****/


// Check for Victory
function isVictory() {
    let bombFlag = 0;

    for (let i = 0; i < squares.length; i++) {
        // check if flag and bomb position is matched
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            bombFlag++;
        }

        // at every point also check if flag num is equal num of matched bombs with flags 
        if (bombFlag === bombCount && bombFlag === flags) {
            victory();
            flags = 0;
            gameOver = true;           
        }
    }
}

// Displays Game Over
function isDefeat() {
    gameOver = true;

    displayBombs();
    defeat();
}

// Displays all bombs when the game is over
function displayBombs() {
    squares.forEach(square => {
        if (square.classList.contains('bomb')) {
            square.innerHTML = '<svg class="mine" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 231.05"><defs><style>.cls-1{fill:#a00d95;}.cls-2{fill:#520254;}.cls-3{fill:none;stroke:#520254;stroke-miterlimit:10;stroke-width:6px;}</style></defs><title>bomb</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="80" cy="151.05" r="80"/><circle class="cls-2" cx="79.5" cy="150.55" r="70"/><path class="cls-3" d="M85.14,98.57s-36.64-47.89-22-62.65S99.21,45.71,121,38.51s-9.17-13.91-14.1-27.12"/><polygon class="cls-1" points="111 4.16 115.17 0 115.76 5.52 121.92 4.31 118.7 9.08 124.5 11.28 118.7 13.47 121.92 18.25 115.76 17.03 115.17 22.55 111 18.39 106.83 22.55 106.24 17.03 100.08 18.25 103.3 13.47 97.5 11.28 103.3 9.08 100.08 4.31 106.24 5.52 106.83 0 111 4.16"/></g></g></svg>';
        }
    })
}





/* -------------------------- Start New Game Button & Win/Lose Modals -------------------------- */



const gameModalContainer = document.getElementById('game-modal-container');
let gameModal = document.getElementById('game-modal');
const playAgainBtn = document.getElementById('play-again-btn');
let modalHtml = document.createElement('div');
const settingsModal = document.getElementById('settings-modal');

// Settings
function openSettings() {
  document.getElementById("toggleMobileMenu").classList.remove("show");  
    settingsModal.classList.add('show');   
}

function chooseDifficulty(difficulty) { 
    switch (difficulty) {
        case 'easy':
            width=5;
            height=5;
            bombCount=5;
            break;
        case 'medium':
            width=10;
            height=10;
            bombCount=10;
            break;
        case 'hard':
            width=15;
            height=15;
            bombCount=15;
            break;
        case 'custom':
            //toggle visibility
            break;
    }
    console.log(width, height);
    //close modal
  

    if(difficulty !=='custom'){
        settingsModal.classList.remove('show');
        createBoard();
    }

}

function createCustomGame(){
width=document.getElementById("width").value;
height=document.getElementById("height").value;
bombCount=document.getElementById("bomb").value;
console.log(bombCount);
    settingsModal.classList.remove('show');
    createBoard();
}


appendAndInsert();

// Insert modal HTML element before buttons
function appendAndInsert() {
    gameModal.appendChild(modalHtml);
    gameModal.insertBefore(modalHtml, playAgainBtn);
}

// Function to invoke New Game
function startAgain() {
    if (gameOver)
        refreshGame();

    // check if any of the squares are flagged or revealed
    // if they are, invoke click function
    // if they aren't, proceed with refreshing the game
    for (let i = 0; i < squares.length; i++) {
        if (squares[i].classList.contains('revealed-square') || squares[i].classList.contains('flag')) {
            gameModalContainer.classList.add('show');

            modalHtml.innerHTML = `
                <h2>Bomb again?</h2>
                <p>All progress will be lost!</p>
                `;
            appendAndInsert(modalHtml);

            return;
        }
    }

    refreshGame();
}

// Refresh the game
function refreshGame() {
    resetTimer();

    defaultSvg();
    
    createBoard();
}

// If this button is clicked, proceed to refresh
function playAgain() {
    gameModalContainer.classList.remove('show');
    refreshGame();
}

// Close modal
function closeModal() {
    gameModalContainer.classList.remove('show');
}

// Function for Defeat message
function defeat() {
    modalHtml.innerHTML = `
    <h2>Defeat! ..Noob alert!</h2>
    <h4>Would you like to BOMB again?</h4>
    `;

    gameModalContainer.classList.add('show');
}

// Function for Victory message
function victory() {
    modalHtml.innerHTML = `
    <h2>Victory!</h2>
    <h4>Would you like to BOMB again?</h4>
    `;

    $('#start-again-button').remove('svg');
    $('#start-again-button').html('<svg class="start-again-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 231.05"><defs><style>.cls-1{fill:#a00d95;}.cls-2{fill:#520254;}.cls-3,.cls-4{fill:none;stroke-miterlimit:10;}.cls-3{stroke:#520254;stroke-width:6px;}.cls-4{stroke:#a00d95;stroke-width:8px;}</style></defs><title>Victory Bomb</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="80" cy="151.05" r="80"/><circle class="cls-2" cx="79.5" cy="150.55" r="70"/><path class="cls-3" d="M85.14,98.57s-36.64-47.89-22-62.65S99.21,45.71,121,38.51s-9.17-13.91-14.1-27.12"/><polygon class="cls-1" points="111 4.16 115.17 0 115.76 5.52 121.92 4.31 118.7 9.08 124.5 11.28 118.7 13.47 121.92 18.25 115.76 17.03 115.17 22.55 111 18.39 106.83 22.55 106.24 17.03 100.08 18.25 103.3 13.47 97.5 11.28 103.3 9.08 100.08 4.31 106.24 5.52 106.83 0 111 4.16"/><path class="cls-4" d="M66.58,130.8c-1.07-1.16-10.39-11-24.34-9.63A29.08,29.08,0,0,0,24.5,130"/><path class="cls-4" d="M124.5,130.8c-1.06-1.16-10.39-11-24.33-9.63A29.12,29.12,0,0,0,82.42,130"/><path class="cls-4" d="M51.5,165.55c1.31,1.55,12.84,14.69,30.07,12.82,12.14-1.31,19.77-9.27,21.93-11.69"/></g></g></svg>');

    gameModalContainer.classList.add('show');
}

// Bring SVG icon back to default
function defaultSvg() {
    $('#start-again-button').remove('svg');
    $('#start-again-button').html('<svg class="start-again-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 231.05"><defs><style>.cls-1,.cls-3{fill:#a00d95;}.cls-2{fill:#520254;}.cls-3{font-size:36px;font-family:ComicSansMS, Comic Sans MS;}.cls-4{fill:none;stroke:#520254;stroke-miterlimit:10;stroke-width:6px;}</style></defs><title>Play Again</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="80" cy="151.05" r="80"/><circle class="cls-2" cx="79.5" cy="150.55" r="70"/><polygon class="cls-1" points="61.49 151.91 70.97 161.39 58.34 174.02 48.86 164.54 39.38 174.02 26.75 161.39 36.23 151.91 26.75 142.43 39.38 129.8 48.86 139.28 58.34 129.8 70.97 142.43 61.49 151.91"/><polygon class="cls-1" points="124.02 151.91 133.5 161.39 120.87 174.02 111.39 164.54 101.91 174.02 89.28 161.39 98.76 151.91 89.28 142.43 101.91 129.8 111.39 139.28 120.87 129.8 133.5 142.43 124.02 151.91"/><text class="cls-3" transform="translate(66.49 177.08) rotate(90)">3</text><path class="cls-4" d="M85.14,98.57s-36.64-47.89-22-62.65S99.21,45.71,121,38.51s-9.17-13.91-14.1-27.12"/><polygon class="cls-1" points="108 4.16 112.17 0 112.76 5.52 118.92 4.31 115.7 9.08 121.5 11.28 115.7 13.47 118.92 18.25 112.76 17.03 112.17 22.55 108 18.39 103.83 22.55 103.24 17.03 97.08 18.25 100.3 13.47 94.5 11.28 100.3 9.08 97.08 4.31 103.24 5.52 103.83 0 108 4.16"/></g></g></svg>');
}





/* -------------------------- Timer -------------------------- */
let firstClick = 0;


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

        document.getElementById("timer").innerHTML = min + ":" + sec;
        setTimeout(startTimer, 1000);
    }
}
/*function pause() {
    if (timerActive == false) {
        timerActive = true;
        startTimer();
    } else {
        timerActive = false;
    }
}*/

function resetTimer() {
    document.getElementById("timer").innerHTML = "00" + ":" + "00";
    firstClick = 0;
}





/* -------------------------- Flag Count -------------------------- */



let countFlags;

// Add flag count to HTML
function flagCounter() {
  
    console.log('flag counter je pozvan');

    document.getElementById("flag-count").innerHTML = countFlags;
}


/* -------------------------- Remap Left & Right Click -------------------------- */
let remapFlagActive = false;



// Function for remapping click to flag on flag button click event
function remapClick() {
    if (!remapFlagActive) {
        remapFlagActive = true;
    } else {
        remapFlagActive = false;
    }
}





/* -------------------------- Connect Modal -------------------------- */
const connectModalContainer = document.getElementById('connect-modal-container');
let connectModal = document.getElementById('connect-modal');
let body = $('body').html();

function openConnectModal() {
    let click = false;
    connectModalContainer.classList.add('show');

    addEventListener('click', function() {

        console.log(click);
        if(click)
    {
        connectModalContainer.classList.remove('show');
    } else {
        click = true;
        return;
    }
    click = false
        return;
        //connectModalContainer.classList.remove('show');
    })
    ;
    
}