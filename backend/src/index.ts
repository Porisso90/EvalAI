import { createQuestion, createOption, getQuestions, getOptions, getCorrectAnswer, pool } from './database';
import * as readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Função para criar uma nova pergunta
const createQuestionInterface = async () => {
  rl.question('Enter the question text: ', async (questionText) => {
    rl.question('Enter the correct answer (a, b, c or d): ', async (correctAnswer) => {
      if (['a', 'b', 'c', 'd'].includes(correctAnswer)) {
        const questionId = await createQuestion(questionText, correctAnswer);
        console.log(`Question created with ID ${questionId}`);

        // Agora, criaremos as opções da pergunta
        await createOptionsInterface(questionId, correctAnswer);
      } else {
        console.log('Invalid correct answer. Please enter a, b, c or d.');
        createQuestionInterface();
      }
    });
  });
};

// Função para criar opções para uma pergunta
const createOptionsInterface = async (questionId: number, correctAnswer: string) => {
  const letters = ['a', 'b', 'c', 'd'];
  const options: string[] = [];

  // Pede o texto para cada opção
  for (let i = 0; i < letters.length; i++) {
    const optionText = await new Promise<string>((resolve) => {
      rl.question(`Enter option ${letters[i]} text: `, (answer) => {
        resolve(answer);
      });
    });
    
    // Armazena as opções em um array para utilizar depois
    options.push(optionText);

    // Cria a opção no banco de dados
    await createOption(questionId, letters[i], optionText);
    console.log(`Option ${letters[i]} created for question ${questionId}`);
  }

  // Atualiza a tabela de perguntas para definir a resposta correta
  await updateCorrectAnswer(questionId, correctAnswer);
  
  askWhatToDoNext();
};

// Função para atualizar a resposta correta no banco de dados
const updateCorrectAnswer = async (questionId: number, correctAnswer: string) => {
  const connection = await pool.getConnection(); // Agora 'pool' está acessível
  try {
    await connection.query(
      'UPDATE questions SET correct_answer = ? WHERE id = ?',
      [correctAnswer, questionId]
    );
    console.log(`Correct answer for question ${questionId} set to ${correctAnswer}`);
  } finally {
    connection.release();
  }
};

// Função para responder às perguntas
const answerQuestionsInterface = async () => {
  const questions = await getQuestions();
  if (questions.length === 0) {
    console.log('No questions available.');
    askWhatToDoNext();
    return;
  }

  console.log('Available questions:');
  questions.forEach((question) => {
    console.log(`${question.id}. ${question.question_text}`);
  });

  rl.question('Enter the number of the question you want to answer: ', async (answerIndex) => {
    const index = parseInt(answerIndex, 10);
    const question = questions.find((q) => q.id === index);
    if (question) {
      const correctAnswer = await getCorrectAnswer(question.id);
      if (correctAnswer) {
        const options = await getOptions(question.id);
        console.log(`Question: ${question.question_text}`);
        options.forEach((option) => {
          console.log(`${option.letter}. ${option.option_text}`);
        });

        rl.question('Enter the letter of your answer: ', async (answer) => {
          if (answer.toLowerCase() === correctAnswer.letter) {
            console.log('Correct!');
          } else {
            console.log(`Sorry, the correct answer was ${correctAnswer.letter}.`);
          }

          askWhatToDoNext();
        });
      } else {
        console.log('No correct answer found for this question.');
        askWhatToDoNext();
      }
    } else {
      console.log('Invalid question number.');
      answerQuestionsInterface();
    }
  });
};

// Função para perguntar o que fazer a seguir
const askWhatToDoNext = async () => {
  rl.question('What would you like to do next? (1) Create a new question, (2) Answer questions, (3) Terminate process: ', async (answer) => {
    switch (answer) {
      case '1':
        await createQuestionInterface();
        break;
      case '2':
        await answerQuestionsInterface();
        break;
      case '3':
        rl.close();
        break;
      default:
        console.log('Invalid answer. Please try again.');
        askWhatToDoNext();
    }
  });
};

// Função principal para iniciar o processo
const main = async () => {
  await askWhatToDoNext();
};

main();
