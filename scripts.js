
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



clearAllCells();

//initialise all cells and make them clickable
for (i=0; i<9; i++){
    const targetCell=cells[i] // Apparently needed to pass the element into the addEventListener. I wonder why ? 
    cells[i].addEventListener("click", function() {
        putSymbol(targetCell,'x');  // Breaks if cells[i] is used instead of targetCells
    });
};


function putSymbol(targetCell,symbol){
    targetCell.innerHTML = symbol;
    console.log('putting '+symbol+' in cell'+String(targetCell))
}

function clearAllCells () {

}