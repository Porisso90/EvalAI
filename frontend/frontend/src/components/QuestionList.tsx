import React, { useState, useEffect } from 'react';
import { getQuestions, answerQuestion } from '../services/api';

const QuestionList: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);
  const [selectedAnswer, setSelectedAnswer] = useState<{ [key: number]: string }>({});

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const data = await getQuestions();
        setQuestions(data);
      } catch (error) {
        console.error('Erro ao buscar perguntas:', error);
        alert('Erro ao carregar perguntas.');
      }
    };

    fetchQuestions();
  }, []);

  const handleAnswer = async (questionId: number) => {
    const answer = selectedAnswer[questionId];
    if (!answer) {
      alert('Por favor, selecione uma resposta.');
      return;
    }

    try {
      const result = await answerQuestion(questionId, answer);
      if (result.correct) {
        alert('Resposta correta!');
      } else {
        alert(`Resposta errada. A resposta correta é ${result.correctAnswer}.`);
      }
    } catch (error) {
      console.error('Erro ao responder pergunta:', error);
      alert('Erro ao enviar resposta.');
    }
  };

  return (
    <div>
      <h2>Perguntas</h2>
      {questions.map((question) => (
        <div key={question.id}>
          <p>{question.question_text}</p>
          <div>
            {question.options.map((option: any) => (
              <label key={option.letter}>
                <input
                  type="radio"
                  name={`question-${question.id}`}
                  value={option.letter}
                  onChange={() =>
                    setSelectedAnswer({
                      ...selectedAnswer,
                      [question.id]: option.letter,
                    })
                  }
                />
                {option.letter}. {option.option_text}
              </label>
            ))}
          </div>
          <button onClick={() => handleAnswer(question.id)}>Responder</button>
        </div>
      ))}
    </div>
  );
};

export default QuestionList;
