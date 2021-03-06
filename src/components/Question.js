import React, { Component } from 'react';
import PropTypes from 'prop-types';
import md5 from 'crypto-js/md5';
import { connect } from 'react-redux';
import { changeScore, clockStoper, hidden } from '../actions';
import { changeAssertions, requestQuestionsThunk } from '../actions/manageQuestions';

class Question extends Component {
  constructor(props) {
    super(props);

    this.assertions = 0;

    this.checkAnswer = this.checkAnswer.bind(this);
    this.answersButtonsFuncManeger = this.answersButtonsFuncManeger.bind(this);
    this.createAnswersButtons = this.createAnswersButtons.bind(this);
    this.saveStateKeyLocalStorage = this.saveStateKeyLocalStorage.bind(this);
    this.saveRankingKeyLocalStorage = this.saveRankingKeyLocalStorage.bind(this);
  }

  checkAnswer() {
    const { editHidden } = this.props;
    editHidden(false);
    const buttons = document.getElementsByClassName('button');
    const buttonsArray = Array.from(buttons);
    buttonsArray.map((button) => {
      if (button.name === 'correct-answer') {
        return button.classList.add('correctAnswer');
      }
      return button.classList.add('wrongAnswer');
    });
  }

  answersButtonsFuncManeger() {
    const { editClockStoper, index } = this.props;
    const finalQuestion = 4;
    this.checkAnswer();
    editClockStoper(true);
    if (index === finalQuestion) this.saveRankingKeyLocalStorage();
  }

  saveRankingKeyLocalStorage() {
    const { name, email, score } = this.props;
    const hashGerada = md5(email).toString();
    const avatar = `https://gravatar.com/avatar/${hashGerada}`;
    const ranking = JSON.parse(localStorage.getItem('ranking'));
    const rankingObj = { name, score, picture: avatar };
    if (ranking !== null) {
      const currentRanking = [...ranking, rankingObj];
      return localStorage.setItem('ranking', JSON.stringify(currentRanking));
    }
    localStorage.setItem('ranking', JSON.stringify([rankingObj]));
  }

  saveStateKeyLocalStorage(currentScore) {
    const { editScore, name, email, score, editAssertions } = this.props;
    const totalScore = score + currentScore;
    this.assertions += 1;
    editScore(currentScore);
    const state = { player: {
      name, assertions: this.assertions, score: totalScore, gravatarEmail: email,
    } };
    localStorage.setItem('state', JSON.stringify(state));
    // console.log(index);
    // if (index === finalQuestion) this.saveRankingKeyLocalStorage(totalScore);
    editAssertions();
  }

  saveScore() {
    let multiplier = 0;
    const factors = { null: 0, easy: 1, medium: 2, hard: 3, increment: 10 };
    const { props: { questions, currentTime, index } } = this;
    switch (questions[index].difficulty) {
    case 'easy':
      multiplier = factors.easy;
      break;
    case 'medium':
      multiplier = factors.medium;
      break;
    case 'hard':
      multiplier = factors.hard;
      break;
    default:
      multiplier = factors.null;
      break;
    }
    const currentScore = (multiplier * currentTime) + factors.increment;
    this.saveStateKeyLocalStorage(currentScore);
  }

  createAnswersButtons(answer, i) {
    const { props: { questions, disableAnswer, index } } = this;
    const incorrect = questions[index].incorrect_answers;
    if (answer === questions[index].correct_answer) {
      return (
        <button
          key={ i }
          type="button"
          disabled={ disableAnswer }
          name="correct-answer"
          className="button"
          data-testid="correct-answer"
          onClick={ () => {
            this.answersButtonsFuncManeger();
            this.saveScore();
          } }
        >
          {answer}
        </button>
      );
    }
    return (
      <button
        key={ i }
        type="button"
        disabled={ disableAnswer }
        name="wrong-answer"
        className="button"
        data-testid={ `wrong-answer-${incorrect.indexOf(answer)}` }
        onClick={ this.answersButtonsFuncManeger }
      >
        {answer}
      </button>
    );
  }

  render() {
    const { props: { questions, index, shuffle } } = this;
    return (
      <div>
        <h2 data-testid="question-category">
          {questions[index].category}
        </h2>
        <p data-testid="question-text">
          {questions[index].question}
        </p>
        {shuffle.map((answer, i) => this.createAnswersButtons(answer, i))}
      </div>
    );
  }
}

const mapStateToProps = ({
  player: { name, email, score },
  gameReducer: { disableAnswer, currentTime },
  questionsReducer: { questions, index, shuffle, wrongIndex },
}) => ({
  name,
  email,
  disableAnswer,
  currentTime,
  score,
  questions,
  index,
  shuffle,
  wrongIndex,
});

const mapDispatchToProps = (dispatch) => ({
  editHidden: (payload) => dispatch(hidden(payload)),
  editClockStoper: (payload) => dispatch(clockStoper(payload)),
  editScore: (payload) => dispatch(changeScore(payload)),
  getQuestions: (payload) => dispatch(requestQuestionsThunk(payload)),
  editAssertions: () => dispatch(changeAssertions()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Question);

Question.propTypes = {
  gameReducer: PropTypes.shape({
    disableAnswer: PropTypes.string,
    currentTime: PropTypes.string,
    score: PropTypes.string }),
  questionsReducer: PropTypes.shape({
    questions: PropTypes.string,
    index: PropTypes.string,
    shuffle: PropTypes.string }),
}.isRequired;
