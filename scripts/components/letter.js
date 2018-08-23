import React, {Component} from 'react';
import classNames from 'classnames';

var Letter = React.createClass({
  handleClick: function () {
    // checks to see if the letter is enabled to be selected or deselected
    if (this.props.enabled) {
      this.setState({active: !this.state.active});
      // calls "onLetterClick" from parent Board component
      this.props.onClick(this.props.letter, this.state.active);
    }
  },
  getInitialState: function() {
    return {active: false};
  },
  componentWillReceiveProps: function(nextProps) {
    // checks to see if the value of property "reset" has changed
    if (this.props.reset != nextProps.reset) {
      // sets "active" to false so the letter is definitely not selected
      this.setState({active: false});
    }
  },
  render: function () {
    // uses classnames module to put two classnames on a component
    var classes = classNames({
      'letters': true,
      // only add the "activeLetter" class if the letter is active
      'activeLetter': this.state.active
    });
    return (
      <div onClick={this.handleClick} className={classes}>
        <div className="text">
          {this.props.letter.letter}
        </div>
      </div>
    )
  }
});

module.exports = Letter;
