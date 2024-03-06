
// grid cells will be refered to using an XY system, 00 is in the top left corner. 
const cells = [
    document.getElementById("100000000"),
    document.getElementById("010000000"),
    document.getElementById("001000000"),
    document.getElementById("000100000"),
    document.getElementById("000010000"),
    document.getElementById("000001000"),
    document.getElementById("000000100"),
    document.getElementById("000000010"),
    document.getElementById("000000001")
]

//This will be used to abort all event listeners after the player has clicked on his cell.
const controller = new AbortController();
console.log(controller)
// the gameboard will be represented by an array of length 9, containing '', 'X' or 'O' 
let gameBoard = ['', '', '', '', '', '', '', '', '']


clearAllCells();

//initialise all cells and make them clickable
for (i = 0; i < 9; i++) {
    cells[i].addEventListener("click", putSymbol(i, 'x'), { signal: controller.signal });
};


function putSymbol(i, symbol) {
    return function putSymbolCallback() {
        cells[i].innerHTML = symbol;
        console.log('putting ' + symbol + ' in cell ' + String(i))
        controller.abort();
        makeMove(i);
    };
}



function clearAllCells() {

}

function makeMove(lastMoveIndex) {

    gameBoard[lastMoveIndex] = 'X'

    // Check if player has won. 


    // DUMB MODE : the computer plays at random 

    let moveIndex = Math.floor(Math.random() * 8);
    while (gameBoard[moveIndex] != '') {
        moveIndex = Math.floor(Math.random() * 8);
    }
    cells[moveIndex].innerHTML = 'o';
    gameBoard[moveIndex] = 'O'


    console.log(gameBoard);
    console.log(controller)
    // make only free cells clickable
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] == '') {
            cells[i].addEventListener("click", putSymbol(i, 'x'));  /// Problem : abort controller can not be re-used. 
            console.log(i);
        }
    }
}