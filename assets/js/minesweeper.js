/* -------------------------- Variables -------------------------- */
const board = document.getElementById('board');

let width = 15;
let height = 10;
let widthTimesHeight = width * height;
let bombCount = 10;
let flags = 0;

let gameOver = false;

let squares = [];


/* -------------------------- Main -------------------------- */
function bodyLoaded(){
    createBoard();
    start_timer();
}

/* -------------------------- Functions -------------------------- */
/***** BOARD *****/
// Create board filled with squares
function createBoard() {
    const shuffledSquares = shuffleSquares();
    addBoardGrid();

    // iterate throughout the board, create div's for squares
    for(let i = 0; i < widthTimesHeight ; i++) {        
        const square = document.createElement('div');
        square.setAttribute('id', i);
        // assign shuffled values to squares
        square.classList.add(shuffledSquares[i]);
        board.appendChild(square);
        squares.push(square);

        // invoke left click event
        square.addEventListener('click', function(e) {
            click(square);
        })

        // invoke right click event
        square.oncontextmenu = function(e) {
            e.preventDefault();
            addFlagsToSquare(square);
        }
    }
    // invoke function that adds total of how many bombs empty field is touching
    numOfBombsSurroundingEmpty();
}

// Add dynamic board grid
function addBoardGrid() {
    board.style.width = width * 50 + "px";
    board.style.height = height * 50 + "px";

    board.style.display = "grid";
    board.style.gridTemplateColumns = "repeat("+ width +", 50px)";
    board.style.gridTemplateRows = "repeat("+ height +", 50px)";
}

/***** GAME LOGIC *****/
// Add 'bombs' and 'empty fields' to Array amd shuffle it's values
function shuffleSquares() {
    const bombArray = Array(bombCount).fill('bomb');
    const emptyArray = Array(widthTimesHeight - bombCount).fill('empty');
    let boardArray = emptyArray.concat(bombArray);
    
    boardArray = boardArray.sort(() => Math.random() -0.5);
    
    return boardArray;
}

// Calculate how many bombs empty fields are "touching", implement logic for borderline cases
function numOfBombsSurroundingEmpty() {
    for (let i = 0; i < squares.length; i++) {
        const leftBorder = (i % width === 0);
        const rightBorder = (i % width === width -1);
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
            if (i < (widthTimesHeight - width) && !leftBorder && squares[i -1 + width].classList.contains('bomb'))
                total++;
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
            const newId = parseInt(currentId) -1;
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
    flags ++;
}

// Remove Flag function
function removeFlag(square) {
    square.classList.remove('flag');
    square.innerHTML = '';
    flags --;
}

/***** END GAME *****/
// Check for Victory
function isVictory() {
    let bombFlag = 0;

    for (let i = 0; i < squares.length; i++) {
        // check if flag and bomb position is matched
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            bombFlag ++;
        }

        // at every point also check if flag num is equal num of matched bombs with flags 
        if (bombFlag === bombCount && bombFlag === flags) {
            alert('VICTORY'); //---------------------------------------------------------------------------------------------------------ALERT
            gameOver = true;
        }
    }
}
//---------------------------------------------------------------------------------------------------------------------------------------------------------------------------
// Displays Game Over
function isDefeat() {
    gameOver = true;

    displayBombs();
    defeat();
}

// Displays all bombs when the game is over
function displayBombs() {
    squares.forEach(square => {
        if(square.classList.contains('bomb')) {
            square.innerHTML = '<svg class="mine" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 231.05"><defs><style>.cls-1{fill:#a00d95;}.cls-2{fill:#520254;}.cls-3{fill:none;stroke:#520254;stroke-miterlimit:10;stroke-width:6px;}</style></defs><title>bomb</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="80" cy="151.05" r="80"/><circle class="cls-2" cx="79.5" cy="150.55" r="70"/><path class="cls-3" d="M85.14,98.57s-36.64-47.89-22-62.65S99.21,45.71,121,38.51s-9.17-13.91-14.1-27.12"/><polygon class="cls-1" points="111 4.16 115.17 0 115.76 5.52 121.92 4.31 118.7 9.08 124.5 11.28 118.7 13.47 121.92 18.25 115.76 17.03 115.17 22.55 111 18.39 106.83 22.55 106.24 17.03 100.08 18.25 103.3 13.47 97.5 11.28 103.3 9.08 100.08 4.31 106.24 5.52 106.83 0 111 4.16"/></g></g></svg>';
        }
    })
}

/* -------------------------- Start New Game Button & Win/Lose Modals -------------------------- */
const gameModalContainer = document.getElementById('game-modal-container');
let gameModal = document.getElementById('game-modal');
const playAgainBtn = document.getElementById('play-again-btn');
let modalHtml = document.createElement('div');

appendAndInsert();

// Function to invoke New Game
function startAgain() {
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
    gameOver = false;
    squares = [];

    $("#board").empty();
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

// Insert modal HTML element before buttons
function appendAndInsert() {
    gameModal.appendChild(modalHtml);
    gameModal.insertBefore(modalHtml, playAgainBtn);
}

// Function for Defeat message
function defeat() {
    modalHtml.innerHTML = "<h2>Defeat</h2>";
    //appendAndInsert(modalHtml);

    gameModalContainer.classList.add('show');
}

/* -------------------------- Timer -------------------------- */
// Function that counts passed time from start game 
function start_timer() {
    let timer = document.getElementById('timer').innerHTML;
    let separateTime = timer.split(":");
    let min = separateTime[0];
    let sec = separateTime[1];

    if(sec == 59) {
        min++;
        sec = 0;

        if(sec == 0) 
            sec = "0" + sec;
        if(min < 10) 
            min = "0" + min;
    } else {
        sec++;

        if(sec < 10) 
            sec = "0" + sec;
    }

    document.getElementById("timer").innerHTML = min + ":" + sec;
    setTimeout(start_timer, 1000);
    
}
