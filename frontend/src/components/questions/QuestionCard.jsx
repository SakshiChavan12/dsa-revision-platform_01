function QuestionCard({ question }) {
  return (
    <div>
      <h3>{question.title}</h3>
      <p>{question.difficulty}</p>
    </div>
  );
}

export default QuestionCard;