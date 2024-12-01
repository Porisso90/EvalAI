import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { createQuestion, createOption, getQuestions, getOptions, getCorrectAnswer, pool } from './database';
import { RowDataPacket } from 'mysql2';  // Importando a tipagem correta

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Teste inicial
app.get('/', (req, res) => {
  res.send('Backend está rodando!');
});

app.post('/questions', async (req, res) => {
    const { questionText, correctAnswer, options } = req.body;
  
    if (!questionText || !correctAnswer || !options || options.length !== 4) {
      return res.status(400).json({ error: 'Dados inválidos' });
    }
  
    try {
      const questionId = await createQuestion(questionText, correctAnswer);
      for (const [index, optionText] of options.entries()) {
        const letter = ['a', 'b', 'c', 'd'][index];
        await createOption(questionId, letter, optionText);
      }
      res.status(201).json({ message: 'Pergunta criada com sucesso!', questionId });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao criar pergunta.' });
    }
  });

  app.get('/questions', async (req, res) => {
    try {
      const questions = await getQuestions();
      const questionsWithOptions = await Promise.all(
        questions.map(async (q) => {
          const options = await getOptions(q.id);
          return { ...q, options };
        })
      );
      res.status(200).json(questionsWithOptions);
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar perguntas.' });
    }
  });

  const getQuestionById = async (id: number) => {
    try {
      // Consulta a questão pelo ID
      const questionQuery = 'SELECT * FROM questions WHERE id = ?';
      const [questionRows] = await pool.execute<RowDataPacket[]>(questionQuery, [id]);  // Usando RowDataPacket[] como retorno
  
      // Se não encontrar a questão, retorna null
      if (questionRows.length === 0) {
        return null;
      }
  
      const question = questionRows[0];
  
      // Consulta as opções dessa questão
      const optionsQuery = 'SELECT * FROM options WHERE question_id = ?';
      const [optionsRows] = await pool.execute<RowDataPacket[]>(optionsQuery, [id]);  // Usando RowDataPacket[] para as opções
  
      // Formata as opções
      const options = optionsRows.map((row: any) => ({
        letter: row.letter,
        option_text: row.option_text,
      }));
  
      // Retorna a questão com as opções
      return {
        id: question.id,
        question_text: question.question_text,
        correct_answer: question.correct_answer,
        options,
      };
    } catch (error) {
      console.error('Erro ao obter a questão:', error);
      throw new Error('Erro ao buscar a questão');
    }
  };
  
  // Rota para obter uma pergunta específica
  app.get('/questions/:id', async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
  
    try {
      const question = await getQuestionById(questionId);
  
      if (!question) {
        return res.status(404).json({ error: 'Pergunta não encontrada.' });
      }
  
      res.status(200).json(question);  // Retorna a questão com as opções
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar pergunta.' });
    }
  });
  
  

  app.post('/questions/:id/answer', async (req, res) => {
    const questionId = parseInt(req.params.id, 10);
    const { answer } = req.body;
  
    if (!answer) {
      return res.status(400).json({ error: 'Resposta não fornecida' });
    }
  
    try {
      const correctAnswer = await getCorrectAnswer(questionId);
  
      if (!correctAnswer) {
        return res.status(404).json({ error: 'Pergunta não encontrada.' });
      }
  
      const isCorrect = correctAnswer.letter === answer.toLowerCase();
      res.status(200).json({
        correct: isCorrect,
        correctAnswer: correctAnswer.letter,
      });
    } catch (error) {
      res.status(500).json({ error: 'Erro ao verificar resposta.' });
    }
  });

  
// Servidor
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
