import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/HomePage';
import CreateQuestionPage from './pages/CreateQuestionPage';
import AnswerQuestionsPage from './pages/AnswerQuestionPage';
import AnswerQuestionDetailPage from './pages/AnswerQuestionDetailPage';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create" element={<CreateQuestionPage />} />
        <Route path="/answer" element={<AnswerQuestionsPage />} />
        <Route path="/answer/:id" element={<AnswerQuestionDetailPage />} />
      </Routes>
    </Router>
  );
};

export default App;
