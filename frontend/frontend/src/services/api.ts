import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/', // URL do backend
});

export const getQuestions = async () => {
  const response = await api.get('/questions');
  return response.data;
};

export const createQuestion = async (questionText: string, correctAnswer: string, options: string[]) => {
  const response = await api.post('/questions', {
    questionText,
    correctAnswer,
    options,
  });
  return response.data;
};

export const answerQuestion = async (id: number, answer: string) => {
  const response = await api.post(`/questions/${id}/answer`, { answer });
  return response.data;
};

export default api;
