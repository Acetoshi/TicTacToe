
// grid cells will be refered to using this layout :  
//  0 1 2
//  3 4 5
//  6 7 8

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

//This will be used to abort all event listeners after the player has clicked on his cell, so one for each turn
let controller = new AbortController();


// the gameboard will be represented by an array of length 9, containing '', 'X' or 'O' 
let gameBoard = ['', '', '', '', '', '', '', '', ''];

startGame();

//initialise all cells and make them clickable
function startGame() {
    controller = new AbortController();
    gameBoard = ['', '', '', '', '', '', '', '', ''];
    for (i = 0; i < 9; i++) {
        cells[i].addEventListener("click", putSymbol(i, 'x'), { signal: controller.signal });
    };
}

// Callback function for the evenlisteners.
function putSymbol(i, symbol) {
    return function putSymbolCallback() {
        cells[i].innerHTML = symbol;
        console.log('putting ' + symbol + ' in cell ' + String(i))
        controller.abort();
        makeMove(i);
    };
}



function makeMove(lastMoveIndex) {

    gameBoard[lastMoveIndex] = 'X'

    // Check if player has won. 
    if (hasTheGameEnded(gameBoard) == 1) {
        console.log("bien ouèj maggle")
        return;
    }


    // DUMB MODE : the computer plays at random 

    let moveIndex = Math.floor(Math.random() * 8);
    while (gameBoard[moveIndex] != '') {
        moveIndex = Math.floor(Math.random() * 8);
    }
    cells[moveIndex].innerHTML = 'o';
    gameBoard[moveIndex] = 'O'


    console.log(gameBoard);
    console.log(controller)
    controller = new AbortController();
    // make only free cells clickable
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] == '') {
            cells[i].addEventListener("click", putSymbol(i, 'x', { signal: controller.signal }));  /// Problem : abort controller can not be re-used. 
            console.log(i);
        }
    }
}


//This function checks if the game isn't finished (0) has been won(1), lost(2), or if it's a draw.
function hasTheGameEnded(gameBoard) {
    //  0 1 2
    //  3 4 5
    //  6 7 8
    //const winConditions = ['012', '345', '678','036', '147', '258', '048', '264']
    const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 6, 4]]

    //First, convert all the moves of the player to a string, made of the indexes of where he/she has played
    let playerMoves = '';
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] == 'X') {
            playerMoves += String(i);
        }
    }

    //Then check for every winning condition if he/she meets it. 
    let playerHasWon = false;
    for (i = 0; i < 8; i++) {
        if (playerMoves.includes(String(winConditions[i][0])) && playerMoves.includes(String(winConditions[i][1])) && playerMoves.includes(String(winConditions[i][2]))) {
            console.log("c'est win maggle")
            return 1;
        }
    }

    // If no end gmae condition is met, the game continues.
    return 0;
}