

// Boggle is a word-finding game where cubes with letters on each side are randomized
// onto a grid. You must connect adjacent tiles (without repeating the same tile) to
// form words of 3 or more. The game is played for 3 minutes only.


// array of played words
var boggleWords = new Array();
var currentString = "";
//flag for if string is being built currently
var mousedown = 0;
//variables for game timer and timer
var resetsec = 01;
var resetmin = 3;
var sec = 0;
var min = 0;
var countdownTime;
//words from boggleDictionary.js
var dictionaryWords;
// game score
var sum = 0;
// for knowing legal moves
var prevcube;
// for pausing game
var is_pause = false;

// Boggle letters from my Boggle game
var cube1 = new Array('A', 'A', 'A', 'F', 'R', 'S');
var cube2 = new Array('A', 'A', 'E', 'E', 'E', 'E');
var cube3 = new Array('A', 'A', 'F', 'I', 'R', 'S');
var cube4 = new Array('A', 'D', 'E', 'N', 'N', 'N');
var cube5 = new Array('A', 'E', 'E', 'E', 'E', 'M');
var cube6 = new Array('A', 'E', 'E', 'G', 'M', 'U');
var cube7 = new Array('A', 'E', 'G', 'M', 'N', 'N');
var cube8 = new Array('A', 'F', 'I', 'R', 'S', 'Y');
var cube9 = new Array('B', 'J', 'K', 'Q', 'X', 'Z');
var cube10 = new Array('C', 'C', 'E', 'N', 'S', 'T');
var cube11 = new Array('C', 'E', 'I', 'I', 'L', 'T');
var cube12 = new Array('C', 'E', 'I', 'L', 'P', 'T');
var cube13 = new Array('C', 'E', 'I', 'P', 'S', 'T');
var cube14 = new Array('D', 'D', 'H', 'N', 'O', 'T');
var cube15 = new Array('D', 'H', 'H', 'L', 'O', 'R');
var cube16 = new Array('D', 'H', 'L', 'N', 'O', 'R');
var cube17 = new Array('D', 'H', 'L', 'N', 'O', 'R');
var cube18 = new Array('E', 'I', 'I', 'I', 'T', 'T');
var cube19 = new Array('E', 'M', 'O', 'T', 'T', 'T');
var cube20 = new Array('E', 'N', 'S', 'S', 'S', 'U');
var cube21 = new Array('F', 'I', 'P', 'R', 'S', 'Y');
var cube22 = new Array('G', 'O', 'R', 'R', 'V', 'W');
var cube23 = new Array('I', 'P', 'R', 'R', 'R', 'Y');
var cube24 = new Array('N', 'O', 'O', 'T', 'U', 'W');
var cube25 = new Array('O', 'O', 'O', 'T', 'T', 'U');

var grid = new Array(cube1, cube2, cube3, cube4, cube5, cube6, cube7, cube8, cube9, cube10,
					 cube11, cube12, cube13, cube14, cube15, cube16, cube17, cube18, cube19, cube20, cube21, cube22, cube23,cube24,cube25);

//phrases at end of game
var randomPhrase = new Array("Now that's more like it?",
							 "3 more minutes of Boggle? Why not.",
							 "Family game night, here we come!",
							 "Such letters. Very Words.\nWow.",
							 "Is 'boggle' even a word? Try again to see!",
							 "You are boggle champion! Oh yeah.",
							 "Now you know the boggle hype was real!",
							 "Ooooh Ahhhh! What a game!",
							 "BOGGLE 4 EVR DUDE");

// returns a random letter from the cube
function chooseLetter(cube){
	 return cube[Math.floor((Math.random()*6))];
}

// returns a random ordering of cubes in the grid, using the Knuth Shuffle from:
// http://www.htmlblog.us/random-javascript-array
Array.prototype.randomize = function(){
	var i = this.length;
	var j;
	var temp;
	while (--i)
	{
		j = Math.floor( Math.random() * (i - 1));
		temp = this[i];
		this[i] = this[j];
		this[j] = temp;
	}
}

function playAgain(){
	document.getElementById("score_overlay").style.visibility = "hidden";
	document.getElementById("score_screen").style.visibility = "hidden";
	shuffleBoggleGrid();
}

// randomizes board and resets
function shuffleBoggleGrid(){
	clearBoard();
	clearlist();
	grid.randomize();
	var stringOfI;
	for (var i = 1; i < grid.length+1; i++){
		stringOfI = "cube"+i.toString();
		var letter = chooseLetter(grid[i-1]);
		if (letter == 'Q'){letter = "Qu";}
		document.getElementById(stringOfI).textContent = letter;
	}

	//clear out timer if player is wants to play before current game has finished
	if (min >= 0 && sec >= 0){
		window.clearTimeout(countdownTime);
		sec = resetsec;
		min = resetmin;
	}
	sum = 0;
	document.getElementById("currentScore").innerHTML = sum;
	countdownTimer();
	return;
}

// initiate and regulates countdown of game timer
function countdownTimer(){
 	sec--;
  	if (sec == -01) {
   		sec = 59;
   		min = min - 1;
	}
  	else {
   		min = min;
	}
	if (sec <= 9) {
		document.getElementById("countdownTimer").innerHTML = " " + min + ":0" + sec;
	}
	else{
		document.getElementById("countdownTimer").innerHTML  = " " + min + ":" + sec;
	}

	countdownTime = window.setTimeout("countdownTimer();", 1000);

	if (min == 0 && sec == 0) {
		// stop timer and display end game screen
		window.clearTimeout(countdownTime);
		sec = resetsec;
		min = resetmin;
		document.getElementById("score_overlay").style.visibility = "visible";
		document.getElementById("score_screen").style.visibility = "visible";

		// provide game stats
		document.getElementById("score").innerHTML = sum;
		var p = Math.floor( Math.random() * (randomPhrase.length));
		document.getElementById("endMessage").innerHTML = randomPhrase[p];
	}
}

