import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../CreateQuestionPage.css';

const CreateQuestionPage: React.FC = () => {
  const [questionText, setQuestionText] = useState('');
  const [correctAnswer, setCorrectAnswer] = useState('');
  const [options, setOptions] = useState(['', '', '', '']); // Mudando para um array

  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newOptions = [...options];
    newOptions[index] = e.target.value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Verificando se todas as opções foram preenchidas
    if (options.some(option => option === '')) {
      alert('Preencha todas as opções!');
      return;
    }

    const response = await fetch('http://localhost:5000/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        questionText,
        correctAnswer,
        options, // Enviando como um array de opções
      }),
    });

    const data = await response.json();

    if (response.ok) {
      navigate('/'); // Redireciona para a Home após sucesso
    } else {
      console.error(data); // Exibe erro
    }
  };

  return (
    <div className="create-question-page">
      <h2>Criar Nova Pergunta</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Pergunta:</label>
          <input
            type="text"
            name="questionText"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
          />
        </div>
        <div>
          <label>Resposta Correta (a, b, c ou d):</label>
          <input
            type="text"
            name="correctAnswer"
            value={correctAnswer}
            onChange={(e) => setCorrectAnswer(e.target.value)}
          />
        </div>
        <div>
          <label>Opção A:</label>
          <input
            type="text"
            value={options[0]}
            onChange={(e) => handleInputChange(e, 0)}
          />
        </div>
        <div>
          <label>Opção B:</label>
          <input
            type="text"
            value={options[1]}
            onChange={(e) => handleInputChange(e, 1)}
          />
        </div>
        <div>
          <label>Opção C:</label>
          <input
            type="text"
            value={options[2]}
            onChange={(e) => handleInputChange(e, 2)}
          />
        </div>
        <div>
          <label>Opção D:</label>
          <input
            type="text"
            value={options[3]}
            onChange={(e) => handleInputChange(e, 3)}
          />
        </div>
        <button type="submit" className='submit-button'>Salvar Pergunta</button>
      </form>
    </div>
  );
};

export default CreateQuestionPage;
