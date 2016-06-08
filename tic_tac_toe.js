// TO DO
// - P2Move AI
// - refactor code?
// - move functions around (more organized)
// - wrap in an ASEF (Anonymous Self-Executing Function)
// - make display in the browser window OR run as a node script

var board = [[0,0,0],[0,0,0],[0,0,0]];

var EMPTY = 0;
var P1 = 1;
var P2 = 2;

var p1Win = false;
var p2Win = false;

var turnCount = 0;

//draw board
function drawBoard(board){
    console.log(board.map(function(col){
    return col.map(function(cell){
      if (cell === EMPTY) {
        return " ";
      }
      if (cell === P1) {
        return "X";
      }
      if (cell === P2) {
        return "O";
      }
    }).join("|"); 
  }).join("\n-----\n"));
}

//calculate array index from input
function getCellByInput(input){
  return board[Math.ceil(input / board.length) - 1][(input - 1) % board[1].length];
}

//set cell to current player
function setCellByInput(input, val){
  board[Math.ceil(input / board.length) - 1][(input - 1) % board[1].length] = val;
}

var prompt = require('prompt');

function askInput(callback){
  console.log("Pick your move! Please enter a number between 1 & 9.")
    var schema = {
    properties: {
      input: {
        pattern: /^[1-9]$/,
        message: 'Input must be a number between 1 & 9.',
        required: true
      }
    }
  };
  prompt.start();
   prompt.get(schema, function (err, result) {
    if (err){ 
      return onErr(err);
    } else {
      console.log("input is: " + result.input);
      callback(result.input);
      // return result.input;
    }
  });
  
} 

// update board with user input
function updateBoard(board, input){
  var currentPlayer = P1;
  if(turnCount % 2 != 0) {
    currentPlayer = P2;
  }
  //set cell to current player
  setCellByInput(input, currentPlayer);
  return board;
}

//turn function 
function turn(board){ 
  //if it is the start of the game: draw board & give instructions
  if(turnCount === 0){
    drawBoard(board);
    console.log("Welcome to Tic Tac Toe! You are Player 1. The spaces on the board are numbered 1 through 9. Good luck!");
  }
  //P1 plays on even turns. Ask P1 for input, redraw board and increment turn counter 
  if(turnCount % 2 === 0){
    askInput(function(input){
      console.log("Player one's turn.");
      drawBoard(updateBoard(board, input));
      turnCount += 1;
      console.log("turnCount = " + turnCount);
      console.log("board = " + board);

      if(!gameWon(board)){
        turn(board);
      }
    });
  }
  //P2 plays on odd turns. Generate move from P2, redraw board and increment turn counter
  else if(turnCount % 2 != 0){
    console.log("PLayer two's turn.");
    drawBoard(updateBoard(board, player2Move(board)));
    turnCount += 1;
    console.log("turnCount = " + turnCount);
    if(!gameWon(board)){
        turn(board);
      }
  }
};

turn(board);

//computer player
function player2Move(board) {
  var emptySpaces = [] 
  var emptySpace = -1;
  for (var i = 0; i < board.length; i++) {
    emptySpace = board[i].indexOf(EMPTY);
    if(emptySpace > -1){
      emptySpaces.push((i * 3) + emptySpace + 1);
    };
  };
  emptySpace = emptySpaces[Math.floor(Math.random() * (emptySpaces.length))];
  return emptySpace;
}

//check for a tie (board being full)
function isBoardFull(board) {
  var isFull = true
  board.forEach(function(col){
    if (col.indexOf(EMPTY) > -1){
        return isFull = false;
      }
  });
  return isFull;
}

// check for all cells matching
function cellsMatch(arr, val) {
  var testArr = [];
  for (var i = 0; i < arr.length; i++) {
    if(arr[i] === val) {
      testArr.push(arr[i])
    }
  };
  if (testArr.length === arr.length){
    return true;
  }
  return false;
}

function getDiag(board){
  var diagLeft = [];
  var diagRight = [];
  for (var i = 0; i < board.length; i++) {
    diagLeft.push(board[i][i]);
    diagRight.push(board[i][(board.length - 1) - i]);
  }; 
  return [diagLeft, diagRight]
}

function getCols(board){
  var colArr = [];
  for(var i = 0; i < board.length; i++){
    var newArr = [];
    for (var j = 0; j < board.length; j++) {
      var newElmt = board[j][i];
      newArr.push(newElmt);
    }
    colArr.push(newArr);
  }
  return colArr;
}

function gameWon(board){
  // check row
  board.forEach(function(row){
    if(cellsMatch(row, P1)){
      p1Win = true;
      console.log("Game over. Player one, you win!");
    }
  });
  board.forEach(function(row){
    if(cellsMatch(row, P2)){
      p2Win = true;
      console.log("Game over. Player two, you win!");
    }
  });
  // check col
  getCols(board).forEach(function(col){
    if(cellsMatch(col, P1)){
      p1Win = true;
      console.log("Game over. Player one, you win!")
    }
  });
   getCols(board).forEach(function(col){
    if(cellsMatch(col, P2)){
      p2Win = true;
      return "Game over. Player two, you win!";
    }
  });
  // check diag
  getDiag(board).forEach(function(diag){
    if(cellsMatch(diag, P1)){
      p1Win = true;
      console.log("Game over. Player one, you win!")
    }
  });
  getDiag(board).forEach(function(diag){
    if(cellsMatch(diag, P2)){
      p2Win = true;
      console.log("Game over. Player two, you win!");
    }
  });
  //check for a tie
  if(isBoardFull(board)){
    console.log("Game over. It is a tie.");
    return true;
  }
  return p1Win || p2Win;
}

// var boardDraw = [[1,2,1],[2,2,1],[1,1,2]];
// var boardP1WonRow = [[1,1,1],[2,0,2],[2,0,0]];
// var boardP1WonCol = [[1,2,2],[1,0,2],[1,0,0]];
// var boardP1WonDiag = [[1,2,0],[2,1,2],[2,2,1]];
// var boardP2testing = [[0,1,2], [2,1,2], [0,2,1]];