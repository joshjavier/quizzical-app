export default function Start(props) {
  return (
    <div className="start-page" hidden={props.isHidden}>
      <div className="container">
        <h1>Quizzical</h1>
        <p>Test your knowledge!</p>
        <button className="wide" onClick={props.handleClick}>
          Start quiz
        </button>
      </div>
    </div>
  );
}
