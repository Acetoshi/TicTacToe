
//TODO : finaliser la factorisation de 'whoHasWon' (manquent les couleurs) et remplacer 'has the game ended'



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

// Declaration of buttons on the page
const interfaceCard = document.getElementById("interface");
const rematchButton = document.getElementById("rematch-button");
const backFaceFlipButton = document.getElementById("back-face-flip-button");
const frontFaceFlipButton = document.getElementById("front-face-flip-button");
const gameHistoryList = document.getElementById("game-history");



// the gameboard will be represented by an array of length 9, containing '.', 'X' or 'O' 
let gameBoard = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];

// this is an array that will store the whole game, all of the board states and the computer responses. 
let gameHistory = [];

// this stores every situation the game has encountered
let computerDatabase = [];



startGame();
rematchButton.addEventListener("click", startGame);
frontFaceFlipButton.addEventListener("click", flipInterfaceCard);
backFaceFlipButton.addEventListener("click", flipInterfaceCard);

// this function take a computerMovesHistory array to analyse it, and adjust the corresponding weights in the dataBase object
function analyseGame(gameHistory, initialWeigth) {

    let resultOfTheGame = whoHasWon(gameHistory[gameHistory.length - 1], 'X', 'O')[0];
    console.log(resultOfTheGame);
    //console.log(resultOfTheGame);
    // first check if there was a new situation
    for (let i = 0; i < gameHistory.length; i++) {
        if (containsSimilar (computerDatabase,gameHistory[i])){

        } else {
            //add the gamestate to the database and add new weights to it
            computerDatabase.push([gameHistory[i],[0,2,2,2]]);
        }
    }
    console.log(computerDatabase)

    

    // if the situation isn't new, adjust existing weights
}

// this function takes an array of arrays, and an array
function containsSimilar(arrayA, arrayB) {
    for (let i = 0; i < arrayA.length; i++) {
        if (arrayA[i] === arrayB) {
            return true;
        }

    }
    return false;
}


function displayGameHistory(gameHistoryArray) {

    //clear the last game history in the HTML file
    gameHistoryList.innerHTML = " ";

    for (let j = 0; j < gameHistoryArray.length; j++) {

        let ul = document.createElement("ul");
        ul.classList.add('mini-grid');
        let resultOfTheGame = whoHasWon(gameHistoryArray[j], 'X', 'O');


        /// this part is badly coded and can propably be refactored. 

        //player has won
        if (resultOfTheGame[0] == 1) {
            for (let i = 0; i < 9; i++) {
                let li = document.createElement("li");
                li.classList.add('mini-cell');
                if (i == resultOfTheGame[1][0] || i == resultOfTheGame[1][1] || i == resultOfTheGame[1][2]) {
                    li.classList.add('losing-cell');
                }
                //Compact if else statement
                li.innerHTML = (gameHistoryArray[j][i] != '.') ? gameHistoryArray[j][i] : '';
                ul.appendChild(li);
            }
        }
        //computer has won
        else if (resultOfTheGame[0] == 2) {
            for (let i = 0; i < 9; i++) {
                let li = document.createElement("li");
                li.classList.add('mini-cell');
                if (i == resultOfTheGame[1][0] || i == resultOfTheGame[1][1] || i == resultOfTheGame[1][2]) {
                    li.classList.add('winning-cell');
                }
                //Compact if else statement
                li.innerHTML = (gameHistoryArray[j][i] != '.') ? gameHistoryArray[j][i] : '';
                ul.appendChild(li);
            }
        }
        // nobody has won this turn
        else {
            for (let i = 0; i < 9; i++) {
                let li = document.createElement("li");
                li.classList.add('mini-cell');
                //Compact if else statement
                li.innerHTML = (gameHistoryArray[j][i] != '.') ? gameHistoryArray[j][i] : '';
                ul.appendChild(li);
            }
        }
        gameHistoryList.appendChild(ul);
    }
}


// This functions probes the state of the page, and applies "hidden" class to the other one.
function flipInterfaceCard() {
    interfaceCard.classList.toggle('is-flipped');
}

