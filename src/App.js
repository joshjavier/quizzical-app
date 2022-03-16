import React from "react";
import { decode } from "html-entities";
import { nanoid } from "nanoid";
import Start from "./components/Start";
import Questions from "./components/Questions";


/*------------------------------------*\
  #HELPER-FUNCTIONS
\*------------------------------------*/

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function processData(item) {
  // Decode html entities in the questions and answers
  const question = decode(item.question);
  const correctAnswer = decode(item.correct_answer);
  const incorrectAnswers = item.incorrect_answers.map(answer => decode(answer));

  // Combine and shuffle answers into a single array
  const answers = [correctAnswer, ...incorrectAnswers];
  shuffle(answers);

  return {
    question: question,
    answers: answers,
    correctAnswer: correctAnswer,
    // Set a unique identifier for each question
    id: nanoid(),
    // Add a property where we'll store the user's answer
    userAnswer: ""

    // Properties like category and difficulty don't need to be extracted
    // from the raw data since they're not actually rendered in the UI.
  };
}

/*------------------------------------*\
  #MAIN-COMPONENT
\*------------------------------------*/

export default function App() {
  const [quiz, setQuiz] = React.useState({
    hasStarted: false,
    questions: [],
    round: 1,
    score: null
  });

  React.useEffect(() => {
    async function getQuestionsFromOtdb(amount = 5, category = 31, difficulty = "easy") {
      let url = "https://opentdb.com/api.php?type=multiple";

      category = ""
      let options = (
        (amount && "&amount=" + amount) +
        (category && "&category=" + category) +
        (difficulty && "&difficulty=" + difficulty)
      );

      url += options;

      try {
        const response = await fetch(url);
        const data = await response.json();
        const questions = await data.results.map(processData)

        setQuiz(prevState => ({
          ...prevState,
          questions: questions
        }));

      } catch(err) {
        console.log(err);
      }
    }


    getQuestionsFromOtdb();
  }, [quiz.round]);

  function startQuiz() {
    setQuiz(prevState => ({
      ...prevState,
      hasStarted: true
    }));
  }

  function newQuiz() {
    setQuiz(prevState => ({
      round: prevState.round + 1,
      hasStarted: false,
      questions: [],
      score: null
    }));
  }

  function checkAnswers() {
    const correctAnswers = quiz.questions.map(item => item.correctAnswer);
    const userAnswers = quiz.questions.map(item => item.userAnswer);
    // These two arrays will always have the same length even if the
    // user skips some questions, since by default userAnswer = ""

    // Optional: require all questions to be answered before tallying
    // if (userAnswers.some(answer === "")) {
    //   alert("You need to answer all questions.")
    //   return
    // }

    let score = 0;
    for (let i = 0; i < quiz.questions.length; i++) {
      if (correctAnswers[i] === userAnswers[i]) {
        score += 1;
      }
    }

    setQuiz(prevState => ({
      ...prevState,
      score: score
    }));
  }

  function handleChange(event) {
    const { name, value } = event.target;

    setQuiz(prevState => ({
      ...prevState,
      questions: prevState.questions.map(item => {
        return (item.id === name)
          ? { ...item, userAnswer: value }
          : item
      })
    }));
  }

  return (
    <div>

      <Start
        isHidden={quiz.hasStarted}
        handleClick={startQuiz}
      />

      <Questions
        isHidden={!quiz.hasStarted}
        data={quiz.questions}
        score={quiz.score}
        handleChange={handleChange}
        checkAnswers={checkAnswers}
        newQuiz={newQuiz}
      />

    </div>
  );
}
