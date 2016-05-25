/*
  TODO:
  - Make computer player pick random empty cell
  - Refactor functions to reduce similar code
*/

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

function askInput(){
  var input = window.prompt("Pick your move! Please enter a number between 1 & 9.")
  // console.log("input = " + input);
  //check for valid input
  if(input > 0 && input <= 3){
    if(board[0][input - 1] != EMPTY){
      console.log("This space is occupied, please pick again.");
      return askInput();
    } else {
      return input;
    }
  } 
  if(input > 3 && input <= 6){
    if(board[1][input - 4] != EMPTY){
      console.log("This space is occupied, please pick again.");
      return askInput();
    } else {
      return input;
    }
  }
  if(input > 6 && input <= 9){
    if(board[2][input - 7] != EMPTY){
      console.log("This space is occupied, please pick again.");
      return askInput();
    } else {
      return input;
    }
  } 
  else {
    console.log("Error, invalid input");
    return askInput();
  }
} 

// update board with user input
function updateBoard(board, input){
  if(turnCount % 2 == 0){
    if(input <= 3 && input > 0){
      board[0][input - 1] = P1;
    } else if(input > 3 && input <= 6){
      board[1][input - 4] = P1;
    } else if(input > 6 && input <= 9){
      board[2][input - 7] = P1;
    } 
  } else if(turnCount % 2 != 0){
    if(input <= 3 && input > 0){
      board[0][input - 1] = P2;
    } else if(input > 3 && input <= 6){
      board[1][input - 4] = P2;
    } else if(input > 6 && input <= 9){
      board[2][input - 7] = P2;
    } 
  }
  return board;
}

//turn function 
function turn(board){
  
  if(turnCount === 0){
    //1. draw board
    drawBoard(board);
    //2. give instructions 
    window.alert("Welcome to Tic Tac Toe! You are Player 1. The spaces on the board are numbered 1 through 9. Good luck!");
  }
  //3. on even turns ask for input from player 1 & redraw board 
  if(turnCount % 2 === 0){
    console.log("Player one's turn.");
    drawBoard(updateBoard(board, askInput()));
    turnCount += 1;
    console.log("turnCount = " + turnCount);
  } 
  if(turnCount % 2 != 0){
    console.log("PLayer two's turn.");
    drawBoard(updateBoard(board, player2Move(board)));
    console.log("this is the current board\n" + board);
    turnCount += 1;
    console.log("turnCount = " + turnCount);
  }
}
while(!gameWon(board)){
  turn(board);
};

//computer player
function player2Move(board) {
  var emptySpace = -1; 
  for (var i = 0; i < board.length; i++) {
    emptySpace = board[i].indexOf(EMPTY);
    if(emptySpace > -1){
      emptySpace = (i * 3) + emptySpace + 1;
      break;
    };
  };
  console.log("index of emptySpace = " + emptySpace);
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
  var newArr = [];
  for (var i = 0; i < arr.length; i++) {
    if(arr[i] === val) {
      newArr.push(arr[i])
    }
  };
  if (newArr.length === arr.length){
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

var boardDraw = [[1,2,1],[2,2,1],[1,1,2]];
var boardP1WonRow = [[1,1,1],[2,0,2],[2,0,0]];
var boardP1WonCol = [[1,2,2],[1,0,2],[1,0,0]];
var boardP1WonDiag = [[1,2,0],[2,1,2],[2,2,1]];
var boardP2testing = [[0,1,2], [2,1,2], [0,2,1]];