function makeMove(lastMoveIndex) {

    gameBoard[lastMoveIndex] = 'X'
    //add the game state to gameHistory
    gameHistory.push(gameBoard.join('').split('')); // i have to use join and split to get a new instance of the gameBOard array, otherwise the history shows only one state later

    // Check if player has won. 
    if (hasTheGameEnded(gameBoard) != 0) {
        //Make rematch button appear
        rematchButton.classList.remove("hidden");
        displayGameHistory(gameHistory);
        analyseGame(gameHistory, 2);
        return;
    }


    // DUMB MODE : the computer plays at random 
    let moveIndex = randomMove(gameBoard);

    //display computer move on the board
    cells[moveIndex].innerHTML = 'o';
    gameBoard[moveIndex] = 'O'

    //add the game state to gameHistory
    gameHistory.push(gameBoard.join('').split(''));

    /// adding this clas triggers an animation to communicate the ticking of the computer
    cells[moveIndex].classList.add('ticked-by-computer');
    /// seems like there's no sleep function in js, so i found this one online
    sleep(200).then(() => { cells[moveIndex].classList.remove('ticked-by-computer'); });

    //Check if computer has won 
    if (hasTheGameEnded(gameBoard) != 0) {
        //Make rematch button appear
        rematchButton.classList.remove("hidden");
        displayGameHistory(gameHistory);
        analyseGame(gameHistory, 2);
        return;
    }

    // make only free cells clickable
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] === '.') {
            makeCellTickable(i)
        }
    }
}

function getMoves(gameBoard, playerSymbol) {
    let Moves = '';
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] == playerSymbol) {
            Moves += String(i);
        }
    }
    return Moves;
}

//This function checks who has won : no one(0), player1 (1), player2 (2), or draw(3). it also returns the winning moves indexes [a,b,c] returns looks like [x,[a,b,c]]
function whoHasWon(gameBoard, player1Symbol, player2Symbol) {
    const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 6, 4]];
    let player1Moves = getMoves(gameBoard, player1Symbol);
    let player2Moves = getMoves(gameBoard, player2Symbol);
    //Check for wincons in the two player moves at the same time, cause they can't win at the same time.
    for (i = 0; i < 8; i++) {
        if (player1Moves.includes(String(winConditions[i][0])) && player1Moves.includes(String(winConditions[i][1])) && player1Moves.includes(String(winConditions[i][2]))) {
            return [1, winConditions[i]];
        }
        if (player2Moves.includes(String(winConditions[i][0])) && player2Moves.includes(String(winConditions[i][1])) && player2Moves.includes(String(winConditions[i][2]))) {
            return [2, winConditions[i]];
        }
    }
    //Check for a draw

    let numberOfMoves = 0;
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] != '.') {
            numberOfMoves += 1;
        }
    }
    if (numberOfMoves >= 9) {
        return [3, []];
    }


    // If no end gmae condition is met, the game continues.
    return [0, []];
}


//This function checks if the game isn't finished (0) has been won(1), lost(2), or if it's a draw(3).
function hasTheGameEnded(gameBoard) {
    //  0 1 2
    //  3 4 5
    //  6 7 8

    const winConditions = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 6, 4]]

    //First, convert all the moves of the player to a string, made of the indexes of where he/she has played
    let playerMoves = getMoves(gameBoard, 'X');

    //Then check for every winning condition if he/she meets it. 
    for (i = 0; i < 8; i++) {
        if (playerMoves.includes(String(winConditions[i][0])) && playerMoves.includes(String(winConditions[i][1])) && playerMoves.includes(String(winConditions[i][2]))) {
            // apply 'winning-cell' to all win conditions that were met
            cells[winConditions[i][0]].classList.add("winning-cell");
            cells[winConditions[i][1]].classList.add("winning-cell");
            cells[winConditions[i][2]].classList.add("winning-cell");

            return 1;
        }
    }
    // Same thing for the computer
    let computerMoves = getMoves(gameBoard, 'O');

    //Then check for every winning condition if he/she meets it. 
    for (i = 0; i < 8; i++) {
        if (computerMoves.includes(String(winConditions[i][0])) && computerMoves.includes(String(winConditions[i][1])) && computerMoves.includes(String(winConditions[i][2]))) {

            // apply 'winning-cell' to all win conditions that were met
            cells[winConditions[i][0]].classList.add("losing-cell");
            cells[winConditions[i][1]].classList.add("losing-cell");
            cells[winConditions[i][2]].classList.add("losing-cell");

            return 2;
        }
    }
    // Check for a Draw
    let numberOfMoves = 0;
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] != '.') {
            numberOfMoves += 1;
        }
    }
    if (numberOfMoves >= 9) {
        return 3;
    }


    // If no end gmae condition is met, the game continues.
    return 0;
}

