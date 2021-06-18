import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Header from '../components/Header';

class Feedback extends Component {
  render() {
    const { score, assertions } = this.props;
    const averageAssertions = 3;
    const disappointment = 'Podia ser melhor...';
    const congratulations = 'Mandou bem!';
    return (
      <div>
        <Header />
        <section>
          <h3 data-testid="feedback-text">
            {assertions < averageAssertions ? disappointment : congratulations}
          </h3>
          <h4 data-testid="feedback-total-score">
            {score}
          </h4>
          <h4 data-testid="feedback-total-question">
            {assertions}
          </h4>
        </section>
      </div>
    );
  }
}

const mapStateToProps = ({ player: { score, assertions } }) => ({
  score,
  assertions,
});

Feedback.propTypes = {
  score: PropTypes.number.isRequired,
  assertions: PropTypes.number.isRequired,
};

export default connect(mapStateToProps)(Feedback);