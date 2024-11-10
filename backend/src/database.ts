import mysql, { ResultSetHeader, RowDataPacket } from 'mysql2/promise';

export const pool = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'guitarhero',
  database: 'EvalAI'
});

// Função para obter todas as perguntas
export const getQuestions = async () => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>('SELECT * FROM questions');
      return rows;
    } finally {
      connection.release();
    }
};

// Função para obter a resposta correta de uma pergunta
export const getCorrectAnswer = async (questionId: number) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query<RowDataPacket[]>(
        'SELECT o.letter, o.option_text FROM options o INNER JOIN questions q ON o.question_id = q.id WHERE q.id = ? AND o.letter = q.correct_answer',
        [questionId]
      );
  
      if (rows.length === 0) {
        console.log('Não foi encontrada uma resposta correta para a pergunta.');
        return null;
      }
  
      return {
        letter: rows[0].letter,
        option_text: rows[0].option_text
      };
    } finally {
      connection.release();
    }
}

// Função para obter todas as opções de uma pergunta
export const getOptions = async (questionId: number) => {
    const connection = await pool.getConnection();
    try {
      const [rows] = await connection.query('SELECT * FROM options WHERE question_id = ?', [questionId]);
      return rows as any[];
    } finally {
      connection.release();
    }
};

// Função para criar uma nova pergunta e retornar o ID dela
export const createQuestion = async (questionText: string, correctAnswer: string) => {
    const connection = await pool.getConnection();
    try {
      // Insere a pergunta na tabela `questions`
      const [result] = await connection.query<ResultSetHeader>(
        'INSERT INTO questions (question_text, correct_answer) VALUES (?, ?)',
        [questionText, correctAnswer]
      );
      const questionId = result.insertId;
      return questionId;
    } finally {
      connection.release();
    }
};

// Função para criar uma nova opção associada a uma pergunta
export const createOption = async (questionId: number, letter: string, optionText: string) => {
    const connection = await pool.getConnection();
    try {
      await connection.query(
        'INSERT INTO options (question_id, letter, option_text) VALUES (?, ?, ?)',
        [questionId, letter, optionText]
      );
    } finally {
      connection.release();
    }
};
