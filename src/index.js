import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

  function Square(props) {
    const bgColor = (props.isWinner) ? 'green' : 'transparent';

    return (
      <button 
        className="square" 
        onClick={props.onClick}
        style={{backgroundColor: bgColor}}>
        {props.value}
      </button>
    );
  }
  
  class Board extends React.Component {
    renderSquare(i) {
      const ids = [0, 1, 2, 3, 4, 5, 6, 7, 8]

      const squares = ids.slice(i, i + 3).map((squareId) => {
        const isWinner = (this.props.sequence && this.props.sequence.indexOf(squareId) > -1) ? true : false;

        return (
          <Square key={squareId}
            isWinner = {isWinner}
            value={this.props.squares[squareId]}
            onClick={() => this.props.onClick(squareId)} />
          );
      });

      return squares;
    }
  
    render() {
      const rows = [0, 3, 6].map((id) => {
        return (
          <div className="board-row" key={id}>
            {this.renderSquare(id)}
          </div>
        );
      }); 

      return (
        <div>
          {rows}
        </div>
      );
    }
  }
  
  class Game extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        history: [{
          squares: Array(9).fill(null),
        }],
        stepNumber: 0,
        xIsNext: true,
        location: [ null, ],
        order: 'ascend',
      }
    }

    jumpTo(step) {
      this.setState({
        history: this.state.history.slice(0, step + 1),
        stepNumber: step,
        xIsNext: (step % 2) === 0,
        location: this.state.location.slice(0, step + 1),
      });
    }

    handleClick(i) {
      const history = this.state.history.slice(0, this.state.stepNumber + 1);
      const current = history[history.length - 1];
      const squares = current.squares.slice();
      const location = this.state.location.slice();
      
      if (calculateWinner(squares) || squares[i]) {
        return;
      }

      squares[i] = this.state.xIsNext ? 'X' : 'O';

      this.setState({
        history: history.concat([{
          squares: squares,
        }]),
        stepNumber: history.length,
        xIsNext: !this.state.xIsNext,
        location: location.concat([
          '(' + Math.floor(i / 3) + ', ' + i % 3 + ')'
        ]),
      });
    }

    handleSort() {
      const order = this.state.order;

      if (order === 'ascend') {
        this.setState({
          order: 'descend',
        });
      } else {
        this.setState({
          order: 'ascend',
        });
      }
    }

    render() {
      let history = this.state.history;
      const current =  history[this.state.stepNumber];
      const winner = calculateWinner(current.squares);
      const sortOrder = (this.state.order === 'ascend') ? 'Descending' : 'Ascending';

      let moves = history.map((step, move) => {
        const desc = (move) ? 'Go to move #' + move + ' at ' + 
          this.state.location[move] : 'Go to game start';

        if (move === this.state.stepNumber) {
          return (
            <li key={move}>
              <button onClick={() => this.jumpTo(move)}><strong>{desc}</strong></button>
            </li>
          );
        }

        return (
          <li key={move}>
            <button onClick={() => this.jumpTo(move)}>{desc}</button>
          </li>
        );
      });

      moves = (this.state.order === 'ascend') ? moves : moves.reverse();

      let status;
      if (winner) {
        status = 'Winner: ' + winner.side;
      } else if (!winner && !current.squares.includes(null)) {
        status = 'Game Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }

      return (
        <div className="game">
          <div className="game-board">
            <Board
              sequence={(winner) ? winner.sequence : null}
              squares={current.squares}
              onClick={(i) => this.handleClick(i)}
             />
          </div>
          <div className="game-info">
            <div>{status}</div>
            <button onClick={() => this.handleSort()}>Sort: {sortOrder}</button>
            <ol>{moves}</ol>
          </div>
        </div>
      );
    }
  }

  function calculateWinner(squares) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for(let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return {
          side: squares[a],
          sequence: lines[i].slice()
        };
      }
    }
    return null;
  }
  
  // ========================================
  
  ReactDOM.render(
    <Game />,
    document.getElementById('root')
  );
  