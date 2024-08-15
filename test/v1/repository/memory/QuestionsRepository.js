import { Answer } from "../../../../src/v1/domain/entities/Answer.js";
import { Question } from "../../../../src/v1/domain/entities/Question.js";

export class QuestionsRepository {
    constructor(data) {
        this.data = data;
    }

    async save(question) {
        const found = this.data.questions.findIndex((q) => q.id === question.id);
        if (found === -1) this.data.questions.push(question);
        else {
            this.data.questions[found] = question;
        }
    }

    async searchById(id) {
        let questionFound;
        await this.data.evaluations.forEach((evaluation) => {
            questionFound = evaluation.questions.filter(
                (question) => question.id === id
            )[0];
        });

        if (!questionFound) throw new Error("Question not found");
        // Map data
        const question = new Question(questionFound);
        question.answers = questionFound.answers.map((_a) => {
            return new Answer(_a);
        });
        return question;
    }
}

