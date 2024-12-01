import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../AnswerQuestionsPage.css';

const AnswerQuestionsPage: React.FC = () => {
  const [questions, setQuestions] = useState<any[]>([]);

  useEffect(() => {
    const fetchQuestions = async () => {
      const response = await fetch('http://localhost:5000/questions'); // Certifique-se de usar a URL correta
      const data = await response.json();
      setQuestions(data);
    };

    fetchQuestions();
  }, []);

  return (
    <div className="answer-questions-page">
      <h2>Responder Perguntas</h2>
      <div className="questions-list">
        {questions.length === 0 ? (
          <p>Não há perguntas disponíveis.</p>
        ) : (
          questions.map((question: any) => (
            <div key={question.id} className="question-card">
              {/* Exibe o nome da pergunta */}
              <h4 className="question-title">{question.question_text}</h4> 
              <ul>
              </ul>
              <Link to={`/answer/${question.id}`} className="answer-button">
                Responder
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default AnswerQuestionsPage;
