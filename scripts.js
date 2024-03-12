
//TODO : finaliser la factorisation de 'whoHasWon' (manquent les couleurs) et remplacer 'has the game ended'

//TODO : if sum is 0, fallback to a random move
//TODO : 0 can be selected as move !!

// grid cells will be referred to using this layout :  
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
const dataBaseList = document.getElementById("database");



// the game board will be represented by an array of length 9, containing '.', 'X' or 'O' 
let gameBoard = ['.', '.', '.', '.', '.', '.', '.', '.', '.'];

// this is an array that will store the whole game, all of the board states and the computer responses. 
let gameHistory = [];

// this stores every situation the game has encountered
let computerDataBase = [];



startGame();

rematchButton.addEventListener("click", startGame);
frontFaceFlipButton.addEventListener("click", flipInterfaceCard);
backFaceFlipButton.addEventListener("click", flipInterfaceCard);



// this function take a computerMovesHistory array to analyze it, and adjust the corresponding weights in the dataBase object

function analyzeGame(gameHistory, initialWeigth, winningBonus, losingPenalty) {

    let resultOfTheGame = whoHasWon(gameHistory[gameHistory.length - 1], 'X', 'O')[0];
    //console.log(resultOfTheGame);
    let computerMovesHistory = convertToComputerMovesHistory (gameHistory);
    // first check if there was a new situation
    computerMovesHistory.forEach(gameBoard => {
        // this map operation removes the 'M' so that we get the situation the computer was responding to.
        initialGameBoard=gameBoard.map(string => (string != 'M')? string:'.');
        // check if the situation is NOT in the database ( the toString is needed to compare arrays)
        if ((computerDataBase.some(element => removeWeigths(element).toString() === initialGameBoard.toString()))==false){
            // add the initial situation to the DB
            // the weight system could be optimized to take symmetry into account
            const newDataBaseEntry = initialGameBoard.map(string => (string != '.')? string: initialWeigth);
            computerDataBase.push(newDataBaseEntry);
        } 
        // After the if, we are sure that the gameBoard is known in the database, so now we need to adjust the weights
        
        //Step 1 : find the database entry that corresponds to the situation
        let dataBaseEntryToModify = computerDataBase[indexOfMatch(computerDataBase,initialGameBoard)];

        //Step 2 : identify how the computer has responded ( its move index, 'M')
        let computerResponseIndex = gameBoard.indexOf('M');

        //Step 3 : Increase/decrease the weight based on the result of the game
        //case player wins
        if (resultOfTheGame == 1){
            (dataBaseEntryToModify[computerResponseIndex]>=1)?dataBaseEntryToModify[computerResponseIndex] -= losingPenalty:0;
        } else if (resultOfTheGame == 2 || resultOfTheGame==3){
            dataBaseEntryToModify[computerResponseIndex] = dataBaseEntryToModify[computerResponseIndex] + winningBonus;
        }
        
    });
    displayDataBase (computerDataBase);
    console.log(computerDataBase[1]);
}

function checkDataBaseForMove (gameBoard) {

    // Check if the current situation is known
    if ((computerDataBase.some(element => removeWeigths(element).toString() === gameBoard.toString()))){
        // find the appropriate 
        let relevantDataBaseEntry = computerDataBase[indexOfMatch(computerDataBase,gameBoard)];
        
        return chooseIndexByWeigth (relevantDataBaseEntry);

    } else {
        // if situation isn't known, return a random move
        return randomMove(gameBoard);
    }
}


function chooseIndexByWeigth (dataBaseEntry){
    let randomNumber = Math.floor(Math.random() * totalWeights(dataBaseEntry));
    console.log("random number :",randomNumber)
    let localSumOfWeights = 0;
    for (let i = 0; i < 9; i++) {
        if (typeof dataBaseEntry[i] == 'number') {
            if (dataBaseEntry[i] + localSumOfWeights >= randomNumber) {
    
                return i;
            } else { localSumOfWeights += dataBaseEntry[i] }
        }
    }
}

function totalWeights(dataBaseEntry){
    let totalWeights =0;
    for (let i=0;i<9;i++){
        if (typeof dataBaseEntry[i] =='number'){
            totalWeights += dataBaseEntry[i];
        }
    }
    return totalWeights;
}

function indexOfMatch(arrayOfArrays,array) {

    for(let i=0; i < arrayOfArrays.length; i++){
        if (removeWeigths(arrayOfArrays[i]).toString()===array.toString()){
            return i;
        }
    }
    //if array isn't found
    return null;
}

function displayDataBase (computerDataBase){
    //clear the last game history in the HTML file
    dataBaseList.innerHTML = " ";

    for (let j = 0; j < computerDataBase.length; j++) {

        let ul = document.createElement("ul");
        ul.classList.add('mini-grid');

            for (let i = 0; i < 9; i++) {
                let li = document.createElement("li");
                li.classList.add('mini-cell');
                //Compact if else statement
                li.innerHTML = (computerDataBase[j][i] != '.') ? computerDataBase[j][i] : '';
                ul.appendChild(li);
            }

            dataBaseList.appendChild(ul);
    }
}

function removeWeigths (DataBaseEntry) {
 return DataBaseEntry.map( string => (string === 'X'||string==='O')? string:'.' )
}

function lastMoveIndex(gameBoardA,gameBoardB){
    for(let i=0;i<9;i++){
        if (gameBoardA[i] != gameBoardB[i]){
            return i;
        }
    }
}

function countComputerMoves(gameHistory){
    let count = 0;
    gameHistory.forEach(element => {
        count = (lastPlayer(element,'X','O')=='O')? count +1 : count;
    });
    return count;
}

function lastPlayer(gameBoard,symbol1,symbol2) {
    const player1Moves = gameBoard.filter(symbol => symbol!= '.');
    const player1NumberOfMoves = player1Moves.length
    return (player1NumberOfMoves % 2 == 0)?symbol2:symbol1;
}

function convertToComputerMovesHistory (gameHistory) {
    let computerMovesHistory=[];
    let numberOfComputerMoves = countComputerMoves(gameHistory);
    for (let i = 0; i < (numberOfComputerMoves*2)-1; i++) {
        // if the last move was human
        if (lastPlayer(gameHistory[i],'X','O')=='X'){
            // get the index of the next computer move
            let nextComputerMove = lastMoveIndex(gameHistory[i],gameHistory[i+1])
            // make a copy of the array
            let compressedGameBoard = [...gameHistory[i]]
            //the letter M represents the decision of the computer at this state of the game
            compressedGameBoard[nextComputerMove]='M'
            computerMovesHistory.push(compressedGameBoard);
        }

    }
    return computerMovesHistory;
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
        analyzeGame(gameHistory, 5,3,1);
        return;
    }


    // DUMB MODE : the computer plays at random 
    let moveIndex = checkDataBaseForMove(gameBoard);

    //display computer move on the board
    cells[moveIndex].innerHTML = 'o';
    gameBoard[moveIndex] = 'O'

    //add the game state to gameHistory
    gameHistory.push(gameBoard.join('').split(''));

    

    /// adding this class triggers an animation to communicate the ticking of the computer
    cells[moveIndex].classList.add('ticked-by-computer');
    /// seems like there's no sleep function in js, so i found this one online
    sleep(200).then(() => { cells[moveIndex].classList.remove('ticked-by-computer'); });

    //Check if computer has won 
    if (hasTheGameEnded(gameBoard) != 0) {
        //Make rematch button appear
        rematchButton.classList.remove("hidden");
        displayGameHistory(gameHistory);
        analyzeGame(gameHistory, 5,3,1);
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