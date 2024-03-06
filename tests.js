let gameBoard = ['', '', '', 'X', 'X', 'X', '', 'X', '']


function hasTheGameEnded(gameBoard) {
    //  0 1 2
    //  3 4 5
    //  6 7 8
    //const winConditions = ['012', '345', '678','036', '147', '258', '048', '264']
    const winConditions = [[0,1,2], [3,4,5], [6,7,8],[0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,6,4]]

    //First, convert all the moves of the player to a string, made of the indexes of where he/she has played
    let playerMoves = '';
    for (i = 0; i < 9; i++) {
        if (gameBoard[i] == 'X') {
            playerMoves += String(i);
        }
    }

    //Then check for every winning condition if he/she meets it. 
    let playerHasWon = false;
    for (i = 0; i < 8; i++){
       if (playerMoves.includes(String(winConditions[i][0])) && playerMoves.includes(String(winConditions[i][1]))&&playerMoves.includes(String(winConditions[i][2])) ){
        console.log("c'est win maggle")
        return 1;
       }
    }

    // If no end gmae condition is met, the game continues.
    return 0;
}

hasTheGameEnded(gameBoard);