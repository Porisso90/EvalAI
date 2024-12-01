import React, { useState } from 'react';
import { createQuestion } from '../services/api';

const QuestionForm: React.FC = () => {
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState<string[]>(['', '', '', '']);

  const handleOptionChange = (index: number, value: string) => {
    const updatedOptions = [...options];
    updatedOptions[index] = value;
    setOptions(updatedOptions);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!questionText || !correctAnswer || options.some(option => !option)) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    try {
      await createQuestion(questionText, correctAnswer, options);
      alert('Pergunta criada com sucesso!');
      setQuestionText('');
      setCorrectAnswer('');
      setOptions(['', '', '', '']);
    } catch (error) {
      console.error('Erro ao criar pergunta:', error);
      alert('Erro ao criar pergunta. Tente novamente.');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Pergunta:</label>
        <input
          type="text"
          value={questionText}
          onChange={(e) => setQuestionText(e.target.value)}
        />
      </div>
      <div>
        <label>Resposta Correta (a, b, c, d):</label>
        <input
          type="text"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          maxLength={1}
        />
      </div>
      <div>
        {['a', 'b', 'c', 'd'].map((letter, index) => (
          <div key={letter}>
            <label>Opção {letter}:</label>
            <input
              type="text"
              value={options[index]}
              onChange={(e) => handleOptionChange(index, e.target.value)}
            />
          </div>
        ))}
      </div>
      <button type="submit">Criar Pergunta</button>
    </form>
  );
};

export default QuestionForm;
