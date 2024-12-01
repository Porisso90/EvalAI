import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import '../AnswerQuestionDetailPage.css';

const AnswerQuestionDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate(); // Usando useNavigate
  const [question, setQuestion] = useState<any | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState('');

  useEffect(() => {
    const fetchQuestion = async () => {
      const response = await fetch(`http://localhost:5000/questions/${id}`); // URL corrigida
      const data = await response.json();
      setQuestion(data);
    };

    fetchQuestion();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:5000/questions/${id}/answer`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ answer: selectedAnswer }),
    });
    const data = await response.json();
    if (response.ok) {
      alert(data.correct ? 'Você acertou!' : `Você errou! A resposta correta era ${data.correctAnswer}`);
      navigate('/answer'); // Redireciona para a página de responder perguntas
    } else {
      console.error(data); // Exibe erro
    }
  };

  const handleGoBack = () => {
    navigate('/answer'); // Volta para a página "Responder Perguntas"
  };

  if (!question) return <p>Carregando pergunta...</p>;

  return (
    <div className="answer-question-detail-page">
      <h2>{question.question_text}</h2>
      <form onSubmit={handleSubmit}>
        {question.options.map((option: any) => (
          <div key={option.id}>
            <input
              type="radio"
              id={option.letter}
              name="answer"
              value={option.letter}
              onChange={(e) => setSelectedAnswer(e.target.value)}
            />
            <label htmlFor={option.letter}>{option.option_text}</label>
          </div>
        ))}
        <button type="submit">Enviar Resposta</button>
      </form>
    </div>
  );
};

export default AnswerQuestionDetailPage;
