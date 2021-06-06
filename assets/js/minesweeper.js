/* -------------------------- Variables -------------------------- */
const board = document.querySelector('.board');
let width = 15;
let height = 10;
let bombCount = 20;
let flags = 0;
let squares = [];
let gameOver = false;

/* -------------------------- Main -------------------------- */
createBoard();

/* -------------------------- Functions -------------------------- */
// Create board filled with squares
function createBoard() {
    const shuffledSquares = shuffleSquares();

    // iterate throughout the board, create div's for squares
    for(let i = 0; i < width * height ; i++) {
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
            addFlags(square);
        }
    }
    // invoke function that adds total of how many bombs empty field is touching
    numOfBombsSurroundingEmpty();
}

// Add 'bombs' and 'empty fields' to Array amd shuffle it's values
function shuffleSquares() {
    const bombArray = Array(bombCount).fill('bomb');
    const emptyArray = Array(width * height - bombCount).fill('empty');
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
            if (i < (width * height - 1) && !rightBorder && squares[i + 1].classList.contains('bomb'))
                total++;
            if (i < (width * height - width) && !leftBorder && squares[i -1 + width].classList.contains('bomb'))
                total++;
            if (i < (width * height - width - 1) && !rightBorder && squares[i + 1 + width].classList.contains('bomb'))
                total++;
            if (i < (width * height - width) && squares[i + width].classList.contains('bomb'))
                total++;
            
            // add calculation to empty squares
            squares[i].setAttribute('data', total);
        }
    }
}

// Add flags
function addFlags(square) {
    if (gameOver) 
        return;
    
    // only add flags to non revealed squares
    if (!square.classList.contains('revealed-square') && (flags < bombCount)) {
        // add flag
        if (!square.classList.contains('flag')) {
            square.classList.add('flag');
            square.innerHTML = '<i class="fab fa-font-awesome-flag"></i>';
            flags ++;

            //every time flag is added, check for victory
            isVictory();
        // remove flag
        } else {
            square.classList.remove('flag');
            square.innerHTML = '';
            flags --;
        }
    }
}

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
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // east direction
        if (currentId < (width * height - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // south direction
        if (currentId < (width * height - width)) {
            const newId = parseInt(currentId) + width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // west direction
        if (currentId > 0 && !leftBorder) {
            const newId = parseInt(currentId) -1;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // north-east direction
        if (currentId < (width * height - width - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1 + width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        } 
        // south-east direction
        if (currentId > (width - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1 - width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // north-west direction
        if (currentId < (width * height - width) && !leftBorder) {
            const newId = parseInt(currentId) - 1 + width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // south-west direction
        if (currentId > width && !leftBorder) {
            const newId = parseInt(currentId) - 1 - width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 50);
}

// Check for Victory
function isVictory() {
    let bombFlag = 0;

    for (let i = 0; i < squares.length; i++) {
        // check if flag and bomb position is matched
        if (squares[i].classList.contains('flag') && squares[i].classList.contains('bomb')) {
            bombFlag ++;
        }

        // at every point also check if flag num is equal num of matched bombs with flags 
        if (bombFlag === bombCount) {
            alert('VICTORY'); //---------------------------------------------------------------------------------------------------------ALERT
            gameOver = true;
        }
    }
}

// Displays Game Over
function isDefeat() {
    alert('BOOOM! Game Over!'); //--------------------------------------------------------------------------------------------------------ALERT
    gameOver = true;

    displayBombs();
}

// Displays all bombs when the game is over
function displayBombs() {
    squares.forEach(square => {
        if(square.classList.contains('bomb')) {
            square.innerHTML = '<svg class="mine" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 231.05"><defs><style>.cls-1{fill:#a00d95;}.cls-2{fill:#520254;}.cls-3{fill:none;stroke:#520254;stroke-miterlimit:10;stroke-width:6px;}</style></defs><title>bomb</title><g id="Layer_2" data-name="Layer 2"><g id="Layer_1-2" data-name="Layer 1"><circle class="cls-1" cx="80" cy="151.05" r="80"/><circle class="cls-2" cx="79.5" cy="150.55" r="70"/><path class="cls-3" d="M85.14,98.57s-36.64-47.89-22-62.65S99.21,45.71,121,38.51s-9.17-13.91-14.1-27.12"/><polygon class="cls-1" points="111 4.16 115.17 0 115.76 5.52 121.92 4.31 118.7 9.08 124.5 11.28 118.7 13.47 121.92 18.25 115.76 17.03 115.17 22.55 111 18.39 106.83 22.55 106.24 17.03 100.08 18.25 103.3 13.47 97.5 11.28 103.3 9.08 100.08 4.31 106.24 5.52 106.83 0 111 4.16"/></g></g></svg>';
        }
    })
}

