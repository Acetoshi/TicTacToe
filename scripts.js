
//TODO : a chaque tour, les fonctions continuent d'exister. 
// pbl : the event listeners multiply in a recursive fashion (ie turn 3 there's 3 eventListeners.)

// A ESSAYER : créer 9 fonction différentes et les utiliser en fonciton de i fonctions (makeTickableCell1, makeTickableCell2)
// element.removeEventListener("mousedown", tickCell1, true);



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
let computerMovesHistory = [];

startGame();
rematchButton.addEventListener("click", startGame);
frontFaceFlipButton.addEventListener("click", flipInterfaceCard);
backFaceFlipButton.addEventListener("click", flipInterfaceCard);


//initialise all cells and make them clickable
function startGame() {
    clearAllCells();
    rematchButton.classList.add("hidden");
    gameBoard = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];
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

function displayGameHistory(gameHistoryArray) {

    //clear the last game history 
    gameHistoryList.innerHTML = " ";

    for (let j = 0; j < gameHistoryArray.length; j++) {

        let ul = document.createElement("ul");
        ul.classList.add('mini-grid');

        for (let i = 0; i < 9; i++) {
            let li = document.createElement("li");
            li.classList.add('mini-cell');
            //Compact if else statement
            li.innerHTML =  (gameHistoryArray[j][i] != '.' ) ? gameHistoryArray[j][i]: '' ;
            ul.appendChild(li);
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
        console.log("game history display requested")
        console.log(gameHistory);
        displayGameHistory(gameHistory);
        return;
    }


    // DUMB MODE : the computer plays at random 
    let moveIndex = randomMove(gameBoard);




    //put in memory what the situation was, and what the game responded.
    computerMovesHistory.push([gameBoard.join('').split(''), moveIndex]);


    cells[moveIndex].innerHTML = 'o';
    gameBoard[moveIndex] = 'O'

    //add the game state to gameHistory
    console.log(gameBoard)
    gameHistory.push(gameBoard.join('').split(''));

    /// here add a trigger to animate the ticking of the computer
    cells[moveIndex].classList.add('ticked-by-computer');
    /// seems like there's no sleep function in js, so i found this one online
    sleep(200).then(() => { cells[moveIndex].classList.remove('ticked-by-computer'); });

    //Check if computer has won 
    if (hasTheGameEnded(gameBoard) != 0) {
        //Make rematch button appear
        rematchButton.classList.remove("hidden");
        console.log("game history display requested")
        displayGameHistory(gameHistory);
        return;
    }



    // make only free cells clickable
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] === '.') {
            makeCellTickable(i)
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
    let computerMoves = '';
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] == 'O') {
            computerMoves += String(i);
        }
    }
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

