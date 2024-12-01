import React from 'react';
import { Link } from 'react-router-dom';
import '../Home.css';
import heroImage from '../assets/hero-image.jpg';

const Home: React.FC = () => {
  return (
    <div className="home-container">
      {/* Cabeçalho */}
      <header className="home-header">
        <div className="logo">
          <h1>EvalAI</h1>
        </div>
        <nav className="home-nav">
          <Link to="/create">Criar Questões</Link>
          <Link to="/answer">Responder Perguntas</Link>
          <Link to="/login">Login</Link>
        </nav>
      </header>

      {/* Seção Hero */}
      <section className="hero-section">
        <div className="hero-text">
          <h2>Desenvolvimento de Provas</h2>
          <p>
            Simplifique a criação de avaliações com nosso sistema inteligente. Experimente agora!
          </p>
          <Link to="/create" className="hero-button">Começar</Link>
        </div>
        <div className="hero-image">
          {/* Adicione aqui uma imagem ilustrativa */}
          <img src={heroImage} alt="Desenvolvimento de Provas" />
        </div>
      </section>

      {/* Seção de Funcionalidades */}
      <section className="features-section">
        <h3>Funcionalidades</h3>
        <div className="features-grid">
          <div className="feature-card">
            <Link to="/create">
            <h4>Criar Questões</h4>
            </Link>
            <p>Monte avaliações personalizadas de forma prática.</p>
          </div>
          <div className="feature-card">
            <Link to="/answer">
            <h4>Responder Questões</h4>
            </Link>
            <p>Teste seus conhecimentos de forma interativa.</p>
          </div>
        </div>
      </section>

      {/* Seção de Perguntas Recentes */}
      <section className="recent-questions-section">
        <h3>Perguntas Recentes</h3>
        <div className="questions-grid">
          {/* Aqui você pode mapear as perguntas do backend */}
          <div className="question-card">
            <h4>Quanto é 1 + 1?</h4>
            <p>Opções: a) 2, b) 3, c) 4, d) 5</p>
          </div>
          <div className="question-card">
            <h4>Qual a capital do Brasil?</h4>
            <p>Opções: a) Rio de Janeiro, b) Brasília, c) São Paulo, d) Salvador</p>
          </div>
        </div>
      </section>

      {/* Rodapé */}
      <footer className="home-footer">
        <p>© 2024 EvalAI. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;
