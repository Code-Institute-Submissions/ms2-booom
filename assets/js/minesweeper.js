const board = document.querySelector('.board');
let width = 10; //let's say the game board will be 10*10 squares
let squares = [];

// Create board filled with width*width squares
function createBoard() {
    for(let i = 0; i < width*width; i++) {
        const square = document.createElement('div'); //create width*width squares
        square.setAttribute('id', i);
        board.appendChild(square);
        squares.push(square);
    }
}

createBoard();

