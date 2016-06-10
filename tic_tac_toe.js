// TO DO
// - P2Move AI
// - refactor to use stdin instead of prompt
// - want to play again?
// - pick p1 or p2/ computer vs computer etc.

var prompt = require('prompt');

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

//player one input
function askInput(callback){
  console.log("Pick your move! Please enter a number between 1 & 9.")
    //input validation: must be a number between 1 & 9
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
      throw err;
    }else{
      //check for valid input
      if(getCellByInput(result.input) == EMPTY){
        callback(result.input);
      } else{
        console.warn("This is not a valid move, please choose again.")
        askInput(callback);
      }
    }
  });  
} 

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

//calculate array index from input
function getCellByInput(input){
  return board[Math.ceil(input / board.length) - 1][(input - 1) % board[1].length];
}

//set cell to current player
function setCellByInput(input, val){
  board[Math.ceil(input / board.length) - 1][(input - 1) % board[1].length] = val;
}

// update board with p1 or p2 move 
function updateBoard(board, input){
  var currentPlayer = P1;
  if(turnCount % 2 != 0) {
    currentPlayer = P2;
  }
  //set cell to current player
  setCellByInput(input, currentPlayer);
  return board;
}

//checks for matching cells
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

//create array for both diagonals
function getDiag(board){
  var diagLeft = [];
  var diagRight = [];
  for (var i = 0; i < board.length; i++) {
    diagLeft.push(board[i][i]);
    diagRight.push(board[i][(board.length - 1) - i]);
  }; 
  return [diagLeft, diagRight]
}

//create array for columns
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

//checks if the board is full
function isBoardFull(board) {
  var isFull = true
  board.forEach(function(col){
    if (col.indexOf(EMPTY) > -1){
        return isFull = false;
      }
  });
  return isFull;
}

//checks to see if the game has been won
function gameWon(board){
  // check rows
  board.forEach(function(row){
    if(cellsMatch(row, P1)){
      p1Win = true;
    }
  });
  board.forEach(function(row){
    if(cellsMatch(row, P2)){
      p2Win = true;
    }
  });
  // check cols
  getCols(board).forEach(function(col){
    if(cellsMatch(col, P1)){
      p1Win = true;
    }
  });
   getCols(board).forEach(function(col){
    if(cellsMatch(col, P2)){
      p2Win = true;
    }
  });
  // check diags
  getDiag(board).forEach(function(diag){
    if(cellsMatch(diag, P1)){
      p1Win = true;
    }
  });
  getDiag(board).forEach(function(diag){
    if(cellsMatch(diag, P2)){
      p2Win = true;  
    }
  });
  //check for a tie
  if(isBoardFull(board) && !p1Win && !p2Win){
    console.log("Game over. It is a tie.");
    return true;
  }
  if(p1Win){
    p1WinnerMsg();
  }else if(p2Win){
    p1LoseMsg();
  }
  return p1Win || p2Win;
}

function welcomeMsg(){
  var welcome = [["+-+-+-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+ +-+-+-+-+"],
              ["|W|e|l|c|o|m|e| |t|o| |T|i|c| |T|a|c| |T|o|e|!|"],
              ["+-+-+-+-+-+-+-+ +-+-+ +-+-+-+ +-+-+-+ +-+-+-+-+"]];
  console.log(welcome.join("\n"));
}

function p1WinnerMsg(){
  var youWin = [
    ["  __   __   U  ___ u   _   _                             _   _     _   "],
    ["  \\ \\ / /    \\/\"_ \\/U |\"|u| |  __        __     ___     | \\ |\"|  U|\"|u "],
    ["   \\ V /     | | | | \\| |\\| |  \\\"\\      /\"/    |_\"_|   <|  \\| |> \\| |/ "],
    ["  U_|\"|_u.-,_| |_| |  | |_| |  /\\ \\ /\\ / /\\     | |    U| |\\  |u  |_|  "],
    ["    |_|   \\_)-\\___/  <<\\___/  U  \\ V  V /  U  U/| |\\u   |_| \\_|   (_)  "],
    [".-,//|(_       \\\\   (__) )(   .-,_\\ /\\ /_,-.-,_|___|_,-.||   \\\\,-.|||_ "],
    [" \\_) (__)     (__)      (__)   \\_)-'  '-(_/ \\_)-' '-(_/ (_\")  (_/(__)_)"]];
  console.log(youWin.join("\n"));
}

function p1LoseMsg(){
var youLoseMsg = [["  _,  _, __, __, , _     , _  _, _,_   _,   _,  _, __, "],
                  [" (_  / \\ |_) |_) \\ |     \\ | / \\ | |   |   / \\ (_  |_  "],
                  [" , ) \\ / | \\ | \\  \\| ,    \\| \\ / | |   | , \\ / , ) |  ,"],
                  ["  ~   ~  ~ ~ ~ ~   ) '     )  ~  `~'   ~~~  ~   ~  ~~~~"],
                  ["                  ~'      ~'                           "]];
  console.log(youLoseMsg.join("\n"));

}



//turn function to run game
function turn(board){ 
  //starts the game: draws the board & gives instructions
  if(turnCount === 0){
    welcomeMsg();
    console.log("You are Player One.\nThe spaces on the board are numbered 1 through 9.\nGood luck!\n");
    drawBoard(board);
  }
  //P1 plays on even turns. Asks P1 for input, redraws board and increments turn counter 
  if(turnCount % 2 === 0){
    askInput(function(input){
      console.log("Player one's turn.");
      drawBoard(updateBoard(board, input));
      turnCount += 1;
      //if the game is not won call turn
      if(!gameWon(board)){
        turn(board);
      }
    });
  }
  //P2 plays on odd turns. Generates move from P2, redraws board and increments turn counter
  else if(turnCount % 2 != 0){
    //TODO: add in delay between players turns
    console.log("Player two's turn.");
    setTimeout(function(){
      console.log("Thinking...")
    }, 500);
    setTimeout(function(){
      drawBoard(updateBoard(board, player2Move(board)));
      turnCount += 1;
    //if the game is not won call turn
    if(!gameWon(board)){
        turn(board);
      }
    }, 2000);
    
  }
};
//first call to turn
turn(board);


