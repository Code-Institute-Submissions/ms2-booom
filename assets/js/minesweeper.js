const board = document.querySelector('.board');
let width = 10;
let height = 10;
let bombCount = 10;
let squares = [];
let gameOver = false;

createBoard();

// Create board filled with width*width squares
function createBoard() {
    const shuffledSquares = shuffleSquares();
    console.log(shuffledSquares); // ----------------------------------CONSOLE LOG

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
            console.log(squares[i]); // ------------------------------------------------- CONSOLE LOG
        }
    }
}





// Game over click case
function click(square) {
    if (gameOver) 
        return;
    if (square.classList.contains('revealed-square') || square.classList.contains('flag'))
        return;

    if (square.classList.contains('bomb')) {
        alert('Game Over!'); //----------------------------------------------alert
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

// Reveal squares with data value 0 with recursion
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

