const board = document.querySelector('.board');
let width = 10;
let bombCount = 10;
let squares = [];

// Add 'bombs' and 'empty fields' to Array amd shuffle it's value
function shuffleBombs() {
    const bombArray = Array(bombCount).fill('boom');
    const emptyArray = Array(width * width - bombCount).fill('empty');
    let boardArray = emptyArray.concat(bombArray);
    
    boardArray = boardArray.sort(() => Math.random() -0.5);
    console.log(boardArray);
}

// Create board filled with width*width squares
function createBoard() {
    shuffleBombs();

    for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div');
        square.setAttribute('id', i);
        board.appendChild(square);
        squares.push(square);
    }
    
}

createBoard();