//initialise all cells and make them clickable
function startGame() {

    clearAllCells();
    rematchButton.classList.add("hidden");
    gameBoard = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
    gameHistory = [];

    for (i = 0; i < 9; i++) {
        makeCellTickable(i);
        cells[i].classList.remove("winning-cell");
        cells[i].classList.remove("losing-cell");
    };
}


function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


function randomMove(gameBoard) {
    let moveIndex = Math.floor(Math.random() * 8);
    while (gameBoard[moveIndex] != '.') {
        moveIndex = Math.floor(Math.random() * 8);
    }
    return moveIndex;
}

function clearAllCells() {
    for (i = 0; i < 9; i++) {
        cells[i].innerHTML = '';
    }
}



// Callback function for the evenlisteners.
function putSymbol(i, symbol) {
    return function putSymbolCallback() {
        cells[i].innerHTML = symbol;
        controller.abort();
        makeMove(i);
    };
}

function MakeTickableCell0() {
    cells[0].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(0);
};
function MakeTickableCell1() {
    cells[1].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(1);
};
function MakeTickableCell2() {
    cells[2].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(2);
};
function MakeTickableCell3() {
    cells[3].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(3);
};
function MakeTickableCell4() {
    cells[4].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(4);
};

function MakeTickableCell5() {
    cells[5].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(5);
};

function MakeTickableCell6() {
    cells[6].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(6);
};

function MakeTickableCell7() {
    cells[7].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(7);
};

function MakeTickableCell8() {
    cells[8].innerHTML = 'x';
    removeAllEventListeners();
    makeMove(8);
};


function removeAllEventListeners() {
    cells[0].removeEventListener("click", MakeTickableCell0);
    cells[1].removeEventListener("click", MakeTickableCell1);
    cells[2].removeEventListener("click", MakeTickableCell2);
    cells[3].removeEventListener("click", MakeTickableCell3);
    cells[4].removeEventListener("click", MakeTickableCell4);
    cells[5].removeEventListener("click", MakeTickableCell5);
    cells[6].removeEventListener("click", MakeTickableCell6);
    cells[7].removeEventListener("click", MakeTickableCell7);
    cells[8].removeEventListener("click", MakeTickableCell8);

    for (i = 0; i < 9; i++) {
        cells[i].classList.remove("clickable");
    }
}

function makeCellTickable(cellIndex) {
    switch (cellIndex) {
        case 0:
            cells[0].addEventListener("click", MakeTickableCell0,);
            cells[0].classList.add("clickable");
            break;
        case 1:
            cells[1].addEventListener("click", MakeTickableCell1,);
            cells[1].classList.add("clickable");
            break;
        case 2:
            cells[2].addEventListener("click", MakeTickableCell2,);
            cells[2].classList.add("clickable");
            break;
        case 3:
            cells[3].addEventListener("click", MakeTickableCell3,);
            cells[3].classList.add("clickable");
            break;
        case 4:
            cells[4].addEventListener("click", MakeTickableCell4);
            cells[4].classList.add("clickable");
            break;
        case 5:
            cells[5].addEventListener("click", MakeTickableCell5);
            cells[5].classList.add("clickable");
            break;
        case 6:
            cells[6].addEventListener("click", MakeTickableCell6);
            cells[6].classList.add("clickable");
            break;
        case 7:
            cells[7].addEventListener("click", MakeTickableCell7);
            cells[7].classList.add("clickable");
            break;
        case 8:
            cells[8].addEventListener("click", MakeTickableCell8);
            cells[8].classList.add("clickable");
            break;
        default:
            return;
    }
}

