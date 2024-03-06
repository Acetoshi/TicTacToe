
// grid cells will be refered to using an XY system, 00 is in the top left corner. 
const cell00 = document.getElementById("100000000");
const cell10 = document.getElementById("010000000");
const cell20 = document.getElementById("001000000");
const cell01 = document.getElementById("000100000");
const cell11 = document.getElementById("000010000");
const cell21 = document.getElementById("000001000");
const cell02 = document.getElementById("000000100");
const cell12 = document.getElementById("000000010");
const cell22 = document.getElementById("000000001");


clearAllCells();

cell00.addEventListener("click", putSymbol(cell00,'x'));
cell10.addEventListener("click", putSymbol(cell10,'x'));
cell20.addEventListener("click", putSymbol(cell20,'x'));
cell01.addEventListener("click", function () {
    cell01.innerHTML = 'o';
});

function putSymbol(cell,symbol){
    cell.innerHTML = symbol;
    console.log('clicked cell00')
}

function clearAllCells () {
    putSymbol(cell00,'');
    putSymbol(cell10,'');
    putSymbol(cell20,'');
    putSymbol(cell01,'');
    putSymbol(cell11,'');
    putSymbol(cell21,'');
    putSymbol(cell02,'');
    putSymbol(cell12,'');
    putSymbol(cell22,'');
}