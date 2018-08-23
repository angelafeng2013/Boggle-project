import React, {Component} from 'react';
import dice from '../lib/dice.json';
import ScoreBoard from './scoreBoard';
import Letter from './letter';

// Base component for Boggle Board
var Board = React.createClass({
  // loads shuffled letters from dice library
  loadLetters: function() {
    var letters = []
    var randomFace;
    var randomDie;
    var usedDice = [];
    // loops through 25 rows of dice in dice.json
    do {
      // chooses a random dice to use from the 25
      randomDie = Math.floor(Math.random() * 25);
      // checks to see if the die was used already
      if (usedDice.indexOf(randomDie) == -1) {
        usedDice.push(randomDie);
        // chooses a random face for the dice to land on
        randomFace = Math.floor(Math.random() * 6);
        // adds the chosen letter to the letters array as an object
        if (dice[randomDie][randomFace] == 'q'){
          letters.push({"letter": "Qu", "key": letters.length, 'enabled': true});
        } else {
          letters.push({"letter": dice[randomDie][randomFace].toUpperCase(),
                        "key": letters.length, 'enabled': true});
        }
      }
    } while (usedDice.length < 25);
    this.setState({letters: letters});
  },
  getInitialState: function() {
    return {reset: false, letters: [], currentWord: "", currentKeys: []};
  },
  componentDidMount: function() {
    this.loadLetters();
  },
  onLetterClick: function (letter, active) {
    var key = "";
    var newCurrentWord = [];
    var newCurrentKeys = this.state.currentKeys.slice(0);
    var letterState = this.state.letters.slice();
    var keepEnabled = []
    // checks to see if the letter was highlighted blue (was active) or not
    // when it was clicked
    if (active) {
      // removes the letter/key from currentWord and currentKeys.
      newCurrentWord = this.state.currentWord.slice(0, -1);
      newCurrentKeys.pop()
      if (letter.letter == "Qu") {
        newCurrentWord = newCurrentWord.slice(0, -1);
        newCurrentKeys.pop()
      }
      key = newCurrentKeys[newCurrentKeys.length-1];
    } else {
      // adds the letter/key to currentWord and currentKeys
      key = letter.key
      newCurrentWord = this.state.currentWord.concat([letter.letter]);
      newCurrentKeys = newCurrentKeys.concat([key]);
    }
    this.setState({currentWord: newCurrentWord, currentKeys: newCurrentKeys})
    // all letters are set to enabled if there are no active/highlighted letters
    if (newCurrentKeys.length == 0) {
      letterState = letterState.map(function(letter) {
        var newLetter = letter;
        newLetter.enabled = true;
        return newLetter;
      });
    } else {
      // checks to see where the letter is located using the key value and sets
      // keepEnabled to surrounding letters
      switch (key % 5) {
        case 0:
          // letter is on the left
          keepEnabled = [key, key-4, key-5, key+1, key+5, key+6];
          break;
        case 4:
        // letter is on the right
          keepEnabled = [key, key-1, key-5, key-6, key+4, key+5];
          break;
        default:
          // letter is in the middle
          keepEnabled = [key, key-1, key-4, key-5, key-6, key+1, key+4,
                         key+5, key+6];
      }
      // letters that are in keepEnabled and are not already in the current word
       // are enabled to be selected
      for (var i=0; i < letterState.length; i++) {
        if (keepEnabled.indexOf(letterState[i].key) != -1 &&
          (newCurrentKeys.indexOf(letterState[i].key) == -1 || i == key)) {
          letterState[i].enabled = true;
        } else {
          letterState[i].enabled = false;
        }
      }
    }
    this.setState({letters: letterState});
  },
  resetLetters: function() {
    // resets all the letters to enabled and clears currentWord and currentKeys
    var letterState = this.state.letters.slice();
    letterState = letterState.map(function(letter) {
        var newLetter = letter;
        newLetter.enabled = true;
        return newLetter;
    });
    this.setState({letters: letterState, reset: !this.state.reset, currentWord: "",
                   currentKeys: []});
  },
  render: function() {
    var letterNodes = this.state.letters.map((letter) => {
      // creates nodes of Letter components from each letter in the letters array
      return (
        <Letter reset={this.state.reset} onClick={this.onLetterClick}
          letter={letter} key={letter.key} enabled={letter.enabled}>
        </Letter>
      );
    });
    return (
      <div>
      <div className="board">
        <div className="innerBoard">
          {letterNodes}
        </div>
      </div>
      <ScoreBoard reset={this.resetLetters} currentWord={this.state.currentWord}/>
      </div>
    )
  }
})

module.exports = Board;
