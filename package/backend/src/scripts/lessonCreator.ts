import fs from 'node:fs/promises';
import { ConstantsGame } from "src/core/constants";
import { lessonService } from "../services";
//import inputData from './inputData';

interface ILessonInput {
    amountQuestions?: string;
    answer0?: string;
    answer1?: string;
    answer2?: string;
    answer3?: string;
    answer4?: string;
    answer5?: string;
    correctAnswer?: string;
    correctAnswerIndex?: string;
    description?: string;
    gameStage?: string;
    maxPoints?: string;
    multiQuestion?: string;
    question?: string;
    questionNumber?: string;
    subquestionNumber?: string;
    timeInSek?: string;
    totalDurationMin?: string;
    type?: string;
}

let inputData = [];

function creator(): lessonService.Model.ILesson {
  const data: ILessonInput[] = [...inputData];
  
  // Group input data by questionNumber
  const questionsMap = new Map<string, ILessonInput[]>();
  
  data.forEach(item => {
    const questionNumber = item.questionNumber || '0';
    if (!questionsMap.has(questionNumber)) {
      questionsMap.set(questionNumber, []);
    }
    questionsMap.get(questionNumber)?.push(item);
  });
  
  // Process each question
  const questions: lessonService.Model.IQuestion[] = [];
  
  questionsMap.forEach((subquestionsData, questionNumber) => {
    // Find the first item to get question metadata
    const firstItem = subquestionsData[0];
    
    // Create question object
    const question: lessonService.Model.IQuestion = {
      amountQuestions: firstItem.amountQuestions ? parseInt(firstItem.amountQuestions, 10) : 1,
      gameStage: firstItem.gameStage as ConstantsGame.Game.STAGE_ENUM,
      maxPoints: firstItem.maxPoints ? parseInt(firstItem.maxPoints, 10) : 0,
      multiQuestion: firstItem.multiQuestion === 'true',
      totalDurationInMin: firstItem.totalDurationMin ? parseInt(firstItem.totalDurationMin, 10) : 0,
      type: firstItem.type as ConstantsGame.Question.TYPES_ENUM,
      subquestions: []
    };
    
    // Process subquestions
    subquestionsData.forEach(subquestionData => {
      const answers: string[] = [];
      for (let i = 0; i <= 5; i++) {
        const answerKey = `answer${i}` as keyof ILessonInput;
        if (subquestionData[answerKey]) {
          answers.push(subquestionData[answerKey] as string);
        }
      }
      
      const subquestion: lessonService.Model.ISubquestion = {
        answers,
        correctAnswer: subquestionData.correctAnswer && subquestionData.correctAnswer !== 'null' ? subquestionData.correctAnswer : null,
        correctAnswerIndex: subquestionData.correctAnswerIndex && subquestionData.correctAnswerIndex !== 'null' 
          ? parseInt(subquestionData.correctAnswerIndex, 10) 
          : null,
        description: subquestionData.description,
        question: subquestionData.question,
        timeInSek: subquestionData.timeInSek ? parseInt(subquestionData.timeInSek, 10) : 0,
        type: subquestionData.type as ConstantsGame.Question.TYPES_ENUM
      };
      
      question.subquestions?.push(subquestion);
    });
    
    questions.push(question);
  });
  
  // Create and return lesson
  const lesson: lessonService.Model.ILesson = {
    questions
  };
  
  return lesson;
}

export async function save() {
    const d = Date.now();
    const lesson = creator();

    await fs.writeFile('./output.json', JSON.stringify(lesson), 'utf-8');
    console.log(`Creating lesson took ${Date.now() - d} ms`);
}