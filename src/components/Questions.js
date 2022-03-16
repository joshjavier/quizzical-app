import Question from "./Question";

export default function Questions(props) {
  const questionElements = props.data.map(item => (
    <Question
      key={item.id}
      name={item.id}
      question={item.question}
      answers={item.answers}
      correctAnswer={item.correctAnswer}
      userAnswer={item.userAnswer}
      score={props.score}
      handleChange={props.handleChange}
    />
  ));

  return (
    <div className="questions-page" hidden={props.isHidden}>
      <div className="container">

        <ul>
          { questionElements }
        </ul>

        <div className="footer">
          {
            (props.score === null) &&
            <button onClick={props.checkAnswers}>Check answers</button>
          }
          {
            (props.score !== null) &&
            <>
              <p className="result">
                You scored {props.score}/{props.data.length} correct answers
              </p>
              <button onClick={props.newQuiz}>Play again</button>
            </>
          }
        </div>

      </div>
    </div>
  );
}
