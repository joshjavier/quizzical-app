import { nanoid } from "nanoid";

export default function Question(props) {

  const answerElements = props.answers.map(answer => {
    const id = nanoid();
    const isChecked = answer === props.userAnswer;
    const isCorrect = answer === props.correctAnswer;

    const style = {
      backgroundColor: isCorrect ? "#94D7A2"
        : isChecked ? "#F8BCBC"
        : null,
      borderColor: (isCorrect || isChecked) ? "transparent" : null,
      opacity: !(isCorrect || isChecked) ? 0.5 : null
    };

    return (
      <div key={id}>

        <input
          id={id}
          type="radio"
          className="answer"
          value={answer}
          name={props.name}
          onChange={props.handleChange}
          checked={isChecked}
          disabled={props.score !== null}
        />

        <label
          htmlFor={id}
          className="answer-label"
          style={ (props.score !== null) ? style : null }
        >
          {answer}
        </label>

      </div>
    );
  });

  return (
    <li className="question-block">
      <fieldset>
        <legend className="question">{props.question}</legend>
        <div className="answer-list">
          {answerElements}
        </div>
      </fieldset>
    </li>
  );
}
