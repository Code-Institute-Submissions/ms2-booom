const board = document.querySelector('.board');
let width = 15;
let height = 10;
let bombCount = 20;
let squares = [];

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

createBoard();

// Game over click case
function click(square) {
    if (square.classList.contains('bomb')) {
        alert('Game Over!'); //----------------------------------------------alert
    } else {
        let total = square.getAttribute('data');

        if (total != 0) {
            square.classList.add('revealed-square');
            square.innerHTML = total;
            return;
        }

        square.classList.add('revealed-square');
    }
}


