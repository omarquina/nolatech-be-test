import { Answer } from "../../../../src/v1/domain/entities/Answer.js";
import { Evaluation } from "../../../../src/v1/domain/entities/Evaluation.js";
import { Question } from "../../../../src/v1/domain/entities/Question.js";

export class EvaluationRepository {
  constructor(data) {
    this.data = data;
  }

  async save(evaluation) {
    const found = this.data.questions.findIndex((e) => e.id === evaluation.id);
    if (found === -1) {
      this.data.evaluations.push(evaluation);
    } else {
      this.data.evaluations[found] = evaluation;
    }
    await this.saveQuestions(evaluation.questions);
  }

  async saveQuestions(questions) {
    Promise.all(questions.map((q) => this.saveQuestion(q)));
  }

  async saveQuestion(question) {
    const found = this.data.questions.findIndex((q) => q.id === question.id);
    if (found === -1) this.data.questions.push(question);
    else {
      this.data.questions[found] = question;
    }
  }

  async searchById(id) {
    //console.dir(this.data, id);
    const result = await this.data.evaluations.filter(
      (item) => item.id === id
    )[0];
    const evaluation = new Evaluation(result);
    evaluation.questions = result.questions.map((_q) => {
      const question = new Question(_q);
      question.answers = _q.answers.map((_a) => {
        return new Answer(_a);
      });
      return question;
    });

    return evaluation;
  }
}

