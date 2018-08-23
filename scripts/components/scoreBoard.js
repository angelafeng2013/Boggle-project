import React, {Component} from 'react';
import Dictionary from '../lib/dict.json';
import searchArray from '../lib/utils';

var ScoreBoard = React.createClass({
  getInitialState: function() {
    return {scoredWords: [], totalScore: 0};
  },
  scoreWord: function() {
    var lowerCaseWord = this.props.currentWord.toLowerCase();
    var currentScoredWords = this.state.scoredWords.slice(0);
    // checks to see if the submited word is in dict.json and has not already been submited
    if (Dictionary.indexOf(lowerCaseWord) != -1 && !searchArray(currentScoredWords, lowerCaseWord)) {
      var score = 0;
      var totalScore = this.state.totalScore.valueOf();
      // sets the score based on how long the submitted word is
      switch (lowerCaseWord.length) {
        case 1:
          score = 0;
          break;
        case 2:
          score = 0;
          break;
        case 3:
          score = 1;
          break;
        case 4:
          score = 1;
          break;
        case 5:
          score = 2;
          break;
        case 6:
          score = 3;
          break;
        case 7:
          score = 5;
          break;
        default:
          score = 11;
      }
      totalScore += score;
      currentScoredWords.push({word: lowerCaseWord, score: score});
      this.setState({scoredWords: currentScoredWords, totalScore: totalScore});
    }
    this.props.reset();
  },
  render: function () {
    // creates displays for each word in scoredWords
    var wordNodes = this.state.scoredWords.map((word, index) => {
        var key = index + 892349;
        return (
          <div className="newRow" key={key}>
            <div className="leftScore" key={word.word}>{word.word}</div>
            <div className="rightScore" key={index}>{word.score}</div>
          </div>
        );
    });
    return (
      <div>
        <div className="currentWord">
          <strong>Current Word:</strong> {this.props.currentWord.toUpperCase()}
          <button className="submit" onClick={this.scoreWord}>Submit Word</button>
        </div>
        <div className="scoreBoard">
          <strong>
            <div className="leftScore"> Word </div>
            <div className="rightScore"> Score </div>
          </strong>
          {wordNodes}
          <div className="totalScore">
            <div className="leftScore"> Total: </div>
            <div className="rightScore">{this.state.totalScore}</div>
          </div>
        </div>
      </div>
    )
  }
});

module.exports = ScoreBoard;