// called when mouse press over unactivated cube --> start of a word
function buildWord(event){
	var cube = event.target;
	if (cube.style.backgroundColor != "orange"){
		cube.style.backgroundColor = "orange";
		currentString = currentString.concat(cube.textContent);
		console.log(currentString);
		prevcube = Number(cube.id.substr(4, cube.id.length-1));
		if (mousedown == 0){mousedown++;}
	}
}

// while in the process of building a word
function buildingWord(event){
	if (mousedown == 1){
		var cube = event.target;
		if (cube.style.backgroundColor != "orange"){
			var currentcube = Number(cube.id.substr(4, cube.id.length-1));
			//if next cube touched is not immediately by last cube, don't do anything
			if (currentcube < prevcube-5 || currentcube > prevcube+5 ||
				currentcube == prevcube-2 || currentcube == prevcube+2 ||
				(prevcube%4 == 0 && currentcube == prevcube-3)||
				((prevcube-1)%4 == 0 && currentcube == prevcube+3)){
				return;
			}
			cube.style.backgroundColor = "orange";
			currentString = currentString.concat(cube.textContent);
			prevcube = currentcube;
			console.log(currentString);
		if (mousedown == 0){mousedown=1;}
		}
	}
}

function submitWord(event){
	if (mousedown == 1){
		// if the word is long enough, add it to the word list
		if (currentString.length >= 3){
			boggleWords.push(currentString);
			var wl = document.getElementById("wordList");
			updateList(boggleWords, wl);
		}
		clearBoard();
	}
}

function clearBoard(){
	var grid = document.getElementById("boggleGrid");
	var cubes = grid.getElementsByTagName("div");
	for (var i=0; i<cubes.length; i++)
	{
     	if (cubes[i].style.backgroundColor != "white"){
     		cubes[i].style.backgroundColor = "white";
     	}
	}
	currentString = "";
	mousedown = 0;
	return;
}

// reset array of played words and clear displayed table of words
function clearlist(){
	boggleWords.length = 0; //empty word list
	var wl = document.getElementById("wordList");
	while (document.getElementById("wordList").hasChildNodes()){
		document.getElementById("wordList").removeChild(document.getElementById("wordList").firstChild);
	}
}

// checks to see if new word is a duplicate, makes all duplicates blue, then adds new word to word list
function updateList(array, wl){
	var duplicate = false;
	var index = array.length-1;
	for (var i = 0, row; row = wl.rows[i]; i++){
		if (row.cells[0].innerHTML == array[index]){
			row.style.color = "#0090b2"; // make previous duplicate blue, too
			duplicate = true;
		}
	}
	var row = wl.insertRow(index);
	row.insertCell(0);
	row.insertCell(1);
	wl.rows[index].cells[0].innerHTML = array[index];

	if (duplicate == true){
		wl.rows[index].style.color = "#0090b2"; // if duplicate, add and make blue, but do not score
		wl.rows[index].cells[1].innerHTML = "/";
	}
	else{
		getScores(wl, index);// not a duplicate, score it, and update current score
		document.getElementById("currentScore").innerHTML = sum;
	}
}

// get score for each word and sum of scores, not optimal
function getScores(wl, index){
	var searchword = wl.rows[index].cells[0].innerHTML.toLowerCase();
	var max = boggleDictionary.length
	for (var i=0; i < boggleDictionary.length; i++){
		if (searchword.charAt(0) > boggleDictionary[i].charAt(0)){
			continue;
		}
		else if (searchword.charAt(0) == boggleDictionary[i].charAt(0)){
			if (searchword == boggleDictionary[i]){
				// score word appropriately if in dictionary
				switch (searchword.length){
          case 1:
					case 2:
				   	wl.rows[index].cells[1].innerHTML = "0";
					  sum += 0;
					  break;
					case 3:
					case 4:
						wl.rows[index].cells[1].innerHTML = "1";
						sum += 1;
						break;
					case 5:
						wl.rows[index].cells[1].innerHTML = "2";
						sum += 2;
						break;
					case 6:
						wl.rows[index].cells[1].innerHTML = "3";
						sum += 3;
						break;
					case 7:
						wl.rows[index].cells[1].innerHTML = "5";
						sum += 5;
						break;
					default:
						wl.rows[index].cells[1].innerHTML = "11";
						sum += 11;
						break;
				}
				return;
			}
		}else{
			wl.rows[index].style.color = "rgb(255, 0, 0)"; // turn it red because
			wl.rows[index].cells[1].innerHTML = "X"; //it isn't a word in dictionary
			return;
		}
	}
}

// pause game appropriately
function pause(){
	if (is_pause == false){
		if (min < resetmin){
			window.clearTimeout(countdownTime);
			is_pause = true;
			if (sec<=9) {
				document.getElementById("time").innerHTML = "\n" + min + ":0" + sec;
			}
			else{
				document.getElementById("time").innerHTML  = "\n" + min + ":" + sec;
			}
			document.getElementById("score_overlay").style.visibility = "visible";
			document.getElementById("pause_screen").style.visibility = "visible";
			return;
		}
	}
	else{
		document.getElementById("score_overlay").style.visibility = "hidden";
		document.getElementById("pause_screen").style.visibility = "hidden";
		is_pause = false;
		countdownTime = window.setTimeout("countdownTimer();", 1000);
	}
}
