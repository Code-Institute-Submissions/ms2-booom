const board = document.querySelector('.board');
let width = 15;
let height = 10;
let bombCount = 20;
let squares = [];
let gameOver = false;

createBoard();

// Create board filled with width*width squares
function createBoard() {
    const shuffledSquares = shuffleSquares();

    for(let i = 0; i < width * height ; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        square.classList.add(shuffledSquares[i]);
        board.appendChild(square);
        squares.push(square);

        // Add Event Listener for every board element
        square.addEventListener('click', function(e) {
            click(square);
        })
    }
    
    numOfBombsSurroundingEmpty();
}

// Add 'bombs' and 'empty fields' to Array amd shuffle it's value
function shuffleSquares() {
    const bombArray = Array(bombCount).fill('bomb');
    const emptyArray = Array(width * height - bombCount).fill('empty');
    let boardArray = emptyArray.concat(bombArray);
    
    boardArray = boardArray.sort(() => Math.random() -0.5);
    
    return boardArray;
}

// Calculate how many bombs empty fields are "touching", implement logic for borderline cases"
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
    
            squares[i].setAttribute('data', total);
        }
    }
}

// Click function 
function click(square) {
    if (gameOver) 
        return;
    if (square.classList.contains('revealed-square') || square.classList.contains('flag'))
        return;

    if (square.classList.contains('bomb')) {
        gameIsOver();
    } else {
        let total = square.getAttribute('data');

        if (total != 0) {
            square.classList.add('revealed-square');
            square.innerHTML = total;
            return;
        }

        revealSquare(square);

        square.classList.add('revealed-square');
    }
}

// Reveal squares with data value '0', with recursion
function revealSquare(square) {
    let currentId = square.id;
    const leftBorder = (currentId % width === 0);
    const rightBorder = (currentId % width === width - 1);

    setTimeout(() => {
        // Checking North direction
        if (currentId > (width - 1)) {
            const newId = parseInt(currentId) - width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Checking East direction
        if (currentId < (width * height - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Checking South direction
        if (currentId < (width * height - width)) {
            const newId = parseInt(currentId) + width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Checking West direction
        if (currentId > 0 && !leftBorder) {
            const newId = parseInt(currentId) -1;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Checking North-East direction
        if (currentId < (width * height - width - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1 + width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        } 
        // Checking South-East direction
        if (currentId > (width - 1) && !rightBorder) {
            const newId = parseInt(currentId) + 1 - width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Checking North-West direction
        if (currentId < (width * height - width) && !leftBorder) {
            const newId = parseInt(currentId) - 1 + width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
        // Checking South-West direction
        if (currentId > width && !leftBorder) {
            const newId = parseInt(currentId) - 1 - width;
            const newSquare = document.getElementById(newId);
            click(newSquare);
        }
    }, 50);
}

// Displays Game Over
function gameIsOver() {
    console.log('BOOOM! Game Over!');
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